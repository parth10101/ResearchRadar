import os

for root, dirs, files in os.walk("frontend/src"):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                if "Methodological Summary" in content or "METHODOLOGICAL SUMMARY" in content or "Open Official DOI" in content:
                    print(f"Found milestone viewer in: {path}")
