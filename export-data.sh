#!/bin/bash

# Simple script to export data from sdlc-workflow.html to sdlc-workflow.json

echo "🚀 Exporting data from HTML to JSON..."

# Run the export script
node export-html-to-json-advanced.js

# Check if export was successful
if [ $? -eq 0 ]; then
    echo "✅ Export completed successfully!"
    echo "📁 Data exported to: sdlc-workflow.json"
    
    # Show summary
    echo ""
    echo "📊 Data summary:"
    node -e "
    const data = JSON.parse(require('fs').readFileSync('sdlc-workflow.json', 'utf8'));
    console.log('   - Phases:', data.metadata.totalPhases);
    console.log('   - Categories:', data.metadata.totalCategories);
    console.log('   - Total items:', data.metadata.totalItems);
    console.log('   - Last modified:', data.metadata.lastModified);
    "
else
    echo "❌ Export failed!"
    exit 1
fi
