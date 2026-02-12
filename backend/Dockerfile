# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Cloud Run uses PORT env var (usually 8080)
ENV PORT=8080
EXPOSE 8080

# If your FastAPI app is backend.server:app (as you used earlier)
CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT}"]
