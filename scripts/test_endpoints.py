import urllib.request
import json

endpoints = [
    "/api/graph/points3d?dataset=output_live_100_4bar",
    "/api/graph/archipelago?dataset=output_live_100_4bar",
    "/api/graph/citation?dataset=output_live_100_4bar",
    "/api/gaps/detected?dataset=output_live_100_4bar",
    "/api/gaps/narrated?dataset=output_live_100_4bar",
]

for ep in endpoints:
    url = f"http://127.0.0.1:8000{ep}"
    try:
        with urllib.request.urlopen(url, timeout=3) as r:
            data = json.loads(r.read().decode("utf-8"))
            keys = list(data.keys()) if isinstance(data, dict) else f"len={len(data)}"
            print(f"[OK 200] {ep} -> {keys}")
    except Exception as e:
        print(f"[ERROR] {ep} -> {e}")
