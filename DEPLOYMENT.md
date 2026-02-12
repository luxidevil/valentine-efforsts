# Valentine Card Generator - Docker Deployment

## Quick Start (Local)

1. **Clone the repository**

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` with your values:**
   ```
   GEMINI_API_KEY=your_gemini_api_key
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

4. **Run with Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```

5. **Access the app:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8001

---

## GCP Deployment

### Option 1: Google Cloud Run (Recommended)

**Deploy Backend:**
```bash
cd backend

# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/valentine-backend

# Deploy to Cloud Run
gcloud run deploy valentine-backend \
  --image gcr.io/YOUR_PROJECT_ID/valentine-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "MONGO_URL=your_mongodb_url,DB_NAME=valentine_cards,GEMINI_API_KEY=your_key,CORS_ORIGINS=*"
```

**Deploy Frontend:**
```bash
cd frontend

# Build with backend URL
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/valentine-frontend \
  --build-arg REACT_APP_BACKEND_URL=https://your-backend-url.run.app

# Deploy to Cloud Run
gcloud run deploy valentine-frontend \
  --image gcr.io/YOUR_PROJECT_ID/valentine-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 2: Google Compute Engine (VM)

1. **Create a VM instance** with Docker installed

2. **SSH into the VM:**
   ```bash
   gcloud compute ssh YOUR_INSTANCE_NAME
   ```

3. **Clone your repo and run:**
   ```bash
   git clone YOUR_REPO_URL
   cd YOUR_REPO

   # Create .env file
   echo "GEMINI_API_KEY=your_key" > .env
   echo "REACT_APP_BACKEND_URL=http://YOUR_VM_IP:8001" >> .env

   # Run with Docker Compose
   docker-compose up -d --build
   ```

4. **Open firewall ports:**
   ```bash
   gcloud compute firewall-rules create allow-http \
     --allow tcp:80,tcp:8001 \
     --target-tags http-server
   ```

### Option 3: Google Kubernetes Engine (GKE)

For production-scale deployment, use the provided Kubernetes manifests (create if needed).

---

## MongoDB Options for GCP

1. **MongoDB Atlas** (Recommended): Free tier available, fully managed
   - Create cluster at https://www.mongodb.com/atlas
   - Get connection string and use in `MONGO_URL`

2. **Self-hosted on GCE**: Run MongoDB in a separate VM or container

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://...` |
| `DB_NAME` | Database name | `valentine_cards` |
| `REACT_APP_BACKEND_URL` | Backend API URL | `https://api.yourdomain.com` |
| `CORS_ORIGINS` | Allowed origins | `*` or `https://yourdomain.com` |

---

## Useful Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```
