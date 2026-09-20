"""
ResearchRadar: Database Initializer & Preset Seeder
Initializes SQLite / Supabase database schemas and loads all precomputed preset datasets.
Run this during setup or startup to guarantee zero-latency offline preset availability.
"""

import sys
import logging
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from research_radar.app.core.database import init_db, get_active_backend
from research_radar.app.services.dataset_service import METADATA_REGISTRY
from research_radar.app.services.db_service import sync_directory_to_db, get_corpora

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("research_radar.seed")


def seed_database():
    logger.info("Initializing database schema...")
    init_db()
    backend = get_active_backend()
    logger.info(f"Active database backend: {backend}")

    data_dir = ROOT_DIR / "data"
    if not data_dir.exists():
        logger.warning(f"Data directory {data_dir} does not exist.")
        return

    logger.info(f"Scanning for preset directories in {data_dir}...")
    seeded_count = 0
    
    for key, meta in METADATA_REGISTRY.items():
        dir_path = data_dir / key
        if dir_path.exists() and dir_path.is_dir():
            logger.info(f"Seeding preset dataset: {key} ({meta.get('name')})...")
            try:
                sync_directory_to_db(corpus_id=key, dir_path=dir_path, metadata=meta)
                seeded_count += 1
            except Exception as e:
                logger.error(f"Failed seeding {key}: {e}", exc_info=True)

    # Check for any extra output_* folders not explicitly in registry
    for p in sorted(data_dir.glob("output_*")):
        if p.is_dir() and p.name not in METADATA_REGISTRY:
            logger.info(f"Discovered uncatalogued output directory: {p.name}. Syncing...")
            try:
                sync_directory_to_db(corpus_id=p.name, dir_path=p)
                seeded_count += 1
            except Exception as e:
                logger.error(f"Failed syncing {p.name}: {e}")

    corpora = get_corpora()
    logger.info(f"Seeding complete. Total corpora in database: {len(corpora)}")
    for c in corpora:
        logger.info(f"  - [{c.id}] {c.name} (papers: {c.paper_count}, source: {c.source})")


if __name__ == "__main__":
    seed_database()
