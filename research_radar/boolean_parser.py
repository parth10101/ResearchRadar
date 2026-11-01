"""
ResearchRadar: Universal Scientific Boolean Expression Parser & Evaluator
==========================================================================
Parses arbitrary human queries with AND, OR, NOT and parentheses into
a structured Boolean execution tree with automatic typo correction and
scientometric acronym/synonym expansion.
"""

from __future__ import annotations

import re
from typing import Callable, List, Tuple, Set, Any

SYNONYM_EXPANSIONS: dict[str, list[str]] = {
    "cnn": ["cnn", "cnns", "convolutional neural network", "convolutional neural networks", "convnet", "convnets"],
    "convolutional neural network": ["cnn", "cnns", "convolutional neural network", "convolutional neural networks", "convnet", "convnets"],
    "convolutional neural networks": ["cnn", "cnns", "convolutional neural network", "convolutional neural networks", "convnet", "convnets"],
    "gnn": ["gnn", "gnns", "graph neural network", "graph neural networks"],
    "graph neural network": ["gnn", "gnns", "graph neural network", "graph neural networks"],
    "graph neural networks": ["gnn", "gnns", "graph neural network", "graph neural networks"],
    "rnn": ["rnn", "rnns", "recurrent neural network", "recurrent neural networks", "lstm", "gru"],
    "recurrent neural network": ["rnn", "rnns", "recurrent neural network", "recurrent neural networks", "lstm", "gru"],
    "recurrent neural networks": ["rnn", "rnns", "recurrent neural network", "recurrent neural networks", "lstm", "gru"],
    "lstm": ["lstm", "lstms", "long short-term memory", "recurrent neural network"],
    "llm": ["llm", "llms", "large language model", "large language models"],
    "large language model": ["llm", "llms", "large language model", "large language models"],
    "large language models": ["llm", "llms", "large language model", "large language models"],
    "ai": ["ai", "artificial intelligence"],
    "artificial intelligence": ["ai", "artificial intelligence"],
    "rl": ["rl", "reinforcement learning"],
    "reinforcement learning": ["rl", "reinforcement learning"],
    "pinn": ["pinn", "pinns", "physics-informed neural network", "physics-informed neural networks"],
    "physics-informed neural network": ["pinn", "pinns", "physics-informed neural network", "physics-informed neural networks"],
    "physics-informed neural networks": ["pinn", "pinns", "physics-informed neural network", "physics-informed neural networks"],
    "nlp": ["nlp", "natural language processing"],
    "natural language processing": ["nlp", "natural language processing"],
    "cv": ["cv", "computer vision"],
    "computer vision": ["cv", "computer vision"],
    "transfer learning": ["transfer learning", "domain adaptation", "pre-trained", "pretrained"],
    "transformer": ["transformer", "transformers", "attention mechanism", "self-attention"],
    "transformers": ["transformer", "transformers", "attention mechanism", "self-attention"],
    "diffusion": ["diffusion", "diffusion model", "diffusion models", "score-based"],
    "mri": ["mri", "magnetic resonance imaging", "magnetic resonance images", "mri scan", "mri scans", "mri image", "mri images"],
    "brain mri": ["brain mri", "brain magnetic resonance", "mri brain", "mri of the brain", "brain tumor mri", "brain mri images", "brain mri segmentation"],
    "biomedical image processing": ["biomedical image processing", "medical image processing", "biomedical image", "medical image", "medical imaging", "biomedical imaging", "image processing", "image segmentation", "image enhancement"],
    "medical image processing": ["medical image processing", "biomedical image processing", "biomedical image", "medical image", "medical imaging", "biomedical imaging", "image processing"],
    "medical imaging": ["medical imaging", "biomedical imaging", "medical image", "biomedical image", "medical images", "biomedical images"],
    "image processing": ["image processing", "image segmentation", "image enhancement", "feature extraction", "computer vision"],
    "autoencoder": ["autoencoder", "autoencoders", "auto-encoder", "auto-encoders", "variational autoencoder", "vae"],
    "autoencoders": ["autoencoder", "autoencoders", "auto-encoder", "auto-encoders", "variational autoencoder", "vae"],
    "representation learning": ["representation learning", "feature learning", "representation", "representations"],
    "deep learning": ["deep learning", "deep neural network", "deep neural networks"],
}

COMMON_SCIENTIFIC_COMPOUNDS: list[str] = [
    "biomedical image processing", "medical image processing", "image processing",
    "brain mri", "brain tumor", "mri segmentation", "magnetic resonance imaging",
    "deep learning", "machine learning", "reinforcement learning", "transfer learning",
    "neural network", "neural networks", "convolutional neural network", "convolutional neural networks",
    "graph neural network", "graph neural networks", "large language model", "large language models",
    "natural language processing", "computer vision", "drug discovery", "feature extraction",
    "object detection", "semantic segmentation", "medical imaging", "speech recognition",
    "quantum computing", "federated learning", "zero shot", "few shot"
]

def segment_casual_query(text: str) -> list[str]:
    """
    Intelligently segments casual multi-word queries that lack explicit Boolean operators
    (e.g., 'biomedical image processing brain mri' -> ['biomedical image processing', 'brain mri']).
    """
    lower_t = text.lower().strip()
    words = lower_t.split()
    if len(words) <= 3:
        return [text]
    
    found = []
    working_text = lower_t
    for c in sorted(COMMON_SCIENTIFIC_COMPOUNDS, key=len, reverse=True):
        if c in working_text:
            pos = working_text.find(c)
            found.append((pos, c))
            working_text = working_text.replace(c, " " * len(c), 1)
    
    if len(found) >= 2:
        found.sort(key=lambda x: x[0])
        return [item[1] for item in found]
    elif len(found) == 1:
        comp = found[0][1]
        rem = text.lower().replace(comp, "").strip()
        rem_words = rem.split()
        if rem_words:
            if found[0][0] == 0:
                return [comp, " ".join(rem_words)]
            else:
                return [" ".join(rem_words), comp]
                
    mid = len(words) // 2
    return [" ".join(words[:mid]), " ".join(words[mid:])]


TYPO_CORRECTIONS: dict[str, str] = {
    "inteligence": "intelligence",
    "artifical": "artificial",
    "convolutinal": "convolutional",
    "covolutional": "convolutional",
    "transfomer": "transformer",
    "diffuson": "diffusion",
    "algoritm": "algorithm",
    "netowrk": "network",
    "learnng": "learning",
}

def clean_and_correct_term(term: str) -> str:
    """Corrects known typos while preserving scientific casing."""
    words = term.strip().split()
    corrected = [TYPO_CORRECTIONS.get(w.lower(), w) for w in words]
    return " ".join(corrected)

def term_matches_text(term: str, text: str) -> bool:
    """Matches a term or its scientific synonyms with word boundary awareness and stem/plural tolerance."""
    if not term or not text:
        return False
    term_clean = clean_and_correct_term(term.strip().lower())
    text_clean = text.lower()
    
    variants = list(SYNONYM_EXPANSIONS.get(term_clean, [term_clean]))
    if term_clean.endswith("s") and len(term_clean) > 3:
        variants.append(term_clean[:-1])
    else:
        variants.append(term_clean + "s")
        
    for v in variants:
        if " " in v:
            if v in text_clean:
                return True
            if v.endswith("s") and v[:-1] in text_clean:
                return True
            if v.replace(" ", "-") in text_clean:
                return True
        else:
            stem = v[:-1] if (v.endswith("s") and len(v) > 3) else v
            pattern = rf'\b{re.escape(stem)}(?:s|es)?(?:\b|-)'
            if re.search(pattern, text_clean):
                return True
    return False

class BooleanQuery:
    def __init__(self, raw_query: str):
        self.raw_query = raw_query.strip()
        self.positive_clauses: list[list[str]] = []  # AND of ORs: [[A1, A2], [B1], [C1]]
        self.negative_terms: list[str] = []          # NOT terms: [D1, D2]
        self.concepts: list[str] = []                # Clean human-readable concept names: ["A", "B", "C"]
        self._parse()

    def _parse(self):
        q = self.raw_query
        
        # 1. Extract NOT clauses
        not_parts = re.split(r'\bNOT\b|\bnot\b|\s+!\s*', q)
        positive_part = not_parts[0].strip()
        
        for p in not_parts[1:]:
            # extract words or quoted phrases
            neg_items = re.findall(r'"([^"]+)"|(\b[\w\-]+\b)', p)
            for quoted, unquoted in neg_items:
                val = clean_and_correct_term((quoted or unquoted).strip())
                if val and val.upper() not in {"AND", "OR", "NOT"}:
                    self.negative_terms.append(val)
                    
        # 2. Extract AND clauses from the positive part
        and_tokens = re.split(r'\bAND\b|\band\b|\s+&\s+', positive_part)
        for tok in and_tokens:
            tok = tok.strip()
            if not tok:
                continue
                
            # Inside each AND clause, check for OR
            or_tokens = re.split(r'\bOR\b|\bor\b|\s*\|\s*', tok)
            clause_variants = []
            for ot in or_tokens:
                ot_clean = clean_and_correct_term(ot.replace('"', '').replace("'", '').strip())
                if ot_clean and ot_clean.upper() not in {"AND", "OR", "NOT"}:
                    clause_variants.append(ot_clean)
                    
            if clause_variants:
                self.positive_clauses.append(clause_variants)
                # Primary concept label is the first variant capitalized
                primary_label = clause_variants[0]
                self.concepts.append(primary_label)
                
        # Fallback if no positive clauses could be parsed
        if not self.positive_clauses:
            cleaned = clean_and_correct_term(q)
            self.positive_clauses = [[cleaned]]
            self.concepts = [cleaned]

        # If only 1 clause was parsed without explicit AND, check for natural multi-concept phrases
        if len(self.positive_clauses) == 1 and len(self.positive_clauses[0]) == 1:
            raw_single = self.positive_clauses[0][0]
            segmented = segment_casual_query(raw_single)
            if len(segmented) > 1:
                self.positive_clauses = [[term] for term in segmented]
                self.concepts = segmented

    def evaluate_compulsory_title(self, title: str, abstract: str = "") -> bool:
        """
        STRICT COMPULSORY TITLE EVALUATION:
        - For every positive clause (A, B, C under AND):
          Each clause MUST match directly in the paper's TITLE (with synonym/acronym expansions).
        - For OR within a clause (A OR B):
          At least one variant must match in the paper's TITLE.
        - For NOT terms:
          The excluded term must NOT appear in either the TITLE or the ABSTRACT.
        """
        full_text = f"{title} {abstract}"
        # Check negative exclusions (NOT)
        for neg in self.negative_terms:
            if term_matches_text(neg, full_text):
                return False
                
        # Compulsory: Every positive clause MUST match in the TITLE
        for or_clause in self.positive_clauses:
            if not any(term_matches_text(term, title) for term in or_clause):
                return False
                
        return True

    def evaluate(self, title: str, abstract: str = "") -> bool:
        """
        Evaluates whether a paper satisfies the exact Boolean formula:
        (Clause1_OR1 OR Clause1_OR2) AND (Clause2) AND ... AND NOT (Neg1 OR Neg2)
        """
        full_text = f"{title} {abstract}"
        
        # Check negative exclusions (NOT)
        for neg in self.negative_terms:
            if term_matches_text(neg, full_text):
                return False
                
        # Check positive clauses (AND of ORs)
        for or_clause in self.positive_clauses:
            if not any(term_matches_text(term, full_text) for term in or_clause):
                return False
                
        return True

    def calculate_score(self, title: str, abstract: str = "", citations: int = 0) -> float:
        """Computes a relevance score boosting papers with terms in the title."""
        title_matches = 0
        abstract_matches = 0
        
        for or_clause in self.positive_clauses:
            if any(term_matches_text(t, title) for t in or_clause):
                title_matches += 1
            elif any(term_matches_text(t, abstract) for t in or_clause):
                abstract_matches += 1
                
        # Heavy weight for title matches (10.0 per clause), plus abstract (2.0), plus citation log
        import math
        cits_score = math.log10(max(1, citations))
        return (title_matches * 10.0) + (abstract_matches * 2.0) + cits_score

    def get_search_terms(self) -> list[str]:
        """Returns the primary search keywords for academic search API querying."""
        terms = []
        for or_clause in self.positive_clauses:
            if or_clause:
                terms.append(or_clause[0])
        return terms
