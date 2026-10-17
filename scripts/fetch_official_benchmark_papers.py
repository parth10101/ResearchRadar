import json
import duckdb

def fetch_official_magenideas_40_papers():
    con = duckdb.connect()
    query = """
        SELECT 
            paper_id,
            id AS sha_id,
            title,
            abstract,
            source_url
        FROM 'https://huggingface.co/datasets/cshuai20/acl2024_long/resolve/main/data/papers/data.parquet'
        ORDER BY try_cast(paper_id AS INT)
        LIMIT 40
    """
    df = con.execute(query).df()
    
    records = []
    for _, row in df.iterrows():
        records.append({
            "paper_id": f"MAGEN_ACL_{row['paper_id']}",
            "index": int(row['paper_id']),
            "title": str(row['title']).strip(),
            "abstract": str(row['abstract']).strip(),
            "source_url": str(row['source_url']).strip(),
            "sha_id": str(row['sha_id']).strip(),
            "venue": "ACL 2024 (Long Paper)",
            "benchmark_source": "MAGenIdeas (Chen & Zhang 2025, cited in Graph2Idea Section 4.1)"
        })
    
    with open("data/acl_2024_40_papers.json", "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully saved {len(records)} official MAGenIdeas ACL 2024 benchmark papers directly to data/acl_2024_40_papers.json!")

if __name__ == "__main__":
    fetch_official_magenideas_40_papers()
