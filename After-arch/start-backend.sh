#!/bin/bash
# Start Backend Server

echo "Starting Backend Server..."
cd backend

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the server
echo "Backend running on http://localhost:5000"
npm run dev
