import json, base64, re
import numpy as np
from pathlib import Path

def process_directory(out_dir: Path):
    html_p = out_dir / 'umap_3d_point_cloud.html'
    if not html_p.exists():
        return
    
    # Load papers.json for rich metadata if available
    papers_map = {}
    papers_candidates = [
        out_dir / 'papers.json',
        Path('data/satellite_300_papers.json'),
        Path('data/fl_papers.json'),
        Path('data/gnn_drug_3k_papers.json'),
        Path('data/papers.json')
    ]
    for cand in papers_candidates:
        if cand.exists():
            try:
                for p in json.loads(cand.read_text(encoding='utf-8')):
                    pid = p.get('id') or p.get('s2_paper_id') or p.get('paperId')
                    if pid:
                        papers_map[pid] = p
            except Exception:
                pass
                
    html = html_p.read_text(encoding='utf-8')
    idx = html.rfind('Plotly.newPlot(')
    if idx == -1:
        return
    
    first_bracket = html.find('[', idx)
    count = 0
    end_bracket = -1
    for i in range(first_bracket, len(html)):
        if html[i] == '[': count += 1
        elif html[i] == ']':
            count -= 1
            if count == 0:
                end_bracket = i
                break
    if end_bracket == -1:
        return
        
    traces = json.loads(html[first_bracket:end_bracket+1])
    clusters = []
    all_points = []
    
    for cluster_idx, t in enumerate(traces):
        name = t.get('name', f'Cluster {cluster_idx}')
        color = t.get('marker', {}).get('color', '#38bdf8')
        is_noise = 'outlier' in name.lower()
        
        # Decode arrays
        def decode_axis(ax_obj):
            if isinstance(ax_obj, dict) and 'bdata' in ax_obj:
                return np.frombuffer(base64.b64decode(ax_obj['bdata']), dtype=ax_obj['dtype']).tolist()
            elif isinstance(ax_obj, list):
                return ax_obj
            return []
            
        xs = decode_axis(t.get('x'))
        ys = decode_axis(t.get('y'))
        zs = decode_axis(t.get('z'))
        texts = t.get('text', [])
        
        cluster_points = []
        for j in range(len(xs)):
            raw_text = texts[j] if j < len(texts) else ''
            
            # Extract paper ID from hover HTML: <b>Paper:</b> 001906970cf7 or similar
            pid_match = re.search(r'<b>(?:Paper|\[Outlier\]):?</b>\s*([a-zA-Z0-9\.\-\_\/]+)', raw_text)
            pid = pid_match.group(1).strip() if pid_match else ''
            
            meta = papers_map.get(pid, {})
            title = meta.get('title') or ''
            if not title and '<br>' in raw_text:
                parts = raw_text.split('<br>')
                if len(parts) >= 3:
                    title = re.sub(r'<[^>]+>', '', parts[2]).strip()
            if not title:
                title = f"Paper {pid}" if pid else f"Document {j+1}"
                
            pt = {
                'id': pid or f"pt_{cluster_idx}_{j}",
                'x': round(float(xs[j]), 3),
                'y': round(float(ys[j]), 3),
                'z': round(float(zs[j]), 3),
                'cluster_id': -1 if is_noise else cluster_idx,
                'cluster_name': name,
                'color': color,
                'title': title,
                'authors': meta.get('authors', []),
                'year': meta.get('year') or 2023,
                'citations': meta.get('citation_count') or meta.get('citationCount') or 0,
                'venue': meta.get('venue') or 'Academic Conference',
                'tldr': meta.get('tldr') or '',
                'abstract': meta.get('abstract') or '',
                'doi': meta.get('doi') or ''
            }
            cluster_points.append(pt)
            all_points.append(pt)
            
        # Calculate cluster centroid
        if cluster_points and not is_noise:
            cx = float(np.mean([p['x'] for p in cluster_points]))
            cy = float(np.mean([p['y'] for p in cluster_points]))
            cz = float(np.mean([p['z'] for p in cluster_points]))
            clusters.append({
                'cluster_id': cluster_idx,
                'name': name,
                'color': color,
                'point_count': len(cluster_points),
                'centroid': {'x': round(cx, 3), 'y': round(cy, 3), 'z': round(cz, 3)},
                'points': cluster_points
            })
        elif is_noise:
            clusters.append({
                'cluster_id': -1,
                'name': name,
                'color': color,
                'point_count': len(cluster_points),
                'centroid': {'x': 0, 'y': 0, 'z': 0},
                'points': cluster_points
            })
            
    # Load gaps to compute 3D gap bridges between clusters
    gaps_file = out_dir / 'detected_gaps.json'
    gaps_3d = []
    if gaps_file.exists():
        try:
            gaps_data = json.loads(gaps_file.read_text(encoding='utf-8')).get('gaps', [])
            for idx, g in enumerate(gaps_data[:5]):
                # Place gap bridge in 3D space between clusters
                c1 = clusters[idx % len(clusters)] if clusters else None
                c2 = clusters[(idx + 1) % len(clusters)] if len(clusters) > 1 else None
                if c1 and c2 and c1['cluster_id'] != -1 and c2['cluster_id'] != -1:
                    mid_x = (c1['centroid']['x'] + c2['centroid']['x']) / 2
                    mid_y = (c1['centroid']['y'] + c2['centroid']['y']) / 2
                    mid_z = (c1['centroid']['z'] + c2['centroid']['z']) / 2 + 1.2
                    gaps_3d.append({
                        'gap_id': f"gap_{idx+1}",
                        'rank': idx + 1,
                        'title': g.get('title'),
                        'method': g.get('method'),
                        'dataset': g.get('dataset'),
                        'limitation': g.get('limitation'),
                        'score': g.get('score'),
                        'uzzi_z_score': g.get('uzzi_z_score', -1.45),
                        'description': g.get('description'),
                        'source_cluster': c1['cluster_id'],
                        'target_cluster': c2['cluster_id'],
                        'centroid': {'x': round(mid_x, 3), 'y': round(mid_y, 3), 'z': round(mid_z, 3)}
                    })
        except Exception as e:
            print(f"Error parsing gaps for {out_dir.name}: {e}")

    result = {
        'total_points': len(all_points),
        'clusters': clusters,
        'gaps_3d': gaps_3d,
        'bounds': {
            'min_x': min(p['x'] for p in all_points) if all_points else -10,
            'max_x': max(p['x'] for p in all_points) if all_points else 10,
            'min_y': min(p['y'] for p in all_points) if all_points else -10,
            'max_y': max(p['y'] for p in all_points) if all_points else 10,
            'min_z': min(p['z'] for p in all_points) if all_points else -10,
            'max_z': max(p['z'] for p in all_points) if all_points else 10,
        }
    }
    
    dest = out_dir / 'cluster_3d_points.json'
    dest.write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(f"Successfully processed {out_dir.name}: {len(all_points)} 3D points, {len(clusters)} clusters, {len(gaps_3d)} 3D gap anchors.")

for out_dir in Path('data').glob('output*'):
    process_directory(out_dir)
