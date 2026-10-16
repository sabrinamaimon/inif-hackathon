#!/usr/bin/env bash

# ==============================================================================
# DhakaPath 1-Click Automated Startup Script
# IAIT National IT Fest 2026 Smart City Hackathon
# ==============================================================================

set -e

echo "🚀 Starting DhakaPath: Live Urban Transit & Route Intelligence..."

# Get absolute path of project root
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 1. Setup Backend
echo "📦 Checking Backend (FastAPI + Python)..."
cd "$PROJECT_ROOT/backend"
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "Installing backend requirements..."
pip install -r requirements.txt --quiet

# Start backend in background
echo "⚡ Launching FastAPI Backend on http://localhost:8000..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 2. Setup Frontend
echo "📦 Checking Frontend (Next.js 14)..."
cd "$PROJECT_ROOT/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
echo "⚡ Launching Next.js Frontend on http://localhost:3000..."
npm run dev &
FRONTEND_PID=$!

# Trap signals for graceful exit
cleanup() {
    echo ""
    echo "🛑 Shutting down DhakaPath services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "Done. Have a great hackathon!"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

echo ""
echo "===================================================================="
echo "🎉 DhakaPath is LIVE!"
echo "   Frontend Web App:  http://localhost:3000"
echo "   Backend REST API:  http://localhost:8000"
echo "   Swagger API Docs:  http://localhost:8000/docs"
echo "===================================================================="
echo "Press Ctrl+C to terminate all services."

# Wait indefinitely
wait
