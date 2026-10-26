import re

def build_regex(phrase: str):
    raw_words = [w.strip() for w in phrase.strip().split() if w.strip()]
    if not raw_words:
        return None
    patterns = []
    for w in raw_words:
        if w.lower().endswith("ies") and len(w) > 3:
            stem = re.escape(w[:-3])
            pat = rf"{stem}(?:y|ies)"
        elif w.lower().endswith("es") and len(w) > 3:
            stem = re.escape(w[:-2])
            pat = rf"{stem}(?:e|es)?"
        elif w.lower().endswith("s") and len(w) > 2:
            stem = re.escape(w[:-1])
            pat = rf"{stem}(?:s)?"
        else:
            stem = re.escape(w)
            pat = rf"{stem}(?:s|es)?"
        patterns.append(pat)
    return re.compile(r'\b' + r'[\s\-_]+'.join(patterns) + r'\b', re.IGNORECASE)

pat1 = build_regex("masked autoencoders")
print("masked autoencoder:", bool(pat1.search("MixMAE: Mixed and Masked Autoencoder for Efficient Pretraining")))
print("masked autoencoders:", bool(pat1.search("A survey on masked autoencoders in computer vision")))

pat2 = build_regex("vision transformer")
print("vision transformer:", bool(pat2.search("An introduction to vision transformer architectures")))
print("vision transformers:", bool(pat2.search("Unified Detection and Recovery with Vision Transformers")))
print("unrelated transformers:", bool(pat2.search("Transformers for audio processing")))
