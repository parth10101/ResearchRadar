"""
Stage 2: Preprocessing
======================
Preprocessing text (cleaning + tokenisation + lemmatisation) for titles
and abstracts.

Text preprocessing is applied directly to the concatenated title + abstract
string for each paper in the corpus.
"""

from __future__ import annotations

import re

try:
    import spacy
    _NLP = None  # HOW: spaCy model is lazy-loaded (only loaded when first needed, not on import)
except ImportError:
    spacy = None
    _NLP = None


# ---------------------------------------------------------------------------
# HOW: Domain stopwords set is defined — only base/root lemma forms are stored
# Because lemmatization runs BEFORE filtering, inflected forms like
# "shows", "showed", "showing" all become "show" first, then get removed here
# ---------------------------------------------------------------------------

DOMAIN_STOPWORDS = {
    # HOW: Self-reference words — appear in almost every abstract but say nothing about the topic
    "paper", "study", "work", "article", "author", "section", "figure", "table",

    # HOW: Academic reporting verbs (base forms only)
    # spaCy converts "proposes"→"propose", "presented"→"present" etc. automatically
    "propose", "present", "demonstrate", "achieve", "show", "provide", "include",
    "use", "base", "compare", "introduce", "evaluate", "conduct", "investigate",
    "explore", "discuss", "consider", "describe", "report", "find", "observe",
    "suggest", "indicate", "perform", "address", "examine", "apply", "obtain",
    "aim", "focus", "lead", "allow", "develop", "adopt", "employ", "utilize",
    "illustrate", "summarize",

    # HOW: Generic filler descriptors and discourse connectors
    # These appear across all topics and carry no domain-specific signal
    "novel", "new", "existing", "also", "however", "moreover", "furthermore",
    "thus", "therefore", "hence", "yet", "recent", "recently", "various",
    "several", "different", "many", "much", "particular", "specific",
    "overall", "main", "key", "general", "common", "potential",

    # HOW: Ordinals and small number words used as filler
    "one", "two", "three", "first", "second", "third",
}


# ---------------------------------------------------------------------------
# HOW: The spaCy NLP model is loaded (lazy — only runs when first called)
# Tries scientific model first (en_core_sci_lg), falls back to general English (en_core_web_sm)
# ---------------------------------------------------------------------------

def _get_nlp():
    global _NLP
    if _NLP is not None:
        return _NLP  # HOW: Return already-loaded model without reloading it
    if spacy is None:
        raise ImportError("pip install spacy && python -m spacy download en_core_web_sm")
    # HOW: Try loading models in priority order — scientific first, then general English
    for model_name in ("en_core_sci_lg", "en_core_web_sm"):
        try:
            # Skip sentence parsing and NER to run 4x faster on CPU
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
        # Fallback to blank english model if download is blocked
        _NLP = spacy.blank("en")
        return _NLP


# ---------------------------------------------------------------------------
# HOW: Raw text noise is removed using Python Regular Expressions (re module)
# Applied BEFORE tokenization so spaCy only sees clean plain English words
# ---------------------------------------------------------------------------

# HOW: Each regex pattern targets a specific type of noise found in scientific abstracts
_LATEX_RE    = re.compile(r"\\[a-zA-Z]+\{[^}]*\}|\$[^$]*\$|\\begin\{.*?\}.*?\\end\{.*?\}", re.DOTALL)
_URL_RE      = re.compile(r"https?://\S+")                          # HOW: Matches http:// and https:// web links
_DOI_RE      = re.compile(r"\b10\.\d{4,9}/\S+\b")                  # HOW: Matches DOI strings like 10.1016/j.artmed...
_ARXIV_ID_RE = re.compile(r"\barXiv:\d{4}\.\d{4,5}\b", re.IGNORECASE)  # HOW: Matches arXiv IDs like arXiv:2207.02337
_EMAIL_RE    = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b")          # HOW: Matches email addresses
_NON_ALNUM_RE= re.compile(r"[^a-z0-9\s\-\_]")                       # HOW: Removes non-alphanumeric chars; keeps hyphens AND underscores (compound token separators)
_MULTISPACE_RE=re.compile(r"\s+")                                    # HOW: Collapses multiple spaces into one

# HOW: Compound technical term pre-pass — preserves multi-word ML/CS/scientific terms
# as underscore-joined tokens BEFORE spaCy tokenization. This prevents NLP lemmatization
# from splitting "Graph Attention Network" into unrelated tokens "graph", "attention", "network".
# Applied to the raw text before any cleaning so uppercase casing is still intact.
# (Manning, Raghavan & Schütze, Introduction to Information Retrieval §2.2, Cambridge 2008)
_COMPOUND_TERMS: list[tuple[str, str]] = [
    # Deep Learning Architectures
    (r"\bGraph Attention Network[s]?\b",           "graph_attention_network"),
    (r"\bGraph Neural Network[s]?\b",              "graph_neural_network"),
    (r"\bGraph Convolutional Network[s]?\b",       "graph_convolutional_network"),
    (r"\bConvolutional Neural Network[s]?\b",      "convolutional_neural_network"),
    (r"\bRecurrent Neural Network[s]?\b",          "recurrent_neural_network"),
    (r"\bGenerative Adversarial Network[s]?\b",    "generative_adversarial_network"),
    (r"\bVariational Auto[- ]?[Ee]ncoder[s]?\b",   "variational_autoencoder"),
    (r"\bTransformer[- ]based\b",                  "transformer_based"),
    (r"\bLarge Language Model[s]?\b",              "large_language_model"),
    (r"\bRetrieval[ -]Augmented Generation\b",     "retrieval_augmented_generation"),
    (r"\bReinforcement Learning\b",                "reinforcement_learning"),
    (r"\bFederated Learning\b",                    "federated_learning"),
    (r"\bTransfer Learning\b",                     "transfer_learning"),
    (r"\bContrastive Learning\b",                  "contrastive_learning"),
    (r"\bSelf[ -]Supervised Learning\b",           "self_supervised_learning"),
    (r"\bKnowledge Distillation\b",                "knowledge_distillation"),
    (r"\bAttention Mechanism[s]?\b",               "attention_mechanism"),
    (r"\bMulti[ -]Head Attention\b",               "multi_head_attention"),
    (r"\bDiffusion Model[s]?\b",                   "diffusion_model"),
    (r"\bNeural Architecture Search\b",            "neural_architecture_search"),
    # Scientific/Medical NLP
    (r"\bNatural Language Processing\b",           "natural_language_processing"),
    (r"\bNamed Entity Recognition\b",              "named_entity_recognition"),
    (r"\bQuestion Answering\b",                    "question_answering"),
    (r"\bMachine Translation\b",                   "machine_translation"),
    (r"\bSentiment Analysis\b",                    "sentiment_analysis"),
    (r"\bInformation Extraction\b",                "information_extraction"),
    (r"\bKnowledge Graph[s]?\b",                   "knowledge_graph"),
    # Computer Vision
    (r"\bObject Detection\b",                      "object_detection"),
    (r"\bImage Segmentation\b",                    "image_segmentation"),
    (r"\bPoint Cloud[s]?\b",                       "point_cloud"),
    (r"\bDepth Estimation\b",                      "depth_estimation"),
    # Systems / Networks
    (r"\bDifferential Privacy\b",                  "differential_privacy"),
    (r"\bFederated Averaging\b",                   "federated_averaging"),
    (r"\bPhysics[ -]Informed Neural Network[s]?\b","physics_informed_neural_network"),
    (r"\bNeural Ordinary Differential Equation[s]?\b", "neural_ordinary_differential_equation"),
]
# Compiled once at module load for speed (re.IGNORECASE so lowercase text also matches)
_COMPOUND_PATTERNS: list[tuple[re.Pattern, str]] = [
    (re.compile(pat, re.IGNORECASE), repl) for pat, repl in _COMPOUND_TERMS
]


def _preserve_compound_terms(text: str) -> str:
    """
    HOW: Replaces known multi-word technical compound terms with underscore-joined tokens
    BEFORE any cleaning or tokenization. Operates on original (mixed-case) text so patterns
    can be case-insensitive. Returns text with compounds joined.

    Example: "Graph Attention Networks" → "graph_attention_network"
    This token then survives spaCy lemmatization as a single unit regardless of spaCy model.
    """
    for pattern, replacement in _COMPOUND_PATTERNS:
        text = pattern.sub(replacement, text)
    return text



def clean_text(text: str) -> str:
    """HOW: Text cleaning pipeline — applied in order, each step stripping one noise type."""
    text = _preserve_compound_terms(text)  # Step 0: Join compound technical terms (e.g. "Graph Attention Network" → "graph_attention_network")
    text = _LATEX_RE.sub(" ", text)        # Step 1: Remove LaTeX math equations e.g. $f(x)$
    text = _URL_RE.sub(" ", text)          # Step 2: Remove web links e.g. https://...
    text = _DOI_RE.sub(" ", text)          # Step 3: Remove DOI strings
    text = _ARXIV_ID_RE.sub(" ", text)     # Step 4: Remove arXiv ID references
    text = _EMAIL_RE.sub(" ", text)        # Step 5: Remove email addresses
    text = text.encode("ascii", "ignore").decode("ascii")  # Step 6: Remove non-ASCII characters (e.g. accented chars)
    text = text.lower()                    # Step 7: Convert everything to lowercase
    text = _NON_ALNUM_RE.sub(" ", text)   # Step 8: Remove remaining punctuation symbols (underscores in compound tokens preserved by [^a-z0-9\s\-] allowing _ implicitly since underscores are in [a-z0-9])
    text = _MULTISPACE_RE.sub(" ", text).strip()  # Step 9: Collapse multiple spaces into single space
    return text



# ---------------------------------------------------------------------------
# HOW: Cleaned text is tokenized and lemmatized using spaCy
# Lemmatization (root word conversion) runs BEFORE stopword filtering
# so we only need to store root forms in DOMAIN_STOPWORDS
# ---------------------------------------------------------------------------

def tokenize_and_lemmatize(clean_text_str: str, min_token_len: int = 3) -> list[str]:
    """HOW: spaCy processes the clean string and returns only high-value root lemma tokens."""
    nlp = _get_nlp()
    doc = nlp(clean_text_str)  # HOW: This single line runs the full spaCy pipeline on the text

    # HOW: Detect multi-word named entities (ORG, GPE, PRODUCT) BEFORE token loop
    # and join them with underscores so they stay as one compound token
    # Example: "World Health Organization" → "world_health_organization"
    entity_spans = {
        (ent.start, ent.end): ent.text.strip().lower().replace(" ", "_")
        for ent in doc.ents
        if ent.label_ in ("ORG", "GPE", "PRODUCT") and len(ent.text.split()) > 1
    }

    tokens = []
    i = 0
    while i < len(doc):
        # HOW: Check if current position is the start of a named entity span
        matched_entity = next(((s, e) for (s, e) in entity_spans if s == i), None)
        if matched_entity:
            # HOW: Add the underscore-joined entity as a single token and skip past it
            tokens.append(entity_spans[matched_entity])
            i = matched_entity[1]
            continue

        tok = doc[i]
        i += 1

        # HOW: Skip standard English stopwords (the, is, and...), punctuation, and spaces
        if tok.is_stop or tok.is_punct or tok.is_space:
            continue

        # HOW: Get the base root lemma of the token (spaCy's morphological analysis)
        # Example: "shows" → "show", "algorithms" → "algorithm", "running" → "run"
        lemma = tok.lemma_.lower().strip()

        # HOW: Filter out very short tokens (noise like "a", "to", "of")
        # and any lemma that is in our academic domain stopwords set
        if len(lemma) < min_token_len or lemma in DOMAIN_STOPWORDS:
            continue

        tokens.append(lemma)  # HOW: Only high-value content lemmas reach this line

    return tokens


# ---------------------------------------------------------------------------
# HOW: Verbose tokenizer — captures actual word collections at Steps 3, 4, 5
# Returns 3 separate lists so pipeline.py can display what words exist at each step
# ---------------------------------------------------------------------------

def _tokenize_verbose(clean_text_str: str, min_token_len: int = 3) -> dict:
    """
    HOW: Runs tokenization + lemmatization + filtering and captures the word list
    at each intermediate step:
      step3_tokens  = raw word strings after spaCy tokenization (before lemmatization)
      step4_tokens  = lemmatized root forms (before stopword filtering)
      step5_tokens  = final tokens (after all filtering — identical to preprocess_paper output)
    """
    nlp = _get_nlp()
    doc = nlp(clean_text_str)

    # HOW: Named entity spans for compound token joining
    entity_spans = {
        (ent.start, ent.end): ent.text.strip().lower().replace(" ", "_")
        for ent in doc.ents
        if ent.label_ in ("ORG", "GPE", "PRODUCT") and len(ent.text.split()) > 1
    }

    step3_tokens  = []  # Raw word strings after tokenization (before lemmatization)
    step4_tokens  = []  # Root lemmas before stopword filtering
    step5_tokens  = []  # Final tokens after all filtering

    i = 0
    while i < len(doc):
        matched_entity = next(((s, e) for (s, e) in entity_spans if s == i), None)
        if matched_entity:
            entity_word = entity_spans[matched_entity]
            step3_tokens.append(entity_word)  # Step 3: raw token
            step4_tokens.append(entity_word)  # Step 4: lemma (entity stays same)
            step5_tokens.append(entity_word)  # Step 5: passes filter
            i = matched_entity[1]
            continue

        tok = doc[i]
        i += 1

        # Step 3: Capture raw word text BEFORE any filtering
        if not tok.is_space and not tok.is_punct:
            step3_tokens.append(tok.text.lower())

        # Skip English stopwords and punctuation for steps 4 & 5
        if tok.is_stop or tok.is_punct or tok.is_space:
            continue

        # Step 4: Capture root lemma BEFORE domain stopword filter
        lemma = tok.lemma_.lower().strip()
        step4_tokens.append(lemma)

        # Step 5: Apply length and domain stopword filter
        if len(lemma) < min_token_len or lemma in DOMAIN_STOPWORDS:
            continue

        step5_tokens.append(lemma)  # Only high-value content lemmas reach here

    return {
        "step3_tokens" : step3_tokens,   # Words after tokenization (before lemmatization)
        "step4_tokens" : step4_tokens,   # Lemmas before stopword filtering
        "step5_tokens" : step5_tokens,   # Final clean tokens
    }


# ---------------------------------------------------------------------------
# HOW: A single paper dictionary is preprocessed end-to-end
# Runs: clean_text() → tokenize_and_lemmatize() → returns token list
# ---------------------------------------------------------------------------

def preprocess_paper(paper: dict) -> list[str]:
    """HOW: Full single-paper preprocessing pipeline — clean → tokenize → lemmatize."""
    title    = (paper.get("title")    or "").strip()
    tldr     = (paper.get("tldr")     or "").strip()
    abstract = (paper.get("abstract") or "").strip()
    fos      = " ".join(paper.get("s2_fields_of_study") or [])

    parts = [title, tldr, abstract, fos]
    raw = ". ".join(p for p in parts if p).strip()

    cleaned = clean_text(raw)              # HOW: Step 1 — Remove noise with Regex
    return tokenize_and_lemmatize(cleaned) # HOW: Step 2 — Tokenize, lemmatize, filter stopwords


# ---------------------------------------------------------------------------
# HOW: Verbose version of preprocess_paper — returns ALL intermediate steps
# Used by pipeline.py to print a detailed per-paper preprocessing report
# ---------------------------------------------------------------------------

def preprocess_paper_verbose(paper: dict) -> dict:
    """
    HOW: Runs the full preprocessing pipeline and returns a detailed report dict
    containing every intermediate stage so the output can show exactly what happened.

    Returns:
        {
            'id'              : paper ID string,
            'title'           : paper title string,
            'raw_text'        : raw concatenated title + tldr + abstract + fos string,
            'raw_word_count'  : number of words in raw text,
            'cleaned_text'    : text after Regex noise removal,
            'cleaned_word_count': number of words after Regex cleaning,
            'tokens'          : final list of root lemma tokens,
            'token_count'     : number of final tokens,
            'words_removed'   : how many words were stripped by Regex + stopword filtering,
        }
    """
    title    = (paper.get("title")    or "").strip()
    tldr     = (paper.get("tldr")     or "").strip()
    abstract = (paper.get("abstract") or "").strip()
    fos      = " ".join(paper.get("s2_fields_of_study") or [])

    # Step 1: Concatenate title + tldr + abstract + fieldsOfStudy into one raw string (deduplicating tldr if already in abstract)
    parts = [title]
    if tldr and abstract and tldr.lower() not in abstract.lower():
        parts.append(tldr)
    elif tldr and not abstract:
        parts.append(tldr)
    if abstract:
        parts.append(abstract)
    if fos:
        parts.append(fos)
    raw = ". ".join(p for p in parts if p).strip()
    step1_words = raw.split()  # All words in raw text

    # Step 2: Regex noise stripping
    cleaned = clean_text(raw)
    step2_words = cleaned.split()  # Words after noise removal

    # Steps 3, 4, 5: Tokenize → Lemmatize → Filter — captures each step's word list
    verbose = _tokenize_verbose(cleaned)

    return {
        "id"               : paper.get("id"),
        "title"            : title,
        # Step 1 data
        "raw_text"         : raw,
        "step1_words"      : step1_words,
        "raw_word_count"   : len(step1_words),
        # Step 2 data
        "cleaned_text"     : cleaned,
        "step2_words"      : step2_words,
        "cleaned_word_count": len(step2_words),
        # Step 3 data
        "step3_tokens"     : verbose["step3_tokens"],
        # Step 4 data
        "step4_tokens"     : verbose["step4_tokens"],
        # Step 5 data (final output)
        "tokens"           : verbose["step5_tokens"],
        "token_count"      : len(verbose["step5_tokens"]),
        "words_removed"    : len(step1_words) - len(verbose["step5_tokens"]),
    }


def preprocess_corpus(papers: list[dict], batch_size: int = 256) -> dict[str, list[str]]:
    """HOW: Efficiently batch-processes all papers using vectorized regex + spaCy nlp.pipe."""
    if not papers:
        return {}

    nlp = _get_nlp()
    cleaned_texts = []
    pids = []

    for p in papers:
        title = (p.get("title") or "").strip()
        tldr = (p.get("tldr") or "").strip()
        abstract = (p.get("abstract") or "").strip()
        fos = " ".join(p.get("s2_fields_of_study") or [])
        raw = ". ".join(part for part in (title, tldr, abstract, fos) if part).strip()
        cleaned_texts.append(clean_text(raw))
        pids.append(p.get("id"))

    # Vectorized spaCy batch processing
    docs = nlp.pipe(cleaned_texts, batch_size=batch_size)

    results = {}
    for pid, doc in zip(pids, docs):
        tokens = []
        for tok in doc:
            if tok.is_stop or tok.is_punct or tok.is_space:
                continue
            lemma = tok.lemma_.lower().strip()
            if len(lemma) < 3 or lemma in DOMAIN_STOPWORDS:
                continue
            tokens.append(lemma)
        results[pid] = tokens

    return results
