"""
ResearchRadar: Topic Titles & 3D Manifold Regeneration Script
Re-evaluates and standardizes academic topic titles across all dataset artifacts,
guaranteeing complete, publication-grade, non-truncated titles.
"""

import sys
import json
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from research_radar.stage4_topics import refine_topic_names_academically
from research_radar.export_3d import process_directory
from research_radar.scripts.seed_db import seed_database

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("research_radar.regen_topics")


def regenerate_dataset_topics():
    data_dir = ROOT_DIR / "data"
    if not data_dir.exists():
        logger.warning(f"Data directory {data_dir} does not exist.")
        return

    output_dirs = sorted([p for p in data_dir.glob("output*") if p.is_dir()])
    logger.info(f"Discovered {len(output_dirs)} output directories to standardize...")

    for out_dir in output_dirs:
        topic_file = out_dir / "topic_results.json"
        if not topic_file.exists():
            continue

        logger.info(f"Processing {out_dir.name}...")
        try:
            topic_data = json.loads(topic_file.read_text(encoding="utf-8"))
            clusters_raw = topic_data.get("clusters", {})
            clusters = {int(k): v for k, v in clusters_raw.items()}
            topic_kws_raw = topic_data.get("topic_keywords", {})
            topic_keywords = {int(k): v for k, v in topic_kws_raw.items()}
            current_names_raw = topic_data.get("human_readable_names", {})
            current_names = {int(k): v for k, v in current_names_raw.items()}

            # Load matching papers
            papers = []
            papers_candidates = [
                out_dir / "papers.json",
                data_dir / f"{out_dir.name.replace('output_', '')}_papers.json",
                data_dir / f"{out_dir.name.replace('output_', '')}.json",
                data_dir / "papers.json",
            ]
            for cand in papers_candidates:
                if cand.exists():
                    try:
                        p_list = json.loads(cand.read_text(encoding="utf-8"))
                        if isinstance(p_list, list) and p_list:
                            papers = p_list
                            break
                    except Exception:
                        pass

            # Refine topic names with domain salience & academic formatting
            refined = refine_topic_names_academically(
                topic_keywords_dict=topic_keywords,
                clusters=clusters,
                papers=papers,
                current_names=current_names,
            )

            # Update topic_results.json
            topic_data["human_readable_names"] = {str(k): v for k, v in refined.items()}
            if "topic_representations" in topic_data:
                for k, v in topic_data["topic_representations"].items():
                    try:
                        k_int = int(k)
                        if k_int in refined:
                            v["final_label"] = refined[k_int]
                    except Exception:
                        pass

            topic_file.write_text(json.dumps(topic_data, indent=2, ensure_ascii=False), encoding="utf-8")

            # Update archipelago_data.json if present
            arch_file = out_dir / "archipelago_data.json"
            if arch_file.exists():
                try:
                    arch_data = json.loads(arch_file.read_text(encoding="utf-8"))
                    for isl in arch_data.get("islands", []):
                        isl_id = isl.get("id")
                        if isl_id in refined:
                            isl["name"] = refined[isl_id]
                            isl["label"] = refined[isl_id]
                    arch_file.write_text(json.dumps(arch_data, indent=2, ensure_ascii=False), encoding="utf-8")
                except Exception:
                    pass

            # Re-generate 3D manifold point cloud json
            process_directory(out_dir)
            logger.info(f"Updated {out_dir.name} topics successfully:")
            for tid, tname in sorted(refined.items(), key=lambda x: (1 if x[0] == -1 else 0, x[0])):
                logger.info(f"  - Topic {tid}: {tname}")

        except Exception as e:
            logger.error(f"Failed processing {out_dir.name}: {e}", exc_info=True)

    # Re-sync database
    logger.info("Resyncing SQLite / Supabase database...")
    seed_database()
    logger.info("Regeneration complete!")


if __name__ == "__main__":
    regenerate_dataset_topics()
