import json
import base64
import re
import numpy as np
from pathlib import Path


def process_directory(out_dir: Path):
    html_p = out_dir / 'umap_3d_point_cloud.html'
    if not html_p.exists():
        return
    
    # 1. Load topic_results.json for authoritative cluster titles
    topic_results_p = out_dir / 'topic_results.json'
    topic_names_map = {}
    topic_kws_map = {}
    if topic_results_p.exists():
        try:
            t_data = json.loads(topic_results_p.read_text(encoding='utf-8'))
            for k, v in t_data.get('human_readable_names', {}).items():
                try:
                    topic_names_map[int(k)] = v
                except Exception:
                    pass
            for k, v in t_data.get('topic_keywords', {}).items():
                try:
                    topic_kws_map[int(k)] = v
                except Exception:
                    pass
        except Exception as e:
            print(f"[EXPORT 3D] Warning loading topic_results.json in {out_dir.name}: {e}")

    # 2. Load papers.json for rich metadata if available
    papers_map = {}
    papers_candidates = [
        out_dir / 'papers.json',
        Path('data/papers.json')
    ]
    # Check parent datasets matching directory name
    dataset_base = out_dir.name.replace("output_", "")
    papers_candidates.append(Path(f"data/{dataset_base}_papers.json"))
    papers_candidates.append(Path(f"data/{dataset_base}.json"))

    for cand in papers_candidates:
        if cand.exists():
            try:
                for p in json.loads(cand.read_text(encoding='utf-8')):
                    pid = str(p.get('id') or p.get('s2_paper_id') or p.get('paperId') or '')
                    if pid:
                        papers_map[pid] = p
            except Exception:
                pass
                
    html = html_p.read_text(encoding='utf-8')
    idx = html.rfind('Plotly.newPlot(')
    if idx == -1:
        return
    
    first_bracket = html.find('[', idx)
    in_string = False
    escape = False
    count = 0
    end_bracket = -1
    for i in range(first_bracket, len(html)):
        c = html[i]
        if escape:
            escape = False
            continue
        if c == '\\':
            escape = True
            continue
        if c == '"':
            in_string = not in_string
            continue
        if not in_string:
            if c == '[':
                count += 1
            elif c == ']':
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
        raw_trace_name = t.get('name', f'Cluster {cluster_idx}')
        color = t.get('marker', {}).get('color', '#38bdf8')
        is_noise = 'outlier' in raw_trace_name.lower() or 'floating' in raw_trace_name.lower()
        
        # Determine actual cluster integer ID
        actual_tid = -1 if is_noise else cluster_idx
        m = re.search(r'Topic\s*(-?\d+)', raw_trace_name)
        if m:
            actual_tid = int(m.group(1))

        # Retrieve full, non-truncated name from topic_results.json
        if actual_tid in topic_names_map:
            name = topic_names_map[actual_tid]
        elif is_noise and -1 in topic_names_map:
            name = topic_names_map[-1]
        else:
            name = re.sub(r'^Topic\s*\d+\s*[:\-]\s*', '', raw_trace_name).strip() or raw_trace_name

        # Decode coordinates
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
            
            # Extract paper ID from hover HTML: <b>ID:</b> 001906970cf7 or similar
            pid_match = re.search(r'<b>(?:ID|\[Outlier\]):?</b>\s*([a-zA-Z0-9\.\-\_\/]+)', raw_text)
            if not pid_match:
                pid_match = re.search(r'<b>Paper:?</b>\s*([a-zA-Z0-9\.\-\_\/]+)', raw_text)
            pid = pid_match.group(1).strip() if pid_match else ''
            
            meta = papers_map.get(pid, {})
            title = meta.get('title') or ''
            if not title and '<br>' in raw_text:
                parts = raw_text.split('<br>')
                for part in parts:
                    if 'Title:' in part or 'Paper:' in part:
                        title = re.sub(r'<[^>]+>', '', part).replace('Title:', '').replace('Paper:', '').strip()
                        break
            if not title:
                title = f"Paper {pid}" if pid else f"Document {j+1}"
                
            pt = {
                'id': pid or f"pt_{actual_tid}_{j}",
                'x': round(float(xs[j]), 3),
                'y': round(float(ys[j]), 3),
                'z': round(float(zs[j]), 3),
                'cluster_id': actual_tid,
                'cluster_name': name,
                'color': color,
                'title': title,
                'authors': meta.get('authors', []),
                'year': meta.get('year') or meta.get('published_year') or 2023,
                'citations': meta.get('citation_count') or meta.get('citationCount') or meta.get('citations') or 0,
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
                'cluster_id': actual_tid,
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

    # Sort clusters by cluster_id (0, 1, 2, ..., -1 last)
    clusters.sort(key=lambda c: (1 if c['cluster_id'] == -1 else 0, c['cluster_id']))
            
    # Load gaps to compute 3D gap bridges between clusters
    gaps_file = out_dir / 'detected_gaps.json'
    gaps_3d = []
    if gaps_file.exists():
        try:
            gaps_data = json.loads(gaps_file.read_text(encoding='utf-8')).get('gaps', [])
            for idx, g in enumerate(gaps_data[:5]):
                c1 = clusters[idx % len(clusters)] if clusters else None
                c2 = clusters[(idx + 1) % len(clusters)] if len(clusters) > 1 else None
                if c1 and c2 and c1['cluster_id'] != -1 and c2['cluster_id'] != -1:
                    mid_x = (c1['centroid']['x'] + c2['centroid']['x']) / 2
                    mid_y = (c1['centroid']['y'] + c2['centroid']['y']) / 2
                    mid_z = (c1['centroid']['z'] + c2['centroid']['z']) / 2 + 1.2
                    gaps_3d.append({
                        'gap_id': f"gap_{idx+1}",
                        'rank': idx + 1,
                        'title': g.get('title') or g.get('suggested_title'),
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


if __name__ == '__main__':
    for out_dir in Path('data').glob('output*'):
        if out_dir.is_dir():
            process_directory(out_dir)
