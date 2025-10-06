#!/bin/bash

echo "🚀 Deploying SDLC Workflow to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if user is logged in to Netlify
if ! netlify status &> /dev/null; then
    echo "🔐 Please log in to Netlify first:"
    netlify login
fi

# Create a simple package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "📦 Creating package.json..."
    cat > package.json << EOF
{
  "name": "sdlc-workflow",
  "version": "1.0.0",
  "description": "SDLC Complete Workflow Guide",
  "main": "index.html",
  "scripts": {
    "build": "echo 'No build step needed'",
    "deploy": "netlify deploy --prod"
  },
  "keywords": ["sdlc", "workflow", "development"],
  "author": "Szymon",
  "license": "MIT"
}
EOF
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir .

echo "✅ Deployment complete!"
echo "🔗 Your site should be available at the URL shown above"
