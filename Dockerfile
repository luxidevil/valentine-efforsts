# Full Stack Dockerfile for GCP Deployment
# Builds both frontend and backend in a single container

# Stage 1: Build Frontend
FROM node:18-alpine as frontend-build

WORKDIR /frontend

COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY frontend/ .

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

RUN yarn build

# Stage 2: Production
FROM python:3.11-slim

WORKDIR /app

# Install nginx and supervisor
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy frontend build
COPY --from=frontend-build /frontend/build /var/www/html

# Nginx config
RUN echo 'server { \n\
    listen 80; \n\
    server_name localhost; \n\
    root /var/www/html; \n\
    index index.html; \n\
    \n\
    location / { \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
    \n\
    location /api { \n\
        proxy_pass http://127.0.0.1:8001; \n\
        proxy_set_header Host $host; \n\
        proxy_set_header X-Real-IP $remote_addr; \n\
    } \n\
}' > /etc/nginx/sites-available/default

# Supervisor config
RUN echo '[supervisord] \n\
nodaemon=true \n\
\n\
[program:nginx] \n\
command=/usr/sbin/nginx -g "daemon off;" \n\
autostart=true \n\
autorestart=true \n\
\n\
[program:backend] \n\
command=uvicorn backend.server:app --host 0.0.0.0 --port 8001 \n\
directory=/app \n\
autostart=true \n\
autorestart=true \n\
' > /etc/supervisor/conf.d/app.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
