#!/bin/sh
set -e

echo "🔄 Running database migrations..."
pnpm deploy

echo "🚀 Starting application..."
exec pnpm start:prod