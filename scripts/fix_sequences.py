import os
import sys
sys.path.insert(0, os.path.abspath("."))
for line in open(".env"):
    if "=" in line and not line.startswith("#"):
        k, v = line.strip().split("=", 1)
        os.environ[k] = v

from sqlalchemy import create_engine, text
engine = create_engine(os.environ["DATABASE_URL"])
with engine.connect() as conn:
    for t in ["citation_edges", "topic_clusters", "pipeline_jobs"]:
        try:
            sql = f"SELECT setval(pg_get_serial_sequence('{t}', 'id'), coalesce(max(id), 0) + 1, false) FROM {t};"
            conn.execute(text(sql))
            conn.commit()
            print(f"Sequence synced for {t}!")
        except Exception as e:
            print(f"Sequence sync error for {t}: {e}")
