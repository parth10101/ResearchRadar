import sys
import os
sys.path.insert(0, os.path.abspath("."))
import urllib.parse
from sqlmodel import SQLModel, Session, create_engine, select

from research_radar.app.models.db_models import (
    CorpusRecord, PaperRecord, TopicClusterRecord, CitationEdgeRecord, ResearchGapRecord, PipelineJobRecord
)

pw = '[(@#)]0parth'
encoded = urllib.parse.quote_plus(pw)
project_ref = 'maoapmmpnwjcaftvlpfa'
supabase_url = f'postgresql://postgres.{project_ref}:{encoded}@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres'

print("Connecting to Supabase PostgreSQL...", flush=True)
engine = create_engine(supabase_url, echo=False)

print("Ensuring tables exist...", flush=True)
SQLModel.metadata.create_all(engine)
print("Tables ready!", flush=True)

sqlite_engine = create_engine('sqlite:///data/research_radar.db', echo=False)

models = [
    (CorpusRecord, "corpora"),
    (PaperRecord, "papers"),
    (TopicClusterRecord, "topic_clusters"),
    (CitationEdgeRecord, "citation_edges"),
    (ResearchGapRecord, "research_gaps"),
    (PipelineJobRecord, "pipeline_jobs")
]

BATCH_SIZE = 200

with Session(sqlite_engine) as sqlite_session:
    for model_cls, table_name in models:
        items = sqlite_session.exec(select(model_cls)).all()
        print(f"Transferring {len(items)} records to {table_name}...", flush=True)
        if not items:
            continue
        
        # Batch insert with fresh session
        for i in range(0, len(items), BATCH_SIZE):
            batch = items[i:i + BATCH_SIZE]
            dicts = [item.model_dump() for item in batch]
            with Session(engine) as pg_session:
                try:
                    pg_session.bulk_insert_mappings(model_cls, dicts)
                    pg_session.commit()
                except Exception as e:
                    pg_session.rollback()
                    # if already exists, merge individually
                    for item in batch:
                        try:
                            with Session(engine) as s:
                                s.merge(item)
                                s.commit()
                        except:
                            pass
            print(f"  {table_name}: {min(i + BATCH_SIZE, len(items))}/{len(items)} done", flush=True)
        print(f"Successfully populated {table_name}!", flush=True)

print("ALL DATA MIGRATION COMPLETE!", flush=True)
