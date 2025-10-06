#!/bin/bash

# Script to commit files for GitHub Pages deployment
# This script adds only the essential files needed for GitHub Pages

echo "🚀 Preparing files for GitHub Pages deployment..."

# Add essential files
echo "📁 Adding core files..."
git add sdlc-workflow.html
git add sdlc-workflow.json
git add package.json
git add README.md
git add .gitignore
git add DEPLOYMENT.md

# Add optional supporting files
echo "📁 Adding supporting files..."
git add fetch-local-browser-data.html
git add fetch-browser-data.js
git add auto-sync.js
git add test-system.js
git add server.js

# Add other HTML files if they exist
if [ -f "eds-multisite.html" ]; then
    git add eds-multisite.html
fi

if [ -f "EDS-multitenant.html" ]; then
    git add EDS-multitenant.html
fi

# Check what files are staged
echo "📋 Files staged for commit:"
git status --porcelain

# Commit with message
echo "💾 Committing files..."
git commit -m "Deploy SDLC Workflow System to GitHub Pages

- Updated sdlc-workflow.html for static hosting
- Added sdlc-workflow.json with merged data
- Included deployment documentation
- Added .gitignore for clean repository
- Ready for GitHub Pages deployment"

echo "✅ Files committed successfully!"
echo ""
echo "🚀 Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Access your site at: https://yourusername.github.io/comwrapreply.github.io/"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
