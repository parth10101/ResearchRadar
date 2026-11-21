import sys
import os
sys.path.insert(0, os.path.abspath("."))
import urllib.parse
from sqlmodel import Session, create_engine, select
from sqlalchemy.dialects.postgresql import insert

from research_radar.app.models.db_models import (
    CorpusRecord, PaperRecord, TopicClusterRecord, CitationEdgeRecord, ResearchGapRecord, PipelineJobRecord
)

pw = '[(@#)]0parth'
encoded = urllib.parse.quote_plus(pw)
project_ref = 'maoapmmpnwjcaftvlpfa'
supabase_url = f'postgresql://postgres.{project_ref}:{encoded}@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres'

engine = create_engine(supabase_url, echo=False)
sqlite_engine = create_engine('sqlite:///data/research_radar.db', echo=False)

models = [
    (PaperRecord, "papers"),
    (TopicClusterRecord, "topic_clusters"),
    (CitationEdgeRecord, "citation_edges"),
    (ResearchGapRecord, "research_gaps"),
    (PipelineJobRecord, "pipeline_jobs")
]

BATCH_SIZE = 100

with Session(sqlite_engine) as sqlite_session:
    with engine.connect() as conn:
        for model_cls, table_name in models:
            items = sqlite_session.exec(select(model_cls)).all()
            print(f"Transferring {len(items)} records to {table_name}...", flush=True)
            if not items:
                continue
            
            for i in range(0, len(items), BATCH_SIZE):
                batch = items[i:i + BATCH_SIZE]
                dicts = [item.model_dump() for item in batch]
                stmt = insert(model_cls).values(dicts).on_conflict_do_nothing()
                conn.execute(stmt)
                conn.commit()
                print(f"  {table_name}: {min(i + BATCH_SIZE, len(items))}/{len(items)} done", flush=True)
            print(f"Successfully populated {table_name}!", flush=True)

print("ALL DATA MIGRATION COMPLETE!", flush=True)
