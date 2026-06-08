#!/bin/bash
#
# Start n8n in development mode with the baramundi custom nodes loaded.
# Requires: npm install  (dev dependencies must be installed)
#
# Workaround: n8n's CustomDirectoryLoader globs **/*.node.js with no node_modules
# exclusion, so brotli-wasm/index.node.js (a native addon from @n8n/node-cli's
# transitive deps) is mistaken for an n8n node class and crashes on load.
# Fix: symlink a clean staging directory (dist/ + package.json only) instead of
# the project root. No node_modules → no false positives.
#
# Open http://localhost:5678 after startup (allow ~60s on first run).

set -e

cd "$(dirname "$0")"

PACKAGE_NAME="n8n-nodes-baramundi-management-suite"
STAGING_DIR="$HOME/.n8n-node-cli-staging/$PACKAGE_NAME"
LINK_PATH="$HOME/.n8n/custom/node_modules/$PACKAGE_NAME"

echo "Stopping any existing n8n processes..."
pkill -f "node.*n8n/bin" 2>/dev/null || true

echo "Building TypeScript..."
node_modules/.bin/n8n-node build

echo "Setting up staging directory (dist/ + package.json, no node_modules)..."
mkdir -p "$STAGING_DIR"
rsync -a --delete dist/ "$STAGING_DIR/dist/"
cp package.json "$STAGING_DIR/package.json"

echo "Updating symlink -> $STAGING_DIR"
mkdir -p "$(dirname "$LINK_PATH")"
rm -rf "$LINK_PATH"
ln -sf "$STAGING_DIR" "$LINK_PATH"

echo ""
echo "Starting n8n..."
echo "-> Open http://localhost:5678 once startup is complete (~60s on first run)"
echo "-> Rebuild after code changes: npm run build  (then restart this script)"
echo "-> Press Ctrl+C to stop"
echo ""
npx --yes n8n@^2.19.0 start
