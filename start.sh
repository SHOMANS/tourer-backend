#!/bin/sh
set -e

echo "🔄 Running database migrations..."
pnpm run deploy

echo "🚀 Starting application..."
exec pnpm start:prod