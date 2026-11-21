import os
import sys
sys.path.insert(0, os.path.abspath("."))
for line in open(".env"):
    if "=" in line and not line.startswith("#"):
        k, v = line.strip().split("=", 1)
        os.environ[k] = v

from pathlib import Path
from research_radar.app.services.db_service import sync_directory_to_db

out_dir = Path("data/output_deep_learning_and_cnn_300")
sync_directory_to_db(
    corpus_id="output_deep_learning_and_cnn_300",
    dir_path=out_dir,
    metadata={
        "name": '"Deep Learning" AND "CNN" (300 Papers)',
        "description": "300 genuine papers from OpenAlex with 3D clusters, citation network, and C_obs=0 gap analysis.",
        "query": '"Deep Learning" AND "CNN"',
        "papers": 300,
        "source": "curated_preset"
    }
)
print("Successfully synced output_deep_learning_and_cnn_300 to Supabase PostgreSQL!")
