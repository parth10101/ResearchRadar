"""
ResearchRadar: Database Service Layer
High-throughput batch persistence and query layer for Corpora, Papers, Clusters, Edges, and Gaps.
Supports Supabase / PostgreSQL and Local SQLite offline fallback.
"""

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
from sqlmodel import Session, select, delete
from research_radar.app.core.database import get_engine
from research_radar.app.models.db_models import (
    CorpusRecord,
    PaperRecord,
    TopicClusterRecord,
    CitationEdgeRecord,
    ResearchGapRecord,
    PipelineJobRecord,
)

logger = logging.getLogger("research_radar.db_service")


def save_corpus(
    corpus_id: str,
    name: str,
    description: str = "",
    query: str = "",
    source: str = "preset",
    paper_count: int = 0
) -> CorpusRecord:
    engine = get_engine()
    with Session(engine) as session:
        record = session.get(CorpusRecord, corpus_id)
        if not record:
            record = CorpusRecord(
                id=corpus_id,
                name=name,
                description=description,
                query=query,
                source=source,
                paper_count=paper_count
            )
            session.add(record)
        else:
            record.name = name
            record.description = description
            record.query = query
            record.source = source
            record.paper_count = paper_count
        session.commit()
        session.refresh(record)
        return record


def save_papers(corpus_id: str, papers: List[Dict[str, Any]]):
    if not papers:
        return
    engine = get_engine()
    with Session(engine) as session:
        # Delete existing papers for this corpus to avoid stale data
        session.exec(delete(PaperRecord).where(PaperRecord.corpus_id == corpus_id))
        
        records = []
        seen_ids = set()
        for p in papers:
            raw_id = str(p.get("id") or p.get("paper_id") or p.get("arxiv_id") or "")
            if not raw_id:
                continue
            p_id = f"{corpus_id}#{raw_id}"
            if p_id in seen_ids:
                continue
            seen_ids.add(p_id)
            
            authors = p.get("authors") or []
            authors_str = json.dumps(authors) if isinstance(authors, list) else str(authors)
            
            records.append(PaperRecord(
                id=p_id,
                corpus_id=corpus_id,
                title=p.get("title") or "Untitled",
                abstract=p.get("abstract") or "",
                authors_json=authors_str,
                year=p.get("year"),
                citation_count=p.get("citation_count") or p.get("citations") or 0,
                cluster_id=p.get("cluster_id") or p.get("topic_id"),
                cluster_name=p.get("cluster_name") or p.get("topic_name"),
                x=float(p.get("x", 0.0) or 0.0),
                y=float(p.get("y", 0.0) or 0.0),
                z=float(p.get("z", 0.0) or 0.0),
                doi=p.get("doi"),
                url=p.get("url") or p.get("pdf_url")
            ))
        
        session.add_all(records)
        session.commit()
        logger.info(f"[DB] Persisted {len(records)} papers for corpus '{corpus_id}'")


def save_clusters(corpus_id: str, clusters: List[Dict[str, Any]]):
    if not clusters:
        return
    engine = get_engine()
    with Session(engine) as session:
        session.exec(delete(TopicClusterRecord).where(TopicClusterRecord.corpus_id == corpus_id))
        records = []
        for c in clusters:
            cid = c.get("cluster_id") if c.get("cluster_id") is not None else c.get("id", 0)
            terms = c.get("top_terms") or c.get("terms") or []
            terms_str = json.dumps(terms) if isinstance(terms, list) else str(terms)
            
            records.append(TopicClusterRecord(
                corpus_id=corpus_id,
                cluster_id=cid,
                name=c.get("name") or f"Topic Cluster {cid}",
                description=c.get("description") or "",
                size=c.get("size") or c.get("paper_count") or 0,
                color=c.get("color") or "#00f0ff",
                top_terms_json=terms_str,
                centroid_x=float(c.get("centroid_x") or c.get("x") or 0.0),
                centroid_y=float(c.get("centroid_y") or c.get("y") or 0.0),
                centroid_z=float(c.get("centroid_z") or c.get("z") or 0.0),
            ))
        session.add_all(records)
        session.commit()
        logger.info(f"[DB] Persisted {len(records)} clusters for corpus '{corpus_id}'")


def save_edges(corpus_id: str, edges: List[Dict[str, Any]]):
    if not edges:
        return
    engine = get_engine()
    with Session(engine) as session:
        session.exec(delete(CitationEdgeRecord).where(CitationEdgeRecord.corpus_id == corpus_id))
        records = []
        for e in edges:
            src = str(e.get("source") or e.get("source_id") or "")
            tgt = str(e.get("target") or e.get("target_id") or "")
            if not src or not tgt:
                continue
            records.append(CitationEdgeRecord(
                corpus_id=corpus_id,
                source_id=src,
                target_id=tgt,
                weight=float(e.get("weight", 1.0) or 1.0),
                edge_type=str(e.get("edge_type", "citation"))
            ))
        session.add_all(records)
        session.commit()
        logger.info(f"[DB] Persisted {len(records)} citation edges for corpus '{corpus_id}'")


def save_gaps(corpus_id: str, gaps: List[Dict[str, Any]]):
    if not gaps:
        return
    engine = get_engine()
    with Session(engine) as session:
        session.exec(delete(ResearchGapRecord).where(ResearchGapRecord.corpus_id == corpus_id))
        records = []
        for g in gaps:
            gid = str(g.get("id") or g.get("gap_id") or f"gap_{len(records)+1}")
            records.append(ResearchGapRecord(
                id=gid,
                corpus_id=corpus_id,
                title=g.get("title") or "Unnamed Research Gap",
                description=g.get("description") or "",
                topic_a_name=g.get("topic_a_name") or g.get("topic_a") or "",
                topic_b_name=g.get("topic_b_name") or g.get("topic_b") or "",
                novelty_score=float(g.get("novelty_score") or g.get("novelty") or 0.0),
                feasibility_score=float(g.get("feasibility_score") or g.get("feasibility") or 0.0),
                impact_score=float(g.get("impact_score") or g.get("impact") or 0.0),
                evidence_text=g.get("evidence_text") or g.get("evidence") or "",
                recommended_methodology=g.get("recommended_methodology") or g.get("methodology") or "",
                suggested_title=g.get("suggested_title") or "",
                grant_proposal_md=g.get("grant_proposal_md") or g.get("grant_proposal") or ""
            ))
        session.add_all(records)
        session.commit()
        logger.info(f"[DB] Persisted {len(records)} research gaps for corpus '{corpus_id}'")


def get_corpora() -> List[CorpusRecord]:
    engine = get_engine()
    with Session(engine) as session:
        return list(session.exec(select(CorpusRecord)).all())


def get_corpus(corpus_id: str) -> Optional[CorpusRecord]:
    engine = get_engine()
    with Session(engine) as session:
        return session.get(CorpusRecord, corpus_id)


def get_corpus_papers(corpus_id: str) -> List[PaperRecord]:
    engine = get_engine()
    with Session(engine) as session:
        return list(session.exec(select(PaperRecord).where(PaperRecord.corpus_id == corpus_id)).all())


def get_corpus_clusters(corpus_id: str) -> List[TopicClusterRecord]:
    engine = get_engine()
    with Session(engine) as session:
        return list(session.exec(select(TopicClusterRecord).where(TopicClusterRecord.corpus_id == corpus_id)).all())


def get_corpus_edges(corpus_id: str) -> List[CitationEdgeRecord]:
    engine = get_engine()
    with Session(engine) as session:
        return list(session.exec(select(CitationEdgeRecord).where(CitationEdgeRecord.corpus_id == corpus_id)).all())


def get_corpus_gaps(corpus_id: str) -> List[ResearchGapRecord]:
    engine = get_engine()
    with Session(engine) as session:
        return list(session.exec(select(ResearchGapRecord).where(ResearchGapRecord.corpus_id == corpus_id)).all())


def sync_directory_to_db(corpus_id: str, dir_path: Path, metadata: Optional[Dict[str, Any]] = None):
    """
    Parses artifacts from a precomputed pipeline output directory and populates the database.
    Ensures immediate availability of preset datasets in Supabase or SQLite.
    """
    if not dir_path.exists() or not dir_path.is_dir():
        return

    meta = metadata or {}
    name = meta.get("name") or corpus_id.replace("output_", "").replace("_", " ").title()
    desc = meta.get("description") or f"Precomputed dataset for {name}"
    query = meta.get("query") or corpus_id.replace("output_", "").replace("_", " ")

    # 1. Parse Papers and 3D coordinates
    papers_data: List[Dict[str, Any]] = []
    papers_file = dir_path / "papers.json"
    coords_file = dir_path / "cluster_3d_points.json"
    coords_map = {}
    if coords_file.exists():
        try:
            c_raw = json.loads(coords_file.read_text(encoding="utf-8", errors="replace"))
            if isinstance(c_raw, list):
                for pt in c_raw:
                    pid = pt.get("id") or pt.get("paper_id")
                    if pid:
                        coords_map[str(pid)] = pt
        except Exception:
            pass

    if papers_file.exists():
        try:
            p_raw = json.loads(papers_file.read_text(encoding="utf-8", errors="replace"))
            if isinstance(p_raw, list):
                for p in p_raw:
                    pid = str(p.get("id") or p.get("paper_id") or p.get("arxiv_id") or "")
                    coord = coords_map.get(pid, {})
                    papers_data.append({
                        "id": pid,
                        "title": p.get("title") or "Untitled",
                        "abstract": p.get("abstract") or "",
                        "authors": p.get("authors") or [],
                        "year": p.get("year") or p.get("published_year"),
                        "citation_count": p.get("citation_count") or p.get("citations") or 0,
                        "cluster_id": p.get("cluster_id") or coord.get("cluster"),
                        "cluster_name": p.get("cluster_name"),
                        "x": coord.get("x", 0.0),
                        "y": coord.get("y", 0.0),
                        "z": coord.get("z", 0.0),
                        "doi": p.get("doi"),
                        "url": p.get("url") or p.get("pdf_url")
                    })
        except Exception as e:
            logger.warning(f"Error reading papers.json in {dir_path}: {e}")

    # 2. Parse Clusters (archipelago_data.json / topic_results.json)
    clusters_data: List[Dict[str, Any]] = []
    arch_file = dir_path / "archipelago_data.json"
    if arch_file.exists():
        try:
            arch_raw = json.loads(arch_file.read_text(encoding="utf-8", errors="replace"))
            islands = arch_raw.get("islands") or []
            for isl in islands:
                clusters_data.append({
                    "cluster_id": isl.get("id", 0),
                    "name": isl.get("name") or isl.get("label") or f"Cluster {isl.get('id', 0)}",
                    "description": isl.get("description") or "",
                    "size": isl.get("size") or len(isl.get("papers", [])),
                    "color": isl.get("color") or "#00f0ff",
                    "top_terms": isl.get("keywords") or isl.get("terms") or [],
                    "centroid_x": isl.get("x", 0.0),
                    "centroid_y": isl.get("y", 0.0),
                    "centroid_z": isl.get("z", 0.0)
                })
        except Exception as e:
            logger.warning(f"Error reading archipelago_data.json in {dir_path}: {e}")
            
    if not clusters_data:
        topic_file = dir_path / "topic_results.json"
        if topic_file.exists():
            try:
                t_raw = json.loads(topic_file.read_text(encoding="utf-8", errors="replace"))
                clusters_map = t_raw.get("clusters") or {}
                for k, v in clusters_map.items():
                    cid = int(k) if str(k).isdigit() else 0
                    clusters_data.append({
                        "cluster_id": cid,
                        "name": f"Topic {cid}",
                        "description": "",
                        "size": len(v) if isinstance(v, list) else 0,
                        "color": "#00f0ff",
                        "top_terms": [],
                        "centroid_x": 0.0,
                        "centroid_y": 0.0,
                        "centroid_z": 0.0
                    })
            except Exception:
                pass

    # 3. Parse Edges (citation_data.json)
    edges_data: List[Dict[str, Any]] = []
    cit_file = dir_path / "citation_data.json"
    if cit_file.exists():
        try:
            cit_raw = json.loads(cit_file.read_text(encoding="utf-8", errors="replace"))
            links = cit_raw.get("links") or cit_raw.get("edges") or []
            for l in links:
                edges_data.append({
                    "source": l.get("source"),
                    "target": l.get("target"),
                    "weight": l.get("weight", 1.0),
                    "edge_type": l.get("type", "citation")
                })
        except Exception as e:
            logger.warning(f"Error reading citation_data.json in {dir_path}: {e}")

    # 4. Parse Research Gaps (narrated_gaps.json / detected_gaps.json)
    gaps_data: List[Dict[str, Any]] = []
    narrated_file = dir_path / "narrated_gaps.json"
    detected_file = dir_path / "detected_gaps.json"
    
    target_gap_file = narrated_file if narrated_file.exists() else (detected_file if detected_file.exists() else None)
    if target_gap_file:
        try:
            g_raw = json.loads(target_gap_file.read_text(encoding="utf-8", errors="replace"))
            g_list = g_raw if isinstance(g_raw, list) else g_raw.get("gaps", [])
            for idx, g in enumerate(g_list):
                gaps_data.append({
                    "id": str(g.get("id") or f"{corpus_id}_gap_{idx+1}"),
                    "title": g.get("suggested_title") or g.get("title") or f"Research Gap {idx+1}",
                    "description": g.get("description") or g.get("why_it_matters") or "",
                    "topic_a_name": g.get("topic_a_name") or g.get("topic_a") or "",
                    "topic_b_name": g.get("topic_b_name") or g.get("topic_b") or "",
                    "novelty_score": g.get("novelty_score") or g.get("novelty") or 0.85,
                    "feasibility_score": g.get("feasibility_score") or g.get("feasibility") or 0.80,
                    "impact_score": g.get("impact_score") or g.get("impact") or 0.90,
                    "evidence_text": g.get("evidence_text") or g.get("evidence") or "",
                    "recommended_methodology": g.get("recommended_methodology") or g.get("methodology") or "",
                    "suggested_title": g.get("suggested_title") or g.get("title") or "",
                    "grant_proposal_md": g.get("grant_proposal_md") or g.get("grant_proposal") or g.get("grant_proposal_text") or ""
                })
        except Exception as e:
            logger.warning(f"Error reading gaps file in {dir_path}: {e}")

    # Save to database
    save_corpus(
        corpus_id=corpus_id,
        name=name,
        description=desc,
        query=query,
        source="preset",
        paper_count=len(papers_data) or meta.get("papers") or 0
    )
    if papers_data:
        save_papers(corpus_id, papers_data)
    if clusters_data:
        save_clusters(corpus_id, clusters_data)
    if edges_data:
        save_edges(corpus_id, edges_data)
    if gaps_data:
        save_gaps(corpus_id, gaps_data)
        
    logger.info(f"[DB] Successfully synced preset '{corpus_id}' to database (papers: {len(papers_data)}, clusters: {len(clusters_data)}, gaps: {len(gaps_data)})")
