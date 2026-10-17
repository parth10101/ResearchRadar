@echo off
title ResearchRadar - Novelty Metric Pipeline & SOTA Replication Demo
color 0B
echo ===============================================================================
echo Starting ResearchRadar End-to-End Novelty Pipeline Demo...
echo ===============================================================================
echo.

if exist "venv311\Scripts\python.exe" (
    venv311\Scripts\python.exe scripts\demo_novelty_pipeline.py
) else (
    python scripts\demo_novelty_pipeline.py
)

echo.
echo ===============================================================================
echo Demo execution complete. Press any key to close this window.
echo ===============================================================================
pause >nul
