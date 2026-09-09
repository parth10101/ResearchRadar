@echo off
echo ===================================================
echo Starting ResearchRadar Unified Application...
echo Serving at: http://127.0.0.1:8000
echo ===================================================

start http://127.0.0.1:8000
.\venv311\Scripts\python.exe -m uvicorn research_radar.api:app --host 127.0.0.1 --port 8000 --reload
pause
