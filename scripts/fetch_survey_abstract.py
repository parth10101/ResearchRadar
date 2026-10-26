import urllib.request
import json

url = "https://api.semanticscholar.org/graph/v1/paper/10.4236/jis.2023.142008?fields=title,abstract,tldr"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("S2 title:", data.get("title"))
        print("S2 abstract:", data.get("abstract"))
        print("S2 tldr:", data.get("tldr"))
except Exception as e:
    print("Error:", e)

# Also try Crossref
url2 = "https://api.crossref.org/works/10.4236/jis.2023.142008"
req2 = urllib.request.Request(url2, headers={"User-Agent": "ResearchRadar/1.0 (mailto:test@example.com)"})
try:
    with urllib.request.urlopen(req2) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        msg = data.get("message", {})
        print("\nCrossref abstract:", msg.get("abstract"))
except Exception as e:
    print("Crossref Error:", e)
