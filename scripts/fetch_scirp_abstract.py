import urllib.request
import re

url = "https://www.scirp.org/journal/paperinformation?paperid=124036"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
try:
    with urllib.request.urlopen(req, timeout=5) as resp:
        html = resp.read().decode("utf-8", errors="replace")
        # Extract abstract
        m = re.search(r'ABSTRACT</b.*?>\s*<p.*?>(.*?)</p>', html, re.DOTALL | re.IGNORECASE)
        if m:
            clean = re.sub(r'<.*?>', '', m.group(1)).strip()
            print("Extracted Abstract:\n", clean)
        else:
            # Look for meta description
            m2 = re.search(r'<meta name="description" content="(.*?)"', html, re.DOTALL | re.IGNORECASE)
            if m2:
                print("Meta description:\n", m2.group(1))
            else:
                print("Could not find abstract tag, html length:", len(html))
except Exception as e:
    print("Error:", e)
