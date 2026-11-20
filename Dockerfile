# ==============================================================================
# ResearchRadar: Multi-Stage Production Docker Build for Render / Cloud
# ==============================================================================

# Stage 1: Build React Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Python Dependencies
FROM python:3.11-slim AS python-builder
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --user -r requirements.txt

# ------------------------------------------------------------------------------
# Stage 3: Minimal Production Runtime
FROM python:3.11-slim AS runner

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/root/.local/bin:$PATH \
    PORT=8000

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=python-builder /root/.local /root/.local

# Copy built frontend distribution
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Copy application source, data, and configurations
COPY research_radar/ ./research_radar/
COPY data/ ./data/
COPY .agents/ ./.agents/
COPY GEMINI.md ./
COPY FORMULAS_AND_PAPERS_REFERENCE.md ./

EXPOSE 8000

# Bind to Render dynamic $PORT or fallback to 8000
CMD ["sh", "-c", "uvicorn research_radar.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
