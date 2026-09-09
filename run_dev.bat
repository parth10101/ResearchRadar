@echo off
echo ===================================================
echo Starting ResearchRadar in Live Dev Mode...
echo Backend API : http://127.0.0.1:8000
echo Frontend Vite: http://localhost:5173
echo ===================================================

start "ResearchRadar API" cmd /k ".\venv311\Scripts\python.exe -m uvicorn research_radar.api:app --host 127.0.0.1 --port 8000 --reload"
start "ResearchRadar Vite" cmd /k "cd frontend & npm run dev"

timeout /t 3 >nul
start http://localhost:5173
