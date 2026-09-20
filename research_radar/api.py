"""
ResearchRadar: Production FastAPI Service Layer (Compatibility Wrapper)
"""

from research_radar.app.main import app

if __name__ == "__main__":
    import uvicorn
    print("\nStarting ResearchRadar Production API on http://127.0.0.1:8000 ...")
    uvicorn.run("research_radar.app.main:app", host="127.0.0.1", port=8000, reload=True)
