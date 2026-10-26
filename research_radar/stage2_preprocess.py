"""
Stage 2: Preprocessing
======================
Scientometrically rigorous text preprocessing (cleaning + transliteration +
tokenisation + lemmatisation) for scientific titles, abstracts, and metadata.

Features:
  - Universal multi-disciplinary compound preservation (Genomics, Materials Science,
    Physics, Economics, Medicine, Computer Science)
  - Mathematical & Greek character transliteration (beta-amyloid, alpha-helix,
    chi-squared, micrometer) without destructive ASCII stripping
  - Morphological guardrails for scientific vocabulary (preserves "data", "bayes", "basis")
  - Polysemy-preserving domain filtering (retains "potential", "base", "lead")
  - Guaranteed feature symmetry across all corpus papers
"""

from __future__ import annotations

import re
import unicodedata

try:
    import spacy
    _NLP = None  # spaCy model is lazy-loaded
except ImportError:
    spacy = None
    _NLP = None


# ---------------------------------------------------------------------------
# Scientific Greek & Mathematical Symbol Transliteration Map
# ---------------------------------------------------------------------------

GREEK_SYMBOL_MAP = {
    "α": "alpha", "β": "beta", "γ": "gamma", "δ": "delta", "ε": "epsilon",
    "ζ": "zeta", "η": "eta", "θ": "theta", "ι": "iota", "κ": "kappa",
    "λ": "lambda", "μ": "micro", "ν": "nu", "ξ": "xi", "ο": "omicron",
    "π": "pi", "ρ": "rho", "σ": "sigma", "τ": "tau", "υ": "upsilon",
    "φ": "phi", "χ": "chi", "ψ": "psi", "ω": "omega",
    "Α": "Alpha", "Β": "Beta", "Γ": "Gamma", "Δ": "Delta", "Ε": "Epsilon",
    "Ζ": "Zeta", "Η": "Eta", "Θ": "Theta", "Ι": "Iota", "Kappa": "Kappa",
    "Λ": "Lambda", "Μ": "Mu", "Ν": "Nu", "Ξ": "Xi", "Ο": "Omicron",
    "Π": "Pi", "Ρ": "Rho", "Σ": "Sigma", "Τ": "Tau", "Υ": "Upsilon",
    "Φ": "Phi", "Χ": "Chi", "Ψ": "Psi", "Ω": "Omega",
}

MATH_SYMBOL_PATTERNS = [
    (re.compile(r"\b(?:χ|chi)\s*[\^]?\s*[2²]\b|\bchi[\-\s]*square[d]?\b", re.IGNORECASE), "chi_squared"),
    (re.compile(r"\br\s*[\^]?\s*[2²]\b|\br[\-\s]*squared\b", re.IGNORECASE), "r_squared"),
    (re.compile(r"\b[ℓl]\s*1[\-\s]*norm\b|\bl1[\-\s]*norm\b|\b[ℓl]1\b", re.IGNORECASE), "l1_norm"),
    (re.compile(r"\b[ℓl]\s*2[\-\s]*norm\b|\bl2[\-\s]*norm\b|\b[ℓl]2\b", re.IGNORECASE), "l2_norm"),
    (re.compile(r"\b5[\-\s]*ht\b", re.IGNORECASE), "5ht"),
    (re.compile(r"\bμm\b", re.IGNORECASE), "micrometer"),
    (re.compile(r"\bμg\b", re.IGNORECASE), "microgram"),
    (re.compile(r"\bμl\b", re.IGNORECASE), "microliter"),
    (re.compile(r"\bμM\b"), "micromolar"),
    (re.compile(r"±"), " plus_minus "),
    (re.compile(r"≤"), " less_equal "),
    (re.compile(r"≥"), " greater_equal "),
    (re.compile(r"≠"), " not_equal "),
    (re.compile(r"≈"), " approximately "),
]

# ---------------------------------------------------------------------------
# Morphological Guardrails for Scientific Lexicon
# Prevents general-English web lemmatizers from turning "data" into "datum"
# or "bayes" into "bay"
# ---------------------------------------------------------------------------

SCIENTIFIC_LEMMA_OVERRIDES = {
    "data": "data",
    "datum": "data",
    "bayes": "bayes",
    "bayesian": "bayesian",
    "basis": "basis",
    "foci": "focus",
    "indices": "index",
    "matrices": "matrix",
    "analyses": "analysis",
    "hypotheses": "hypothesis",
}


# ---------------------------------------------------------------------------
# Refined Academic Stopwords
# Restores polysemous scientific nouns ("potential", "base", "lead", "observe")
# ---------------------------------------------------------------------------

DOMAIN_STOPWORDS = {
    # Self-reference words
    "paper", "study", "work", "article", "author", "section", "figure", "table",

    # Academic reporting verbs (base forms only)
    "propose", "present", "demonstrate", "achieve", "show", "provide", "include",
    "use", "compare", "introduce", "evaluate", "conduct", "investigate",
    "explore", "discuss", "consider", "describe", "report",
    "suggest", "indicate", "perform", "address", "examine", "apply", "obtain",
    "aim", "focus", "allow", "develop", "adopt", "employ", "utilize",
    "illustrate", "summarize",

    # Generic filler descriptors and discourse connectors
    "novel", "new", "existing", "also", "however", "moreover", "furthermore",
    "thus", "therefore", "hence", "yet", "recent", "recently", "various",
    "several", "different", "many", "much", "particular", "specific",
    "overall", "main", "key", "general", "common",

    # Ordinals and small number words used as filler
    "one", "two", "three", "first", "second", "third",
}


# ---------------------------------------------------------------------------
# Lazy spaCy Model Loader
# ---------------------------------------------------------------------------

def _get_nlp():
    global _NLP
    if _NLP is not None:
        return _NLP
    if spacy is None:
        raise ImportError("pip install spacy && python -m spacy download en_core_web_sm")
    # Priority order: scientific model first, then general English
    for model_name in ("en_core_sci_lg", "en_core_web_sm"):
        try:
            # Keep tagger & lemmatizer; skip parser and ner for high throughput
            _NLP = spacy.load(model_name, disable=["parser", "ner"])
            return _NLP
        except OSError:
            continue
    try:
        from spacy import cli as _spacy_cli
        print("  [Setup] Downloading spaCy en_core_web_sm model...")
        _spacy_cli.download("en_core_web_sm")
        _NLP = spacy.load("en_core_web_sm", disable=["parser", "ner"])
        return _NLP
    except Exception:
        _NLP = spacy.blank("en")
        return _NLP


# ---------------------------------------------------------------------------
# Universal Multi-Disciplinary Compound Terms
# Spans all 19 UNESCO/OpenAlex scientific disciplines
# ---------------------------------------------------------------------------

_COMPOUND_TERMS: list[tuple[str, str]] = [
    # Genomics & Molecular Biology
    (r"\bSingle[ -]Cell RNA[ -]Sequencing\b",          "single_cell_rna_sequencing"),
    (r"\bSingle[ -]Cell RNA[ -]Seq\b",                 "single_cell_rna_sequencing"),
    (r"\bCRISPR[ -]Cas9\b",                            "crispr_cas9"),
    (r"\bGene Expression\b",                           "gene_expression"),
    (r"\bGenome[ -]Wide Association\b",                "genome_wide_association"),
    (r"\bCopy Number Variation[s]?\b",                 "copy_number_variation"),
    (r"\bChromatin Immunoprecipitation\b",             "chromatin_immunoprecipitation"),
    # Medicine & Epidemiology
    (r"\bRandomized Controlled Trial[s]?\b",           "randomized_controlled_trial"),
    (r"\bChronic Kidney Disease\b",                    "chronic_kidney_disease"),
    (r"\bMyocardial Infarction\b",                     "myocardial_infarction"),
    (r"\bHazard Ratio[s]?\b",                          "hazard_ratio"),
    (r"\bOdds Ratio[s]?\b",                            "odds_ratio"),
    (r"\bAction Potential[s]?\b",                      "action_potential"),
    # Materials Science, Chemistry & Physics
    (r"\bDensity Functional Theory\b",                 "density_functional_theory"),
    (r"\bTransmission Electron Microscopy\b",          "transmission_electron_microscopy"),
    (r"\bScanning Electron Microscopy\b",              "scanning_electron_microscopy"),
    (r"\bX[ -]Ray Diffraction\b",                      "x_ray_diffraction"),
    (r"\bMetal[ -]Organic Framework[s]?\b",            "metal_organic_framework"),
    # Economics & Social Sciences
    (r"\bDifference[ -]in[ -]Differences\b",           "difference_in_differences"),
    (r"\bInstrumental Variable[s]?\b",                 "instrumental_variable"),
    (r"\bGeneralized Method of Moments\b",             "generalized_method_of_moments"),
    (r"\bCapital Asset Pricing Model\b",               "capital_asset_pricing_model"),
    # Deep Learning & AI Architectures
    (r"\bGraph Attention Network[s]?\b",               "graph_attention_network"),
    (r"\bGraph Neural Network[s]?\b",                  "graph_neural_network"),
    (r"\bGraph Convolutional Network[s]?\b",           "graph_convolutional_network"),
    (r"\bConvolutional Neural Network[s]?\b",          "convolutional_neural_network"),
    (r"\bRecurrent Neural Network[s]?\b",              "recurrent_neural_network"),
    (r"\bGenerative Adversarial Network[s]?\b",        "generative_adversarial_network"),
    (r"\bVariational Auto[- ]?[Ee]ncoder[s]?\b",       "variational_autoencoder"),
    (r"\bTransformer[- ]based\b",                      "transformer_based"),
    (r"\bLarge Language Model[s]?\b",                  "large_language_model"),
    (r"\bRetrieval[ -]Augmented Generation\b",         "retrieval_augmented_generation"),
    (r"\bReinforcement Learning\b",                    "reinforcement_learning"),
    (r"\bFederated Learning\b",                        "federated_learning"),
    (r"\bTransfer Learning\b",                         "transfer_learning"),
    (r"\bContrastive Learning\b",                      "contrastive_learning"),
    (r"\bSelf[ -]Supervised Learning\b",               "self_supervised_learning"),
    (r"\bKnowledge Distillation\b",                    "knowledge_distillation"),
    (r"\bAttention Mechanism[s]?\b",                   "attention_mechanism"),
    (r"\bMulti[ -]Head Attention\b",                   "multi_head_attention"),
    (r"\bDiffusion Model[s]?\b",                       "diffusion_model"),
    (r"\bNeural Architecture Search\b",                "neural_architecture_search"),
    # Computational Linguistics & NLP
    (r"\bNatural Language Processing\b",               "natural_language_processing"),
    (r"\bNamed Entity Recognition\b",                  "named_entity_recognition"),
    (r"\bQuestion Answering\b",                        "question_answering"),
    (r"\bMachine Translation\b",                       "machine_translation"),
    (r"\bSentiment Analysis\b",                        "sentiment_analysis"),
    (r"\bInformation Extraction\b",                    "information_extraction"),
    (r"\bKnowledge Graph[s]?\b",                       "knowledge_graph"),
    # Computer Vision & Robotics
    (r"\bObject Detection\b",                          "object_detection"),
    (r"\bImage Segmentation\b",                        "image_segmentation"),
    (r"\bPoint Cloud[s]?\b",                           "point_cloud"),
    (r"\bDepth Estimation\b",                          "depth_estimation"),
    # Systems & Privacy
    (r"\bDifferential Privacy\b",                      "differential_privacy"),
    (r"\bFederated Averaging\b",                       "federated_averaging"),
    (r"\bPhysics[ -]Informed Neural Network[s]?\b",    "physics_informed_neural_network"),
    (r"\bNeural Ordinary Differential Equation[s]?\b", "neural_ordinary_differential_equation"),
]

_COMPOUND_PATTERNS: list[tuple[re.Pattern, str]] = [
    (re.compile(pat, re.IGNORECASE), repl) for pat, repl in _COMPOUND_TERMS
]

# Pre-compiled noise cleaning regex patterns
_LATEX_RE     = re.compile(r"\\[a-zA-Z]+\{[^}]*\}|\$[^$]*\$|\\begin\{.*?\}.*?\\end\{.*?\}", re.DOTALL)
_URL_RE       = re.compile(r"https?://\S+")
_DOI_RE       = re.compile(r"\b10\.\d{4,9}/\S+\b")
_ARXIV_ID_RE  = re.compile(r"\barXiv:\d{4}\.\d{4,5}\b", re.IGNORECASE)
_EMAIL_RE     = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b")
_NON_ALNUM_RE = re.compile(r"[^a-z0-9\s\-\_]")
_MULTISPACE_RE= re.compile(r"\s+")


def _transliterate_scientific_symbols(text: str) -> str:
    """
    Transliterates scientific Greek letters, mathematical operators, and Latin diacritics
    into canonical phonetic tokens.
    Prevents loss of domain signals (e.g. beta-amyloid, alpha-helix, chi_squared).
    """
    # 1. Standard mathematical patterns
    for pat, repl in MATH_SYMBOL_PATTERNS:
        text = pat.sub(repl, text)

    # 2. Greek character translation
    chars = [GREEK_SYMBOL_MAP.get(ch, ch) for ch in text]
    text = "".join(chars)

    # 3. Unicode NFKD decomposition (e.g. Poincaré -> Poincare, Schrödinger -> Schrodinger)
    text = unicodedata.normalize("NFKD", text)
    # Remove non-spacing combining diacritical marks
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    return text


def _preserve_compound_terms(text: str) -> str:
    """
    Universal Compound Preservation:
    1. Replaces known multi-disciplinary canonical compounds with underscore-joined tokens.
    2. Dynamically joins hyphenated scientific expressions (e.g. single-cell -> single_cell,
       physics-informed -> physics_informed, crispr-cas9 -> crispr_cas9).
    """
    for pattern, replacement in _COMPOUND_PATTERNS:
        text = pattern.sub(replacement, text)

    # Universal hyphenated compound joining for words of length >= 3
    text = re.sub(r"\b([a-zA-Z]{3,})-([a-zA-Z]{3,})\b", r"\1_\2", text)
    return text


def clean_text(text: str) -> str:
    """
    Scientometrically sound text cleaning pipeline:
      1. Transliterate Greek symbols and math patterns into phonetic English
      2. Join universal compound technical terms
      3. Strip LaTeX equations, URLs, DOIs, arXiv IDs, and emails
      4. Normalize case and clean non-alphanumeric noise (preserving underscores)
    """
    text = _transliterate_scientific_symbols(text)
    text = _preserve_compound_terms(text)
    text = _LATEX_RE.sub(" ", text)
    text = _URL_RE.sub(" ", text)
    text = _DOI_RE.sub(" ", text)
    text = _ARXIV_ID_RE.sub(" ", text)
    text = _EMAIL_RE.sub(" ", text)
    text = text.lower()
    text = _NON_ALNUM_RE.sub(" ", text)
    text = _MULTISPACE_RE.sub(" ", text).strip()
    return text


def assemble_paper_text(paper: dict) -> str:
    """
    Standardized, uniform academic text assembler:
    Guarantees that EVERY paper in the corpus receives identical feature representations:
    Title + TLDR (deduplicated) + Abstract + Fields of Study.
    """
    title = (paper.get("title") or "").strip()
    raw_tldr = paper.get("tldr")
    tldr = (raw_tldr.get("text", "") if isinstance(raw_tldr, dict) else str(raw_tldr or "")).strip()
    abstract = (paper.get("abstract") or "").strip()
    fos = " ".join(paper.get("s2_fields_of_study") or [])

    parts = [title]
    if tldr and abstract and tldr.lower() not in abstract.lower():
        parts.append(tldr)
    elif tldr and not abstract:
        parts.append(tldr)
    if abstract:
        parts.append(abstract)
    if fos:
        parts.append(fos)

    return ". ".join(p for p in parts if p).strip()


def tokenize_and_lemmatize(clean_text_str: str, min_token_len: int = 3) -> list[str]:
    """
    Tokenizes and lemmatizes clean text using spaCy with strict scientific guardrails:
      - Applies SCIENTIFIC_LEMMA_OVERRIDES so 'data' doesn't become 'datum' and 'bayes' doesn't become 'bay'
      - Filters standard English stopwords and refined domain stopwords
    """
    nlp = _get_nlp()
    doc = nlp(clean_text_str)

    tokens = []
    for tok in doc:
        if tok.is_stop or tok.is_punct or tok.is_space:
            continue

        raw_t = tok.text.lower().strip()
        lemma = tok.lemma_.lower().strip()

        # Apply scientific lemma overrides to preserve foundational domain nouns
        if raw_t in SCIENTIFIC_LEMMA_OVERRIDES:
            lemma = SCIENTIFIC_LEMMA_OVERRIDES[raw_t]
        elif lemma in SCIENTIFIC_LEMMA_OVERRIDES:
            lemma = SCIENTIFIC_LEMMA_OVERRIDES[lemma]

        if len(lemma) < min_token_len or lemma in DOMAIN_STOPWORDS:
            continue

        tokens.append(lemma)

    return tokens


def _tokenize_verbose(clean_text_str: str, min_token_len: int = 3) -> dict:
    """
    Verbose tokenizer returning intermediate stages for transparent pipeline diagnostics:
      step3_tokens: raw tokens after tokenization
      step4_tokens: root lemmas before stopword filtering (with scientific guardrails)
      step5_tokens: final tokens after filtering
    """
    nlp = _get_nlp()
    doc = nlp(clean_text_str)

    step3_tokens = []
    step4_tokens = []
    step5_tokens = []

    for tok in doc:
        if not tok.is_space and not tok.is_punct:
            step3_tokens.append(tok.text.lower())

        if tok.is_stop or tok.is_punct or tok.is_space:
            continue

        raw_t = tok.text.lower().strip()
        lemma = tok.lemma_.lower().strip()

        if raw_t in SCIENTIFIC_LEMMA_OVERRIDES:
            lemma = SCIENTIFIC_LEMMA_OVERRIDES[raw_t]
        elif lemma in SCIENTIFIC_LEMMA_OVERRIDES:
            lemma = SCIENTIFIC_LEMMA_OVERRIDES[lemma]

        step4_tokens.append(lemma)

        if len(lemma) < min_token_len or lemma in DOMAIN_STOPWORDS:
            continue

        step5_tokens.append(lemma)

    return {
        "step3_tokens": step3_tokens,
        "step4_tokens": step4_tokens,
        "step5_tokens": step5_tokens,
    }


def preprocess_paper(paper: dict) -> list[str]:
    """Preprocesses a single paper using uniform text assembly, cleaning, and guarded lemmatization."""
    raw = assemble_paper_text(paper)
    cleaned = clean_text(raw)
    return tokenize_and_lemmatize(cleaned)


def preprocess_paper_verbose(paper: dict) -> dict:
    """Detailed per-paper preprocessing diagnostics with word counts at each intermediate step."""
    raw = assemble_paper_text(paper)
    title = (paper.get("title") or "").strip()
    step1_words = raw.split()

    cleaned = clean_text(raw)
    step2_words = cleaned.split()

    verbose = _tokenize_verbose(cleaned)

    return {
        "id": paper.get("id"),
        "title": title,
        "raw_text": raw,
        "step1_words": step1_words,
        "raw_word_count": len(step1_words),
        "cleaned_text": cleaned,
        "step2_words": step2_words,
        "cleaned_word_count": len(step2_words),
        "step3_tokens": verbose["step3_tokens"],
        "step4_tokens": verbose["step4_tokens"],
        "tokens": verbose["step5_tokens"],
        "token_count": len(verbose["step5_tokens"]),
        "words_removed": len(step1_words) - len(verbose["step5_tokens"]),
    }


def preprocess_corpus(papers: list[dict], batch_size: int = 256) -> dict[str, list[str]]:
    """Efficiently batch-processes all papers in the corpus with guaranteed feature symmetry."""
    if not papers:
        return {}

    nlp = _get_nlp()
    cleaned_texts = [clean_text(assemble_paper_text(p)) for p in papers]
    pids = [p.get("id") for p in papers]

    docs = nlp.pipe(cleaned_texts, batch_size=batch_size)

    results = {}
    for pid, doc in zip(pids, docs):
        tokens = []
        for tok in doc:
            if tok.is_stop or tok.is_punct or tok.is_space:
                continue

            raw_t = tok.text.lower().strip()
            lemma = tok.lemma_.lower().strip()

            if raw_t in SCIENTIFIC_LEMMA_OVERRIDES:
                lemma = SCIENTIFIC_LEMMA_OVERRIDES[raw_t]
            elif lemma in SCIENTIFIC_LEMMA_OVERRIDES:
                lemma = SCIENTIFIC_LEMMA_OVERRIDES[lemma]

            if len(lemma) < 3 or lemma in DOMAIN_STOPWORDS:
                continue

            tokens.append(lemma)
        results[pid] = tokens

    return results
