#!/usr/bin/env node

const fs = require('fs');

/**
 * Script to update index.html with data from sdlc-workflow-new.json
 */

const HTML_FILE = 'index.html';
const JSON_FILE = 'sdlc-workflow-new.json';

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

function writeFile(filePath, content) {
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
    const jsonContent = readFile(JSON_FILE);
    if (!jsonContent) {
        console.error('❌ Could not read JSON file');
        return;
    }
    
    const jsonData = JSON.parse(jsonContent);
    console.log(`📊 Loaded JSON data: ${jsonData.metadata.totalPhases} phases, ${jsonData.metadata.totalCategories} categories, ${jsonData.metadata.totalItems} items`);
    
    // Read HTML content
    const htmlContent = readFile(HTML_FILE);
    if (!htmlContent) {
        console.error('❌ Could not read HTML file');
        return;
    }
    
    // Update the data summary section
    let updatedHTML = htmlContent.replace(
        /<div class="data-summary"[\s\S]*?<\/div>/,
        `<div class="data-summary" style="
            background: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #48bb78;
        ">
            <h3>📊 Data Summary</h3>
            <p><strong>Total Phases:</strong> ${jsonData.metadata.totalPhases}</p>
            <p><strong>Total Categories:</strong> ${jsonData.metadata.totalCategories}</p>
            <p><strong>Total Items:</strong> ${jsonData.metadata.totalItems}</p>
            <p><strong>Last Updated:</strong> ${new Date(jsonData.metadata.lastAutoSave).toLocaleString()}</p>
            <p><strong>Phases with Data:</strong> ${Object.keys(jsonData.phases).length}</p>
        </div>`
    );
    
    // Update each phase with data from JSON
    Object.keys(jsonData.phases).forEach(phaseName => {
        const phaseData = jsonData.phases[phaseName];
        console.log(`📋 Updating phase: ${phaseName}`);
        
        // Find the phase in HTML and update it
        const phaseRegex = new RegExp(`<h3 class="phase-title">${phaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\/h3>([\\s\\S]*?)<\/div>\\s*<\/div>`, 'g');
        
        updatedHTML = updatedHTML.replace(phaseRegex, (match, phaseContent) => {
            // Update ownership section
            let updatedPhaseContent = phaseContent.replace(
                /<div class="ownership-section">[\s\S]*?<\/div>/,
                `<div class="ownership-section">
                    <div class="ownership-title">👥 Ownership</div>
                    ${phaseData.ownership.map(owner => `<span class="ownership-item">${owner}</span>`).join('\n                    ')}
                </div>`
            );
            
            // Update categories
            Object.keys(phaseData.categories).forEach(categoryName => {
                const categoryData = phaseData.categories[categoryName];
                const categoryRegex = new RegExp(`<div class="category-name">${categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:<\/div>([\\s\\S]*?)(?=<div class="category-name">|<\/div>\\s*<\/div>)`, 'g');
                
                updatedPhaseContent = updatedPhaseContent.replace(categoryRegex, (match, categoryContent) => {
                    return `<div class="category-name">${categoryName}:</div>
                    ${categoryData.items.map(item => `<span class="item ${getItemClass(categoryName)}">${item}</span>`).join('\n                    ')}`;
                });
            });
            
            return `<h3 class="phase-title">${phaseName}</h3>${updatedPhaseContent}</div>
        </div>`;
        });
    });
    
    // Write updated HTML
    writeFile(HTML_FILE, updatedHTML);
    
    console.log('✅ HTML updated successfully with JSON data!');
}

function getItemClass(categoryName) {
    const name = categoryName.toLowerCase();
    if (name.includes('ai') || name.includes('automation')) {
        return 'ai-tool';
    } else if (name.includes('pain') || name.includes('pain point')) {
        return 'pain-point-item';
    } else if (name.includes('blocker')) {
        return 'blocker-item';
    } else if (name.includes('automate')) {
        return 'automation-item';
    } else if (name.includes('conductor') || name.includes('role') || name.includes('channel')) {
        return 'conductor-item';
    } else if (name.includes('deliverable')) {
        return 'deliverable-tag';
    } else {
        return 'tool-item';
    }
}

// Run the script
if (require.main === module) {
    updateHTMLWithJSONData();
}

module.exports = { updateHTMLWithJSONData };
