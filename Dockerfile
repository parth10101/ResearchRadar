# ==============================================================================
# ResearchRadar: Multi-Stage Production Docker Build
# ==============================================================================
# Stage 1: Build & Dependencies
FROM python:3.11-slim AS builder

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
# Stage 2: Minimal Production Runtime
FROM python:3.11-slim AS runner

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/root/.local/bin:$PATH

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /root/.local /root/.local

# Copy application source and configurations
COPY research_radar/ ./research_radar/
COPY .agents/ ./.agents/
COPY GEMINI.md ./
COPY FORMULAS_AND_PAPERS_REFERENCE.md ./

EXPOSE 8000

# Run production Uvicorn server
CMD ["uvicorn", "research_radar.api:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
