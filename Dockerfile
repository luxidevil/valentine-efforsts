FROM node:20-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --production=false

COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/build ./frontend/build

ENV PORT=8080
ENV HOST=0.0.0.0

EXPOSE 8080

CMD ["python", "-m", "uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "8080"]
