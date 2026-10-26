import os

for root, dirs, files in os.walk("research_radar"):
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                if "milestones" in content or "extract_main_path" in content:
                    print(f"Found in {path}")
