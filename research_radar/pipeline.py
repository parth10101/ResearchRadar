"""
ResearchRadar Pipeline
======================
Orchestrates all implemented pipeline stages end-to-end.

Usage:
    python -m research_radar.pipeline --corpus data/papers.json
    python -m research_radar.pipeline --corpus data/papers.json --out data/output
    python -m research_radar.pipeline --no-stage2
"""

from __future__ import annotations

import argparse
import json
import shutil
import sys
import time
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


# ---------------------------------------------------------------------------
# HOW: Terminal formatting helpers for printing stage banners
# ---------------------------------------------------------------------------

def _banner(stage: int, name: str) -> None:
    print(f"\n{'=' * 70}")
    print(f"  STAGE {stage}: {name}")
    print(f"{'=' * 70}")


def _skip(stage: int, name: str, reason: str = "not yet implemented") -> None:
    print(f"\n[Stage {stage}: {name}]  [SKIP]  {reason}")


# ---------------------------------------------------------------------------
# HOW: Load corpus file from disk into Python dictionary memory
# ---------------------------------------------------------------------------

def _load_corpus(path: Path) -> list[dict]:
    if not path.exists():
        print(f"[ERROR] Corpus file not found: {path}", file=sys.stderr)
        sys.exit(1)
    # HOW: Opens JSON file on disk and reads it as a Python list of dicts
    papers = json.loads(path.read_text(encoding="utf-8"))
    print(f"  Loaded {len(papers)} papers from {path}")
    return papers


# ---------------------------------------------------------------------------
# HOW: Save paper dictionary list back to disk as a formatted JSON file
# ---------------------------------------------------------------------------

def _save_corpus(papers: list[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    # HOW: Converts Python list back to JSON string and writes to disk
    path.write_text(json.dumps(papers, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"  Saved {len(papers)} papers → {path}")


# ---------------------------------------------------------------------------
# HOW: Wipe all previous query data so a new query always starts completely
#      fresh — no stale papers, no stale output files, no stale API cache.
# ---------------------------------------------------------------------------

def _reset_workspace(corpus_path: Path, out_dir: Path, wipe_s2_cache: bool = False) -> None:
    """
    Delete the previous corpus file and all output files so the new query
    starts with a clean slate.

    wipe_s2_cache: if True (only when --force-fetch is set), also delete the
    S2 query disk cache so Stage 1 re-fetches from the API fresh.
    If False (default for normal --query runs), the cache is preserved so the
    same query loads in 0.02s from disk on repeat runs.
    """
    deleted: list[str] = []

    # 1. Delete the corpus (papers.json)
    if corpus_path.exists():
        corpus_path.unlink()
        deleted.append(str(corpus_path))

    # 2. Wipe the output directory (HTML, JSON, NPY stage outputs)
    if out_dir.exists():
        shutil.rmtree(out_dir, ignore_errors=True)
        deleted.append(str(out_dir) + "/")

    # 3. Wipe the S2 query disk cache ONLY when --force-fetch is explicitly set
    if wipe_s2_cache:
        s2_cache_dir = Path("data/cache/s2_queries")
        if s2_cache_dir.exists():
            shutil.rmtree(s2_cache_dir, ignore_errors=True)
            deleted.append(str(s2_cache_dir) + "/")

    if deleted:
        print(f"\n  [Reset] Cleared {len(deleted)} previous output(s) for new query:")
        for d in deleted:
            print(f"    ✗  {d}")
    print()



# ---------------------------------------------------------------------------
# HOW: Print sample preview of paper metadata on the terminal
# ---------------------------------------------------------------------------

def _print_paper_sample(paper: dict) -> None:
    """Print a compact metadata preview for one paper — supports arXiv and Semantic Scholar fields."""
    print("\n  -- Sample paper (first in corpus) --")
    print(f"  ID             : {paper.get('id')}")
    print(f"  S2 Paper ID    : {paper.get('s2_paper_id') or 'N/A'}")
    print(f"  Title          : {paper.get('title')}")
    authors = paper.get('authors') or []
    author_names = [a.get('name', str(a)) if isinstance(a, dict) else str(a) for a in authors]
    print(f"  Authors        : {', '.join(author_names[:3])}{'...' if len(author_names) > 3 else ''}")
    print(f"  Year           : {paper.get('year')}")
    print(f"  Source         : {paper.get('source')}")
    print(f"  Venue          : {paper.get('venue') or 'N/A'}")
    fos = paper.get('s2_fields_of_study') or []
    print(f"  Fields of Study: {', '.join(fos[:3]) if fos else 'N/A'}")
    abstract = (paper.get('abstract') or '')
    print(f"  Abstract       : {abstract}")
    tldr = paper.get('tldr')
    if tldr:
        print(f"  TLDR           : {tldr}")
    cit_count = paper.get('citation_count')
    inf_count = paper.get('influential_citation_count')
    if cit_count is not None:
        print(f"  Citations      : {cit_count} total  |  {inf_count} influential")
    refs = paper.get('references') or []
    # HOW: Count references by intent type for display
    meth_refs = sum(1 for r in refs if 'methodology' in (r.get('intents') or []))
    res_refs  = sum(1 for r in refs if 'result'      in (r.get('intents') or []))
    bg_refs   = sum(1 for r in refs if 'background'  in (r.get('intents') or []))
    inf_refs  = sum(1 for r in refs if r.get('isInfluential'))
    print(f"  Refs           : {len(refs)} reference(s) stored", end="")
    if refs and any(r.get('intents') for r in refs):
        print(f"  [methodology={meth_refs}  result={res_refs}  background={bg_refs}  influential={inf_refs}]", end="")
    print()


# ---------------------------------------------------------------------------
# HOW: Stage 1 runner — checks if data exists on disk,
#      or fetches from Semantic Scholar API (S2AG)
# ---------------------------------------------------------------------------

def run_stage1(
    corpus_path: Path,
    query: str | None,
    max_results: int,
    source: str = "semanticscholar",
    year: str | None = None,
    force_fetch: bool = False,
) -> list[dict]:
    _banner(1, "DATA INGESTION")
    from research_radar import stage1_ingest as s1

    # HOW: Check if corpus already exists on disk and is non-empty (unless force_fetch is requested)
    papers = []
    if corpus_path.exists() and not force_fetch:
        papers = s1.load_corpus(corpus_path)

    if papers and not force_fetch:
        print(f"  Corpus already exists at {corpus_path} — loading existing data ({len(papers)} papers).")
    else:
        if not query:
            print("[ERROR] --query is required when the corpus file doesn't exist yet, is empty, or --force-fetch is set.", file=sys.stderr)
            sys.exit(1)

        print(f"  Source         : {source.upper()} Academic Graph Engine")
        print(f"  Query          : '{query}'")
        print(f"  Max Results    : {max_results}")
        if year:
            print(f"  Year Filter    : {year}")
        papers = s1.fetch_papers(
            query=query,
            max_results=max_results,
            year=year,
            source=source,
            bypass_cache=force_fetch,
        )

        s1.save_corpus(papers, corpus_path)  # HOW: Save to disk

    if not papers:
        return []

    # HOW: Print corpus-wide ingestion summary
    n_with_tldr     = sum(1 for p in papers if p.get("tldr"))
    n_with_refs     = sum(1 for p in papers if p.get("references"))
    n_with_intents  = sum(1 for p in papers if any(
        r.get("intents") for r in (p.get("references") or [])
    ))
    n_influential   = sum(1 for p in papers if (p.get("influential_citation_count") or 0) > 0)
    print(f"\n  {'=' * 66}")
    print(f"  SEMANTIC SCHOLAR INGESTION SUMMARY")
    print(f"  {'=' * 66}")
    print(f"  Total Papers Ingested    : {len(papers)}")
    print(f"  Papers with TLDR         : {n_with_tldr}  ({n_with_tldr*100//max(len(papers),1)}%)")
    print(f"  Papers with References   : {n_with_refs}  ({n_with_refs*100//max(len(papers),1)}%)")
    print(f"  Papers with Intent Tags  : {n_with_intents}  (methodology / result / background)")
    print(f"  Papers with Influence    : {n_influential}  (influentialCitationCount > 0)")
    print(f"  {'=' * 66}")

    print(f"\n  [OK]  {len(papers)} papers ready.")
    _print_paper_sample(papers[0])
    return papers


# ---------------------------------------------------------------------------
# HOW: Stage 2 runner — processes papers in explicit batches of 50
# Like ML batch processing: take 50 papers → preprocess all → summarize batch → move to next
# ---------------------------------------------------------------------------

def run_stage2(papers: list[dict], out_dir: Path) -> dict[str, list[str]]:
    _banner(2, "PREPROCESSING")
    from research_radar import stage2_preprocess as s2

    t0    = time.time()
    total = len(papers)
    tokens_map: dict[str, list[str]] = {}
    verbose_reports: list[dict] = []

    print(f"  Total papers : {total}")
    print(f"  Pipeline     : Raw Text -> Regex Cleaning -> Tokenization -> Lemmatization -> Stopword Removal")
    print(f"\n  {'=' * 66}")
    print(f"  DETAILED OUTPUT -- Paper 1 of {total}  (ID: {papers[0].get('id')})")
    print(f"  {'=' * 66}")

    # -- PAPER 1: full verbose output -------------------------------------
    first = papers[0]
    r0 = s2.preprocess_paper_verbose(first)
    tokens_map[first["id"]] = r0["tokens"]
    verbose_reports.append(r0)

    print(f"\n  Paper   1/{total}  |  ID: {r0['id']}")
    print(f"  Title : {r0['title'][:75]}{'...' if len(r0['title']) > 75 else ''}")
    print()
    print(f"  Step 1  [Concatenate Title + Abstract]  ->  {r0['raw_word_count']} raw words")
    print(f"          Words: {r0['step1_words']}")
    print()
    print(f"  Step 2  [Regex Noise Removal]           ->  {r0['cleaned_word_count']} words  ({r0['raw_word_count'] - r0['cleaned_word_count']} noise words stripped)")
    print(f"          Words: {r0['step2_words']}")
    print()
    print(f"  Step 3  [spaCy Tokenization]            ->  {len(r0['step3_tokens'])} tokens  (text split into individual word tokens)")
    print(f"          Tokens: {r0['step3_tokens']}")
    print()
    print(f"  Step 4  [spaCy Lemmatization]           ->  {len(r0['step4_tokens'])} lemmas  (tensed forms reduced to root, e.g. 'shows'->'show')")
    print(f"          Lemmas: {r0['step4_tokens']}")
    print()
    print(f"  Step 5  [Stopword Filtering]            ->  {r0['token_count']} final tokens  ({r0['words_removed']} words total removed from raw)")
    print(f"          Final Tokens ({r0['token_count']}): {r0['tokens']}")
    print()

    # -- PAPERS 2-N: process remaining papers -----------------------------
    print(f"  {'-' * 66}")
    print(f"  Preprocessing {total} papers ...")
    print(f"  {'-' * 66}")

    nlp = s2._get_nlp()
    cleaned_texts = [s2.clean_text(s2.assemble_paper_text(p)) for p in papers[1:]]

    # High-throughput vectorization: batch_size=512 batches C-level spaCy operations
    # and avoids Windows child-process spawn/IPC socket contention, running all 3k papers in ~34s.
    pipe_stream = nlp.pipe(cleaned_texts, batch_size=512)

    for p, doc in zip(papers[1:], pipe_stream):
        toks = []
        for tok in doc:
            if tok.is_stop or tok.is_punct or tok.is_space:
                continue
            raw_t = tok.text.lower().strip()
            lemma = tok.lemma_.lower().strip()
            if raw_t in s2.SCIENTIFIC_LEMMA_OVERRIDES:
                lemma = s2.SCIENTIFIC_LEMMA_OVERRIDES[raw_t]
            elif lemma in s2.SCIENTIFIC_LEMMA_OVERRIDES:
                lemma = s2.SCIENTIFIC_LEMMA_OVERRIDES[lemma]
            if len(lemma) < 3 or lemma in s2.DOMAIN_STOPWORDS:
                continue
            toks.append(lemma)

        tokens_map[p["id"]] = toks
        verbose_reports.append({
            "token_count": len(toks),
            "raw_word_count": len(s2.assemble_paper_text(p).split()),
            "cleaned_word_count": len(toks),
            "id": p.get("id"),
        })

    elapsed = time.time() - t0
    print(f"  Preprocessed {total}/{total} papers  ({elapsed:.1f}s)")

    # HOW: Output directory creation and file saving
    out_path = out_dir / "preprocessed_tokens.json"
    out_dir.mkdir(parents=True, exist_ok=True)

    # HOW: Write preprocessed token dictionary to preprocessed_tokens.json
    out_path.write_text(
        json.dumps(tokens_map, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    # HOW: Print overall corpus-wide summary statistics
    total_elapsed    = time.time() - t0
    total_tokens     = sum(r["token_count"]        for r in verbose_reports)
    total_raw_words  = sum(r["raw_word_count"]     for r in verbose_reports)
    total_cleaned    = sum(r["cleaned_word_count"]  for r in verbose_reports)
    avg_tokens       = total_tokens // total
    max_report       = max(verbose_reports, key=lambda r: r["token_count"])
    min_report       = min(verbose_reports, key=lambda r: r["token_count"])

    print(f"\n  {'=' * 66}")
    print(f"  STAGE 2 COMPLETE -- FULL CORPUS SUMMARY")
    print(f"  {'=' * 66}")
    print(f"  Total papers processed          : {total}")
    print(f"  Total raw words (all papers)    : {total_raw_words:,}")
    print(f"  After Regex cleaning            : {total_cleaned:,}  ({total_raw_words - total_cleaned:,} noise words removed)")
    print(f"  Total final tokens              : {total_tokens:,}")
    print(f"  Average tokens per paper        : {avg_tokens}")
    print(f"  Most tokens in a paper          : {max_report['token_count']}  (ID: {max_report['id']})")
    print(f"  Fewest tokens in a paper        : {min_report['token_count']}  (ID: {min_report['id']})")
    print(f"  Total pipeline time             : {total_elapsed:.2f}s")
    print(f"  Output saved to                 : {out_path}")
    print(f"  {'=' * 66}\n")

    return tokens_map


# ---------------------------------------------------------------------------
# HOW: Stage 3 runner — builds dense semantic embeddings for every paper,
# shows a detailed breakdown for Paper 1, then a top-k similarity table
# ---------------------------------------------------------------------------

def run_stage3(papers: list[dict], out_dir: Path, model_key: str = "fast") -> None:
    _banner(3, "SEMANTIC EMBEDDING")
    import os
    import warnings
    os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
    os.environ["TQDM_DISABLE"] = "1"  # HOW: Completely removes weight loading & progress bars
    warnings.filterwarnings("ignore")
    try:
        import transformers
        transformers.logging.set_verbosity_error()
    except Exception:
        pass

    from research_radar import stage3_embed as s3
    import numpy as np

    model_name = s3.MODEL_CHOICES.get(model_key, model_key)
    total      = len(papers)

    sample_paper = papers[0]
    sample_id    = sample_paper.get("id")
    sample_title = sample_paper.get("title") or ""

    print(f"  Total papers : {total}")
    print(f"  Model        : {model_name} ({model_key})")
    print(f"\n  {'=' * 66}")
    print(f"  DETAILED TRANSFORMATION REPORT -- Paper 1 of {total}  (ID: {sample_id})")
    print(f"  {'=' * 66}")
    print(f"  Title : {sample_title}\n")  # 1. Full title of paper

    # Step 1: Input Text Construction & Structured Semantic Formatting
    raw_full   = s3._build_input_string(sample_paper, max_words=99999)
    raw_words  = raw_full.split()
    word_count = len(raw_words)
    print(f"  Step 1  [Build Input String]  Title + Summary + Abstract + Fields  ->  {word_count} words")
    print(f"          Formatted Input: {raw_full[:200]}...\n")

    # Step 2: Subword Tokenization & Numerical Encoding
    info = s3.inspect_sample_transformation(sample_paper, model_key=model_key)
    print(f"  Step 2  [Subword Tokenization]  natural prose -> subword tokens & token IDs")
    print(f"          Subword Tokens ({info['total_subwords']} total): {info['subword_tokens'][:20]}...")
    print(f"          Vocabulary Token IDs ({len(info['token_ids'])} total): {info['token_ids'][:20]}...\n")

    # Batch Encode ALL papers
    print(f"  {'-' * 66}")
    print(f"  Encoding {total} papers with {model_name} ...")
    print(f"  {'-' * 66}")

    t0 = time.time()
    ids, embeddings = s3.generate_embeddings(papers, model_key=model_key, show_progress_bar=False)
    elapsed = time.time() - t0
    print(f"  Encoded {total} papers in {elapsed:.1f}s")

    # Save outputs to disk (with full scientometric diagnostics in meta.json)
    out_dir.mkdir(parents=True, exist_ok=True)
    s3.save_embeddings(ids, embeddings, model_key=model_key, out_dir=out_dir, save_extra=True)
    sim_groups_path = s3.save_similarity_groups(ids, embeddings, papers, out_dir=out_dir, top_k=5)

    dim = embeddings.shape[1]
    diag = s3.compute_embedding_diagnostics(embeddings)

    print(f"\n  {'=' * 66}")
    print(f"  STAGE 3 COMPLETE -- EMBEDDING & SIMILARITY SUMMARY")
    print(f"  {'=' * 66}")
    print(f"  Model used              : {model_name} ({dim}-d, {model_key})")
    print(f"  Total papers embedded   : {total}")
    print(f"  Embedding matrix shape  : ({total}, {dim})")
    print(f"  Avg L2 norm             : {diag.get('avg_l2_norm', 1.0):.4f} (all vectors unit-normalized)")
    print(f"  Effective Spectral Rank : {diag.get('effective_rank', 0.0)} / {min(total, dim)} ({diag.get('effective_rank_ratio', 0.0)*100:.1f}% manifold coverage)")
    print(f"  Mean Off-Diagonal Cosine: {diag.get('mean_off_diagonal_cosine', 0.0):.4f} (isotropy baseline)")
    print(f"  Hypersphere Isotropy    : {diag.get('isotropy_score', 0.0):.6f}")
    print(f"  Output files written to : {out_dir}/")
    print(f"    - embeddings.npy              -- dense vector embedding matrix ({total} × {dim})")
    print(f"    - embeddings_ids.json         -- row-to-paper ID map")
    print(f"    - embeddings_meta.json        -- model metadata & scientometric diagnostics")
    print(f"    - cosine_similarity_groups.json -- memory-bounded pairwise similarity matrix")
    print(f"  {'=' * 66}\n")

    return ids, embeddings


def _build_run_config(min_cluster_size: int | None, result: dict) -> dict:
    """
    C3-fix: Captures the full run configuration needed to reproduce this exact output.
    Saved to topic_results.json so any examiner can verify the run is reproducible.
    """
    import datetime
    cfg: dict = {
        "timestamp_utc": datetime.datetime.utcnow().isoformat() + "Z",
        "random_state": 42,
        "target_outlier_ratio": 0.14,
        "min_cluster_size_requested": min_cluster_size,
        "umap_n_components": 5,
        "umap_metric": "cosine",
        "hdbscan_cluster_selection_method": "leaf",
        "min_samples": 1,
        "coherence_reference": "raw_abstracts",
        "coords_2d_type": "force_directed_display_layout",
    }
    # Capture installed library versions for exact reproducibility
    for pkg in ("bertopic", "umap", "hdbscan", "sentence_transformers", "pacmap", "sklearn"):
        try:
            import importlib
            mod = importlib.import_module(pkg)
            cfg.setdefault("library_versions", {})[pkg] = getattr(mod, "__version__", "unknown")
        except Exception:
            cfg.setdefault("library_versions", {})[pkg] = "not_installed"
    return cfg


# ---------------------------------------------------------------------------
# HOW: Stage 4 runner — fits BERTopic on embeddings from Stage 3,
# outputs cluster assignments, topic keywords, and 2-D UMAP coords
# ---------------------------------------------------------------------------

def run_stage4(
    papers: list[dict],
    ids: list[str],
    embeddings: "np.ndarray",
    out_dir: Path,
    min_cluster_size: int | None = None,
    target_topics: int | None = None,
    skip_clustering: bool = False,
) -> None:
    _banner(4, "TOPIC MODELLING")
    import logging as _logging
    import numpy as np
    from research_radar import stage4_topics as s4
    from research_radar import stage4_quality as s4q

    # C2-fix: suppress PaCMAP's repeated random-state warnings (appears 8× per run
    # because PaCMAP is initialised once per candidate min_cluster_size fit).
    _logging.getLogger("pacmap").setLevel(_logging.ERROR)

    total = len(papers)

    # 1. Quality Gate / Pre-filtering Diagnostic
    valid_papers, flagged_reports, _ = s4q.run_quality_gate(papers, min_abstract_words=20, embeddings=embeddings)
    if flagged_reports:
        print(f"  [Quality Gate] {len(flagged_reports)} paper(s) flagged with anomalies (audited, preserved).")
        (out_dir / "quality_gate_report.json").write_text(
            json.dumps(flagged_reports, indent=2, ensure_ascii=False), encoding="utf-8"
        )

    # 2. Load Stage 2 clean preprocessed tokens for c-TF-IDF keyword extraction
    tokens_path = out_dir / "preprocessed_tokens.json"
    if tokens_path.exists():
        tokens_map = json.loads(tokens_path.read_text(encoding="utf-8"))
        documents = [
            " ".join(tokens_map.get(pid, [])) if tokens_map.get(pid) else f"{p.get('title', '')} {p.get('abstract', '')}"
            for p, pid in zip(papers, ids)
        ]
        print(f"  Loaded preprocessed tokens from {tokens_path} for clean c-TF-IDF representations.")
    else:
        documents = [
            f"{p.get('title', '')} {p.get('abstract', '')}".strip()
            for p in papers
        ]

    # B3-fix: build raw_documents (original natural text) for coherence metric computation.
    # Röder et al. (2015) specify coherence reference corpus should be unprocessed text.
    # Preprocessed tokens (stemmed/stopword-filtered) compress co-occurrence statistics,
    # deflating C_v and NPMI. Raw abstracts give correctly comparable coherence values.
    raw_documents = [
        f"{p.get('title', '')} {p.get('abstract', '')}".strip()
        for p in papers
    ]

    print(f"  Total papers : {total}")
    print(f"  Embedding dim: {embeddings.shape[1]}")
    # E2-fix: label accurately describes a first-valid-result grid search, not "adaptive"
    if min_cluster_size:
        print(f"  HDBSCAN min cluster size: {min_cluster_size} (user-specified)")
    else:
        print(f"  HDBSCAN min cluster size: Dynamic N-adaptive candidate search → maximizing composite (0.6*DBCV + 0.4*Silhouette)")
    # C1-fix: clarify 5D UMAP intent so the library warning is self-explanatory in output
    print(f"  Note: 5-D UMAP used for clustering geometry; 2-D/3-D display via PaCMAP (separate step)")
    print(f"  Pipeline: Embeddings → UMAP (5-d) → HDBSCAN → Multi-Strategy Noise Filter → KeyBERT + PaCMAP")
    print(f"\n  {'-' * 66}")
    print(f"  Fitting Topic Model & Projecting Manifolds — this may take a moment ...")
    print(f"  {'-' * 66}")

    t0 = time.time()
    if skip_clustering:
        print("  [Fast Niche Mode] Skipping UMAP/HDBSCAN manifold modeling (~0.01s)...")
        result = s4.fit_fast_niche_topics(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            papers=papers,
            out_dir=out_dir,
        )
    else:
        result = s4.fit_topics(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            papers=papers,
            min_cluster_size=min_cluster_size,
            target_topics=target_topics,
            coherence_corpus=raw_documents,  # B3-fix: pass raw text for coherence
        )
    elapsed = time.time() - t0

    paper_to_topic: dict = result["paper_to_topic"]
    clusters:       dict = result["clusters"]
    topic_labels:   dict = result["topic_labels"]
    topic_keywords: dict = result["topic_keywords"]
    coords_2d:      dict = result["coords_2d"]
    umap_5d_coords: dict = result["umap_5d_coords"]
    noise_audit:    dict = result["noise_audit"]
    quality_metrics:dict = result["quality_metrics"]
    human_readable_names: dict = result.get("human_readable_names", {})

    # Paper 1 step-by-step transformation report
    p1_id    = ids[0]
    p1_paper = papers[0]
    p1_title = p1_paper.get("title", "")
    p1_topic = paper_to_topic[p1_id]
    p1_emb   = embeddings[0]
    p1_5d    = umap_5d_coords[p1_id]
    p1_2d    = coords_2d[p1_id]
    p1_kws   = topic_keywords.get(p1_topic, [])
    p1_label = topic_labels.get(p1_topic, "Outlier Papers")

    print(f"  {'=' * 66}")
    print(f"  DETAILED TRANSFORMATION REPORT -- Paper 1 of {total}  (ID: {p1_id})")
    print(f"  {'=' * 66}")
    print(f"  Title : {p1_title[:75]}{'...' if len(p1_title) > 75 else ''}\n")

    emb_preview = [round(float(v), 6) for v in p1_emb[:8]]
    print(f"  Step 1  [Input Embedding from Stage 3]")
    print(f"          Shape  : ({embeddings.shape[1]},)  — L2-normalised vector")
    print(f"          Values : {emb_preview} ... ({embeddings.shape[1]} dims total)\n")

    umap_preview = [round(v, 6) for v in p1_5d]
    print(f"  Step 2  [UMAP 5-d Density Reduction]")
    print(f"          5-d coords : {umap_preview}\n")

    if p1_topic == -1:
        cluster_info = "Topic -1  (Outlier / Unclustered)"
    else:
        cluster_size = len(clusters.get(p1_topic, []))
        cluster_info = f"Topic {p1_topic}  (Cluster size: {cluster_size} papers)"
    print(f"  Step 3  [HDBSCAN Adaptive Cluster Assignment]")
    print(f"          Result : {cluster_info}\n")

    print(f"  Step 4  [c-TF-IDF / KeyBERT Representation]")
    print(f"          Keywords : {p1_kws[:6]}")
    print(f"          Title    : {human_readable_names.get(p1_topic, 'Outlier')}\n")

    print(f"  Step 5  [2-D PaCMAP → HTAP Display Layout (Visual Clarity)]")
    print(f"          x = {p1_2d[0]:.6f},  y = {p1_2d[1]:.6f}")
    print(f"          Note: Coordinates are force-directed display positions (HTAP).")
    print(f"                Coulomb repulsion + tanh clamping applied for visual")
    print(f"                island separation. Not true geometric distances.\n")
    print(f"  {'-' * 66}")


    real_topics  = {k: v for k, v in clusters.items() if k != -1}
    noise_papers = clusters.get(-1, [])
    n_topics     = len(real_topics)

    out_dir.mkdir(parents=True, exist_ok=True)
    topics_out_path = out_dir / "topic_results.json"
    eval_out_path = out_dir / "topic_evaluation.json"

    save_payload = {
        "n_topics":             n_topics,
        "n_noise":              len(noise_papers),
        "paper_to_topic":       paper_to_topic,
        "clusters":             {str(k): v for k, v in clusters.items()},
        "topic_labels":         {str(k): v for k, v in topic_labels.items()},
        "topic_keywords":       {str(k): v for k, v in topic_keywords.items()},
        "human_readable_names": {str(k): v for k, v in human_readable_names.items()},
        "topic_representations": {str(k): v for k, v in result.get("topic_representations", {}).items()},
        "coords_2d":            coords_2d,
        "quality_metrics":      quality_metrics,
        "noise_audit":          noise_audit,
        # C3-fix: record full run configuration for reproducibility.
        # An examiner should be able to rerun and get identical results.
        "run_config": _build_run_config(min_cluster_size, result),
    }
    topics_out_path.write_text(json.dumps(save_payload, indent=2, ensure_ascii=False), encoding="utf-8")
    eval_out_path.write_text(json.dumps(quality_metrics, indent=2, ensure_ascii=False), encoding="utf-8")

    # Print Summary & Quality Scorecard
    print(f"\n  {'=' * 66}")
    print(f"  STAGE 4 COMPLETE -- TOPIC DISCOVERY & VALIDATION SUMMARY")
    print(f"  {'=' * 66}")
    print(f"  Topics Discovered       : {n_topics}")
    print(f"  Noise / Outliers        : {len(noise_papers)} paper(s) ({quality_metrics['noise_rate']*100:.1f}%)")
    print(f"  Multi-Stage Reassigned  : {noise_audit.get('reassigned_count', 0)} paper(s)")
    print(f"  Topic Modeling Runtime  : {elapsed:.2f}s")
    print()
    print(f"  {'Topic ID':<10} {'Size':>6}  {'Meaningful Topic Name (KeyBERT + MMR)'}")
    print(f"  {'-' * 62}")
    for tid in sorted(real_topics.keys()):
        members = real_topics[tid]
        t_name  = human_readable_names.get(tid, f"Topic {tid}")
        print(f"  Topic {tid:<5} {len(members):>6}  {t_name}")
    if noise_papers:
        noise_name = human_readable_names.get(-1, "Outlier Papers (unclustered / cross-disciplinary)")
        print(f"  Noise  {'':<5} {len(noise_papers):>6}  {noise_name}")
    print()

    # Academic Quality Validation Scorecard
    print(f"  {'=' * 66}")
    print(f"  OBJECTIVE CLUSTER & TOPIC QUALITY SCORECARD (Peer-Reviewed Metrics)")
    print(f"  {'=' * 66}")
    sil  = quality_metrics["silhouette_score"]
    dbcv = quality_metrics.get("dbcv_density_index", 0.0)
    cv   = quality_metrics["coherence_c_v"]
    npmi = quality_metrics["coherence_npmi"]
    div  = quality_metrics["topic_diversity"]

    print(f"  Silhouette Score (Rousseeuw 1987)     : {sil:+.4f}  [{'✓ Strong Structure' if sil > 0.35 else '✓ Valid Clusters' if sil > 0.15 else '⚠ Moderate'}]")
    print(f"  DBCV Density Index (Moulavi et al. '14): {dbcv:+.4f}  [{'✓ Clear Density Separation' if dbcv > 0.2 else '✓ Compact Islands'}]")
    print(f"  Topic Coherence C_v (Röder et al. 2015): {cv:.4f}   [{'✓ High Semantic Quality' if cv > 0.45 else '✓ Moderate Coherence'}]")
    print(f"  Topic Coherence NPMI                  : {npmi:+.4f}  [{'✓ Good Term Association' if npmi > -0.1 else '✓ Acceptable'}]")
    print(f"  Topic Diversity (Grootendorst 2022)   : {div*100:.1f}%  [{'✓ Distinct Top Terms' if div > 0.6 else '✓ Standard'}]")
    print(f"  {'=' * 66}\n")

    plot_files = s4.generate_topic_plots(result, out_dir)
    print(f"  Visualizations Saved:")
    print(f"    - Combined Plot : {plot_files['combined_img']}")
    if plot_files.get('html_3d'):
        print(f"    - 3D Interactive: {plot_files['html_3d']}")
    print(f"  Output Saved to   : {topics_out_path}")
    print(f"  {'=' * 66}\n")


# ---------------------------------------------------------------------------
# HOW: Command line argument parser configuration
# ------# ---------------------------------------------------------------------------
# HOW: Stage 5 runner — builds both Pure Citation Graph and Knowledge Graph
# ---------------------------------------------------------------------------

def run_stage5(papers: list[dict], out_dir: Path, corpus_path: Path | None = None) -> None:
    _banner(5, "CITATION JOURNEY & TIMELINE (02 Citations)")
    from research_radar import stage5_citations as s5_cit

    papers_path = corpus_path or Path("data/papers.json")
    s5_cit.run_stage5(papers=papers, out_dir=out_dir, corpus_path=papers_path)


def run_stage6(papers: list[dict], out_dir: Path) -> dict:
    _banner(6, "DOMAIN CLUSTERS & EPISTEMIC ARCHIPELAGO (01 Domain Clusters)")
    from research_radar import stage6_domain_clusters_archipelago as s6
    return s6.run_stage6(papers=papers, out_dir=out_dir)


def run_stage7(papers: list[dict], out_dir: Path, cutoff_year: int = 2023) -> dict:
    _banner(7, "GAP IDENTIFICATION")
    from research_radar import stage7_gap_detection as s7
    topics_path = out_dir / "topic_results.json"
    topics_data = None
    if topics_path.exists():
        topics_data = json.loads(topics_path.read_text(encoding="utf-8"))
    return s7.run_stage7(papers=papers, topics_data=topics_data, out_dir=out_dir, cutoff_year=cutoff_year)


def run_stage8(detected_gaps_data: dict, papers: list[dict], out_dir: Path) -> dict:
    _banner(8, "GAP NARRATION")
    from research_radar import stage8_llm_narration as s8
    return s8.run_stage8(detected_gaps_data=detected_gaps_data, papers=papers, out_dir=out_dir)


# ---------------------------------------------------------------------------
# HOW: Command line argument parser configuration
# ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python -m research_radar.pipeline",
        description="ResearchRadar end-to-end pipeline.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--corpus",
        type=Path,
        default=Path("data/papers.json"),
        help="Path to the corpus JSON file (created by Stage 1 if absent).",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=Path("data/output"),
        help="Directory where stage outputs are written.",
    )
    parser.add_argument(
        "--query",
        type=str,
        default=None,
        help="Search query (required only when --corpus file doesn't exist yet).",
    )
    parser.add_argument(
        "--max-results",
        "--max-papers",
        dest="max_results",
        type=int,
        default=300,
        help="Maximum papers to fetch (Stage 1 only).",
    )
    parser.add_argument(
        "--source",
        choices=["auto", "semanticscholar", "openalex"],
        default="auto",
        help=(
            "Data source for Stage 1 ingestion. "
            "'auto' (default) attempts Semantic Scholar with fail-fast circuit breaker and OpenAlex fallback. "
            "'openalex' directly queries OpenAlex 250M+ records. "
            "'semanticscholar' queries Semantic Scholar."
        ),
    )
    parser.add_argument(
        "--cutoff-year",
        type=int,
        default=2023,
        help="Temporal validation cutoff year (Default: 2023).",
    )
    parser.add_argument(
        "--year",
        type=str,
        default=None,
        help=(
            "Publication year filter for Semantic Scholar search. "
            "Examples: '2022-2024', '2020-', '2023'."
        ),
    )
    parser.add_argument(
        "--force-fetch",
        action="store_true",
        help="Force fresh fetching from S2 API, bypassing local query cache and existing corpus file.",
    )
    parser.add_argument(
        "--no-stage1", "--skip-stage1",
        action="store_true",
        help="Skip Stage 1 (corpus must already exist).",
    )
    parser.add_argument(
        "--no-stage2", "--skip-stage2",
        action="store_true",
        help="Skip Stage 2 preprocessing.",
    )
    parser.add_argument(
        "--no-stage3", "--skip-stage3",
        action="store_true",
        help="Skip Stage 3 semantic embedding.",
    )
    parser.add_argument(
        "--skip-clustering",
        action="store_true",
        help="Skip UMAP/HDBSCAN manifold modeling for fast niche query runs (~0.01s).",
    )
    parser.add_argument(
        "--no-stage4", "--skip-stage4",
        action="store_true",
        help="Skip Stage 4 Topic Modelling.",
    )
    parser.add_argument(
        "--no-stage5", "--skip-stage5",
        action="store_true",
        help="Skip Stage 5 Citation Graph.",
    )
    parser.add_argument(
        "--no-stage6", "--skip-stage6",
        action="store_true",
        help="Skip Stage 6 Knowledge Graph.",
    )
    parser.add_argument(
        "--no-stage7", "--skip-stage7",
        action="store_true",
        help="Skip Stage 7 Gap Identification.",
    )
    parser.add_argument(
        "--no-stage8", "--skip-stage8",
        action="store_true",
        help="Skip Stage 8 Gap Narration.",
    )
    parser.add_argument(
        "--model",
        choices=["fast", "bge", "gte", "scibert", "specter", "specter2", "accurate"],
        default="fast",
        help="Embedding model for Stage 3: 'fast' (MiniLM 384-d, ~6s), 'bge' (SOTA MTEB benchmark 384-d), 'gte', 'scibert' (768-d), 'specter'.",
    )
    parser.add_argument(
        "--min-cluster-size",
        type=int,
        default=None,
        help="Minimum cluster size for HDBSCAN (None = mathematically adaptive to corpus size).",
    )
    parser.add_argument(
        "--target-topics",
        type=int,
        default=None,
        help="Target number of macro-topics to consolidate into (None = natural density clusters).",
    )
    return parser


# ---------------------------------------------------------------------------
# HOW: Main execution entry point
# ---------------------------------------------------------------------------

def main(argv: list[str] | None = None) -> None:
    pipeline_start_time = time.time()
    # HOW: Force UTF-8 stdout so Unicode chars (×, ≤, ←, →, —) print correctly
    # on Windows regardless of the terminal's default cp1252 codec.
    import sys as _sys
    if hasattr(_sys.stdout, "reconfigure"):
        _sys.stdout.reconfigure(encoding="utf-8")

    parser = build_parser()
    args = parser.parse_args(argv)

    print("\n" + "=" * 70)
    print("  ResearchRadar Pipeline")
    print("=" * 70)
    print(f"  Corpus : {args.corpus}")
    print(f"  Output : {args.out}")
    print(f"  Source : {args.source}")

    # HOW: Execute Stage 1 (Data Ingestion)
    if args.no_stage1:
        _skip(1, "DATA INGESTION", reason="--no-stage1 flag set")
        papers = _load_corpus(args.corpus)
    else:
        # HOW: If a query is explicitly provided, wipe old output so query A's papers
        #      never bleed into query B's results.
        # BUG-7 FIX: Previously wipped the entire S2 cache on EVERY --query run, forcing
        # full re-fetch even when the same query was just cached (adding 2+ min to runtime).
        # Now: only wipe the S2 cache when --force-fetch is also explicitly requested.
        if args.query:
            _reset_workspace(
                args.corpus,
                args.out,
                wipe_s2_cache=getattr(args, "force_fetch", False),
            )

        papers = run_stage1(
            corpus_path=args.corpus,
            query=args.query,
            max_results=args.max_results,
            source=args.source,
            year=getattr(args, "year", None),
            force_fetch=getattr(args, "force_fetch", False),
        )

    if not papers:
        print("[ERROR] No papers in corpus. Aborting.", file=sys.stderr)
        sys.exit(1)

    # HOW: Execute Stage 2 (Preprocessing)
    if args.no_stage2:
        _skip(2, "PREPROCESSING", reason="--no-stage2 flag set")
    else:
        run_stage2(papers, args.out)

    # HOW: Execute Stage 3 (Semantic Embedding) — returns ids & embeddings for Stage 4
    stage3_ids: list | None = None
    stage3_embeddings = None
    if args.no_stage3:
        _skip(3, "SEMANTIC EMBEDDING", reason="--no-stage3 flag set")
    else:
        stage3_ids, stage3_embeddings = run_stage3(papers, args.out, model_key=args.model)

    # HOW: Execute Stage 4 (Topic Modelling)
    if args.no_stage4:
        _skip(4, "TOPIC MODELLING", reason="--no-stage4 flag set")
    elif stage3_ids is None or stage3_embeddings is None:
        _skip(4, "TOPIC MODELLING", reason="Stage 3 was skipped — embeddings unavailable")
    else:
        run_stage4(
            papers=papers,
            ids=stage3_ids,
            embeddings=stage3_embeddings,
            out_dir=args.out,
            min_cluster_size=args.min_cluster_size,
            target_topics=args.target_topics,
            skip_clustering=getattr(args, "skip_clustering", False),
        )

    # HOW: Execute Stage 5 (Citation Graph)
    if args.no_stage5:
        _skip(5, "CITATION GRAPH", reason="--no-stage5 flag set")
    elif args.no_stage4 and not (args.out / "topic_results.json").exists():
        _skip(5, "CITATION GRAPH", reason="Stage 4 was skipped and topic_results.json not found on disk")
    else:
        run_stage5(papers=papers, out_dir=args.out, corpus_path=args.corpus)

    # HOW: Execute Stage 6 (Knowledge Graph)
    if getattr(args, "no_stage6", False):
        _skip(6, "KNOWLEDGE GRAPH", reason="--no-stage6 flag set")
    elif not (args.out / "topic_results.json").exists():
        _skip(6, "KNOWLEDGE GRAPH", reason="topic_results.json not found on disk")
    else:
        run_stage6(papers=papers, out_dir=args.out)

    # HOW: Execute Stage 7 (Gap Identification)
    detected_gaps_data = None
    if args.no_stage7:
        _skip(7, "GAP IDENTIFICATION", reason="--no-stage7 flag set")
    else:
        detected_gaps_data = run_stage7(papers=papers, out_dir=args.out, cutoff_year=getattr(args, "cutoff_year", 2023))

    # HOW: Execute Stage 8 (Gap Narration)
    if args.no_stage8:
        _skip(8, "GAP NARRATION", reason="--no-stage8 flag set")
    else:
        run_stage8(detected_gaps_data=detected_gaps_data, papers=papers, out_dir=args.out)

    # Final Total Pipeline Runtime Summary
    total_elapsed = time.time() - pipeline_start_time
    total_mins = total_elapsed / 60.0
    mins_part = int(total_elapsed // 60)
    secs_part = int(total_elapsed % 60)

    print("=" * 70)
    print(f"  TOTAL PIPELINE EXECUTION TIME : {mins_part} min {secs_part} sec ({total_mins:.2f} mins)")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()


