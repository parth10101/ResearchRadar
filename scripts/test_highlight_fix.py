import re

def get_word_pattern(w):
    clean_w = re.escape(w)
    lower = w.lower()
    if re.match(r'^gnns?$', lower):
        return r'(?:gnns?|graph\s+neural\s+networks?)'
    if re.match(r'^cnns?$', lower):
        return r'(?:cnns?|convolutional\s+neural\s+networks?)'
    if re.match(r'^vits?$', lower):
        return r'(?:vits?|vision\s+transformers?)'
    if re.match(r'^kgs?$', lower):
        return r'(?:kgs?|knowledge\s+graphs?)'
    if re.match(r'^image(?:s|ry)?$', lower):
        return r'(?:image|images|imagery)'
    
    base = clean_w
    if len(base) > 3 and base.lower().endswith('es'):
        base = base[:-2]
    elif len(base) > 3 and base.lower().endswith('s'):
        base = base[:-1]
    return f"{base}(?:s|es)?"

def build_phrase_regex(phrase):
    words = phrase.split()
    parts = [get_word_pattern(w) for w in words]
    return re.compile(r'\b' + r'[\s\-_]+'.join(parts) + r'\b', re.IGNORECASE)

title = "Cybersecurity Knowledge Graph Improvement with Graph Neural Networks"
query = '("Graph Neural Networks" AND "Knowledge Graphs") NOT "Survey"'

# Positive part before NOT
pos_query = query.split("NOT")[0]
print(f"Positive query: {pos_query}")

p1 = "Graph Neural Networks"
p2 = "Knowledge Graphs"

r1 = build_phrase_regex(p1)
r2 = build_phrase_regex(p2)

print(f"Testing title: \"{title}\"")
print(f"Regex 1 ({p1}): {r1.pattern}")
print(f"Match 1: {r1.findall(title)}")

print(f"Regex 2 ({p2}): {r2.pattern}")
print(f"Match 2: {r2.findall(title)}")

assert len(r1.findall(title)) > 0, "Failed to match Graph Neural Networks"
assert len(r2.findall(title)) > 0, "Failed to match Knowledge Graph"
print("\n[SUCCESS] Both concepts successfully matched and highlighted!")
