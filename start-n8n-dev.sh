#!/bin/bash
#
# Start n8n in development mode with the Baramundi custom node
#
# This script:
# 1. Stops any existing n8n instances
# 2. Builds the Baramundi node
# 3. Starts n8n in dev mode with hot-reload
#

set -e

echo "🛑 Stopping any existing n8n instances..."
pkill -f "n8n" || true
pkill -f "n8n-node" || true
sleep 2

echo "🔨 Building Baramundi node..."
cd "$(dirname "$0")"
npm run build

echo "🚀 Starting n8n in development mode..."
echo "📝 The Baramundi node will be automatically loaded"
echo "🌐 n8n will be available at: http://localhost:5678"
echo ""
echo "Press Ctrl+C to stop n8n"
echo ""

# Start n8n in dev mode (not in background, so you can see logs)
npm run dev
