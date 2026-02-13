#!/bin/bash
pip install -r /home/runner/workspace/backend/requirements.txt
cd /home/runner/workspace/frontend
npm install
npm run build
