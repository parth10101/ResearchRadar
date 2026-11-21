import sys
import os
sys.path.insert(0, os.path.abspath("."))
import re
from collections import Counter
from research_radar.openalex_client import OpenAlexClient

SURVEY_NOISE = [
    'a comprehensive review', 'a review', 'review of', 'a survey', 'survey of',
    'examining the', 'research taxonomy', 'taxonomy of', 'silent no more',
    'advances in', 'advancing', 'perspectives on', 'perspective on',
    'introduction to', 'applications of', 'application of', 'current status of',
    'role of', 'trends in', 'presenting', 'overview of', 'insights into'
]

GENERIC_STOPS = {
    'artificial intelligence', 'deep learning', 'machine learning', 'ai', 'dl', 'ml',
    'study', 'paper', 'review', 'comprehensive review', 'research', 'approach', 'method',
    'future', 'introduction', 'overview', 'survey', 'advances', 'analysis', 'perspective',
    'application', 'applications', 'towards', 'advancing', 'improving', 'novel', 'new',
    'evaluation', 'benchmark', 'dataset', 'framework', 'architecture', 'system', 'model',
    'investigation', 'experimental', 'comparative', 'recent'
}

def clean_mdl_token(s: str) -> str:
    s = s.strip()
    s = re.sub(r'^(the|a|an|various|multiple|different|several|novel|recent|this|our|towards|advancing|unseen)\s+', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\s+(in|for|of|with|and|on|to|by|via|under)$', '', s, flags=re.IGNORECASE)
    return s.strip()

def extract_corpus_grounded_triads(papers_list, query, p1, p2):
    q_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', query.lower()))

    raw_substrates = []
    raw_methods = []
    raw_limitations = []

    for p in papers_list:
        title = (p.get('title') or '').replace('—', ' - ').replace('–', ' - ')
        abstract = p.get('abstract') or ''
        full = f"{title}. {abstract}"
        t_low = title.lower()

        # 1. Named Benchmark / Dataset in text
        benchmarks = re.findall(r'\b([A-Z][a-zA-Z0-9\-_]{2,20}(?:\s+[A-Z0-9][a-zA-Z0-9\-_]*){0,2})\s+(?:Benchmark|Dataset|Challenge|Corpus|Cohort|Registry|Testbed|Database)\b', full)
        for b in benchmarks:
            b_clean = clean_mdl_token(b)
            if len(b_clean) > 3 and b_clean.lower() not in GENERIC_STOPS:
                raw_substrates.append(f"{b_clean.title()} Benchmark Suite")

        # 2. Prepositional task / domain: in/for/applied to/across [domain]
        domain_matches = re.findall(r'\b(?:in|for|applied to|facilitating|across|benchmarking|towards)\s+([A-Za-z0-9\-\s]{4,35})(?:—|:|\.|$|,|\(|\)|-)', title, re.IGNORECASE)
        for dm in domain_matches:
            dm_clean = clean_mdl_token(dm)
            dm_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', dm_clean.lower()))
            if len(dm_clean) > 4 and len(dm_words - q_words - GENERIC_STOPS) >= 1:
                raw_substrates.append(f"{dm_clean.title()} Benchmark Task")

        # 3. Method extraction from title (skip surveys/reviews)
        if not any(t_low.startswith(sn) or f": {sn}" in t_low for sn in SURVEY_NOISE):
            # Check for algorithm/model clauses
            m_meth = re.search(r'^(.*?)\s+(?:for|in|applied to|towards|via)\s+', title, re.IGNORECASE)
            if m_meth:
                cand = clean_mdl_token(m_meth.group(1))
                # remove noise prefixes
                for sn in SURVEY_NOISE:
                    if cand.lower().startswith(sn):
                        cand = cand[len(sn):].strip()
                cand_clean = clean_mdl_token(cand)
                cand_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', cand_clean.lower()))
                if len(cand_clean) > 5 and len(cand_words - q_words - GENERIC_STOPS) >= 1:
                    if not cand_clean.lower().endswith(('architecture', 'framework', 'network', 'model', 'algorithm', 'system', 'mechanism')):
                        cand_clean = f"{cand_clean} Architecture"
                    raw_methods.append(cand_clean.title())

            # Check explicit method mentions: [Tech] (Network|Model|Algorithm|Transformer|Encoder|Autoencoder|Diffusion)
            tech_matches = re.findall(r'\b([A-Za-z0-9\-]+(?:\s+[A-Za-z0-9\-]+){1,3})\s+(?:Network|Algorithm|Transformer|Autoencoder|Reconstruction|Diffusion|Classifier)\b', full, re.IGNORECASE)
            for tm in tech_matches:
                tm_clean = clean_mdl_token(tm)
                tm_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', tm_clean.lower()))
                if len(tm_clean) > 5 and len(tm_words - q_words - GENERIC_STOPS) >= 1:
                    raw_methods.append(f"{tm_clean.title()} Architecture")

        # 4. Limitation extraction from abstract
        for sent in re.split(r'(?<=[.!?])\s+', abstract):
            sent_clean = sent.strip()
            if any(m in sent_clean.lower() for m in ['however', 'suffers from', 'vulnerable to', 'sensitive to', 'limited by', 'fails when', 'bottleneck', 'challenging due to', 'trade-off']):
                m_lim = re.search(r'(?:suffers from|vulnerable to|sensitive to|limited by|fails when|instability in|trade-off between|bottleneck of|challenging due to|however,?\s+)([a-zA-Z0-9\-\s]{10,80})(?:\.|\;|\,|$)', sent_clean, re.IGNORECASE)
                if m_lim:
                    lim = clean_mdl_token(m_lim.group(1))
                    if len(lim) > 12 and not any(lim.lower() == s for s in GENERIC_STOPS):
                        raw_limitations.append(lim[0].upper() + lim[1:])

    # Deduplicate while preserving order of frequency
    sub_ranked = [item for item, _ in Counter(raw_substrates).most_common()]
    meth_ranked = [item for item, _ in Counter(raw_methods).most_common()]
    lim_ranked = [item for item, _ in Counter(raw_limitations).most_common()]

    # Intelligent domain-aware fallbacks if literature was extremely sparse
    fallback_subs = [
        f"{p2} Real-World Generalization Benchmark",
        f"High-Dimensional {p1} Transfer Benchmark",
        f"Multi-Domain Empirical Stress Suite"
    ]
    fallback_meths = [
        f"Hierarchical {p1} Representation Learning",
        f"Adaptive {p1} Optimization Architecture",
        f"Invariant Latent Feature Alignment"
    ]
    fallback_lims = [
        f"Severe representation drift and performance breakdown under out-of-distribution shifts",
        f"High computational complexity and memory footprint during large-scale deployment",
        f"Vulnerability to label sparsity and catastrophic forgetting on unseen target distributions"
    ]

    triads = []
    for i in range(3):
        m = meth_ranked[i] if i < len(meth_ranked) else fallback_meths[i]
        d = sub_ranked[i] if i < len(sub_ranked) else fallback_subs[i]
        l = lim_ranked[i] if i < len(lim_ranked) else fallback_lims[i]
        triads.append({"method": m, "substrate": d, "limitation": l})

    return triads

client = OpenAlexClient()
papers = client.fetch_papers_google_scholar_parity('artificial intelligence AND deep learning', max_results=30)
triads = extract_corpus_grounded_triads(papers, 'artificial intelligence AND deep learning', 'Artificial Intelligence', 'Deep Learning')
for idx, tr in enumerate(triads, 1):
    print(f"\nGap #{idx:02d}:")
    print(f"  Method (M)    : {tr['method']}")
    print(f"  Substrate (D) : {tr['substrate']}")
    print(f"  Limitation (L): {tr['limitation']}")
