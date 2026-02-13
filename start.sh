#!/bin/bash
cd /home/runner/workspace
python -m uvicorn backend.server:app --host localhost --port 8000 &
BACKEND_PID=$!

cd /home/runner/workspace/frontend
PORT=5000 HOST=0.0.0.0 npx craco start &
FRONTEND_PID=$!

wait $FRONTEND_PID
