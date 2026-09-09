---
name: production-api-and-deployment
description: >-
  Production standards for FastAPI streaming services, Server-Sent Events (SSE),
  Docker multi-stage containerization, CI/CD pipelines, and cloud deployment.
---

# Production API & Cloud Deployment Skill

This skill governs transforming ResearchRadar from a local CLI pipeline into a robust, multi-tenant, cloud-deployable SaaS web application.

---

## 1. FastAPI Streaming Architecture with Server-Sent Events (SSE)

Long-running ML pipelines ($10\text{s} - 60\text{s}$) must never block HTTP threads.
* **Execution Model:**
  - `POST /api/pipeline/run`: Validates inputs, creates a deterministic `job_id`, and initiates background execution via `asyncio.create_task` or a Celery task queue.
  - `GET /api/pipeline/stream/{job_id}`: Streams real-time pipeline lifecycle events over `text/event-stream` (SSE) so frontend dashboards display stage progress bars dynamically.

### Event Format Schema:
```json
{
  "stage": 4,
  "stage_name": "Stage 4: Topic Modelling",
  "status": "in_progress",
  "progress_pct": 50,
  "message": "Fitting HDBSCAN density clustering on 3,000 papers...",
  "timestamp": "2026-09-07T14:30:00Z"
}
```

---

## 2. Multi-Stage Docker Containerization

Follow strict containerization standards to minimize image size and attack surface:
* **Stage 1 (Builder):** Installs compiler tools, build dependencies, and installs heavy wheels (PyTorch, sentence-transformers, spacy, scikit-learn).
* **Stage 2 (Runtime):** Copies only installed site-packages into a clean `python:3.11-slim` or `python:3.12-slim` base image.
* **Security Rules:**
  - Never run as root (`USER appuser`).
  - Read secrets (`S2_API_KEY`, `GROQ_API_KEY`) strictly from environment variables or Docker secrets, never baked into image layers.

---

## 3. Production Multi-Service Stack (`docker-compose.yml`)

A standard production deployment consists of:
1. **`api` Service:** FastAPI application served by Uvicorn with Gunicorn process manager.
2. **`worker` Service:** Background asynchronous pipeline worker consuming jobs from Redis queue.
3. **`redis` Service:** In-memory job state and progress pub/sub broker.
4. **`proxy` Service (Nginx):** Reverse proxy handling SSL termination, rate limiting, and caching static interactive visualizations.
