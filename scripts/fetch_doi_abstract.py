import urllib.request
import re

url = "https://doi.org/10.4236/jis.2023.142008"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        final_url = resp.geturl()
        print("Final URL:", final_url)
        html = resp.read().decode("utf-8", errors="replace")
        # search for abstract
        m = re.search(r'ABSTRACT.*?</p>\s*<p.*?>(.*?)</p>', html, re.DOTALL | re.IGNORECASE)
        if m:
            clean = re.sub(r'<.*?>', '', m.group(1)).strip()
            print("Found Abstract:\n", clean)
        else:
            # find all text after ABSTRACT
            idx = html.find("ABSTRACT")
            if idx != -1:
                chunk = html[idx:idx+1500]
                clean = re.sub(r'<.*?>', ' ', chunk)
                clean = ' '.join(clean.split())
                print("Chunk near ABSTRACT:\n", clean[:500])
except Exception as e:
    print("Error:", e)
