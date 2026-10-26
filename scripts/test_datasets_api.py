import urllib.request
import json

with urllib.request.urlopen("http://127.0.0.1:8000/api/datasets", timeout=3) as r:
    data = json.loads(r.read().decode("utf-8"))
    ds_list = data.get("datasets", [])
    print(f"Total datasets reported by /api/datasets: {len(ds_list)}")
    for d in ds_list:
        if "40" in d.get("id", "") or "100" in d.get("id", ""):
            print(f"  * {d.get('id')}: {d.get('name')} [{d.get('paper_count')} papers]")
