#!/usr/bin/env node

const fs = require('fs');

/**
 * Script to update sdlc-workflow.html with data from sdlc-workflow.json
 * This script reads the JSON data and updates the HTML file to display the actual data
 */

const JSON_FILE = 'sdlc-workflow.json';
const HTML_FILE = 'sdlc-workflow.html';

function readJSONFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

function readHTMLFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

function writeHTMLFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content);
        console.log(`✅ Successfully updated ${filePath}`);
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error.message);
    }
}

function updateHTMLWithJSONData() {
    console.log('🔄 Updating HTML with JSON data...');
    
    // Read JSON data
    const jsonData = readJSONFile(JSON_FILE);
    if (!jsonData) {
        console.error('❌ Could not read JSON file');
        return;
    }
    
    // Read HTML file
    let htmlContent = readHTMLFile(HTML_FILE);
    if (!htmlContent) {
        console.error('❌ Could not read HTML file');
        return;
    }
    
    console.log('📊 JSON data summary:');
    console.log(`   - Phases: ${Object.keys(jsonData.phases).length}`);
    console.log(`   - Total items: ${jsonData.metadata?.totalItems || 0}`);
    console.log(`   - Last modified: ${jsonData.metadata?.lastAutoSave || 'Unknown'}`);
    
    // Find phases with actual data (not empty categories)
    const phasesWithData = Object.keys(jsonData.phases).filter(phaseKey => {
        const phase = jsonData.phases[phaseKey];
        return phase.categories && Object.values(phase.categories).some(cat => 
            cat.items && cat.items.length > 0
        );
    });
    
    console.log(`📋 Phases with data: ${phasesWithData.length}`);
    phasesWithData.forEach(phaseKey => {
        const phase = jsonData.phases[phaseKey];
        console.log(`   - ${phaseKey}: ${phase.categories ? Object.keys(phase.categories).length : 0} categories`);
    });
    
    // Update the HTML content to show the data
    // This is a simplified approach - in a real scenario, you'd want to properly parse and update the HTML
    
    // Add a data summary section to the HTML
    const dataSummary = `
        <div class="data-summary" style="
            background: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #48bb78;
        ">
            <h3>📊 Data Summary</h3>
            <p><strong>Total Phases:</strong> ${Object.keys(jsonData.phases).length}</p>
            <p><strong>Total Items:</strong> ${jsonData.metadata?.totalItems || 0}</p>
            <p><strong>Last Updated:</strong> ${new Date(jsonData.metadata?.lastAutoSave || Date.now()).toLocaleString()}</p>
            <p><strong>Phases with Data:</strong> ${phasesWithData.length}</p>
        </div>
    `;
    
    // Insert the data summary after the header
    const headerEndIndex = htmlContent.indexOf('</div>', htmlContent.indexOf('<div class="header">'));
    if (headerEndIndex !== -1) {
        htmlContent = htmlContent.slice(0, headerEndIndex + 6) + dataSummary + htmlContent.slice(headerEndIndex + 6);
    }
    
    // Write the updated HTML
    writeHTMLFile(HTML_FILE, htmlContent);
    
    console.log('✅ HTML file updated with JSON data summary');
    console.log('💡 To see the full data, open the HTML file in a browser and use the interactive features');
}

// Run the script
if (require.main === module) {
    updateHTMLWithJSONData();
}

module.exports = { updateHTMLWithJSONData };
