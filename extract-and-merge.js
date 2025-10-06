#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Extract data from local HTML file and merge with sdlc-workflow.json
 * This script reads the local HTML file and extracts any embedded data
 */

const LOCAL_HTML_FILE = '/Users/Szymon/Documents/PROJEKTY/Development-Livecycle/sdlc_miro_diagram-v1.html';
const SDLC_WORKFLOW_FILE = 'sdlc-workflow.json';

function readJSONFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
    }
}

function writeJSONFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Successfully updated ${filePath}`);
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error.message);
    }
}

function extractDataFromHTML(htmlContent) {
    try {
        // Look for localStorage data in the HTML
        const localStorageMatch = htmlContent.match(/localStorage\.setItem\(['"]sdlc-auto-save['"],\s*['"]([^'"]+)['"]\)/);
        if (localStorageMatch) {
            const encodedData = localStorageMatch[1];
            const decodedData = decodeURIComponent(encodedData);
            return JSON.parse(decodedData);
        }
        
        // Look for embedded JSON data
        const jsonMatch = htmlContent.match(/const\s+data\s*=\s*({[\s\S]*?});/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
        
        // Look for script tags with data
        const scriptMatch = htmlContent.match(/<script[^>]*>[\s\S]*?const\s+workflowData\s*=\s*({[\s\S]*?});[\s\S]*?<\/script>/);
        if (scriptMatch) {
            return JSON.parse(scriptMatch[1]);
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting data from HTML:', error.message);
        return null;
    }
}

function mergeData(existingData, newData) {
    if (!newData || !newData.phases) {
        console.log('❌ No valid data found to merge');
        return existingData;
    }
    
    // Update metadata
    existingData.metadata.lastModified = new Date().toISOString();
    existingData.metadata.totalPhases = Object.keys(newData.phases).length;
    
    // Count total categories and items
    let totalCategories = 0;
    let totalItems = 0;
    
    Object.values(newData.phases).forEach(phase => {
        if (phase.categories) {
            totalCategories += Object.keys(phase.categories).length;
            Object.values(phase.categories).forEach(category => {
                if (category.items) {
                    totalItems += category.items.length;
                }
            });
        }
        if (phase.ownership) {
            totalItems += phase.ownership.length;
        }
    });
    
    existingData.metadata.totalCategories = totalCategories;
    existingData.metadata.totalItems = totalItems;
    
    // Merge phases data
    Object.keys(newData.phases).forEach(phaseName => {
        if (existingData.phases[phaseName]) {
            // Update existing phase
            existingData.phases[phaseName] = {
                ...existingData.phases[phaseName],
                ...newData.phases[phaseName]
            };
        } else {
            // Add new phase
            existingData.phases[phaseName] = newData.phases[phaseName];
        }
    });
    
    return existingData;
}

function main() {
    console.log('🔄 Extracting data from local HTML file...');
    
    // Check if local HTML file exists
    if (!fs.existsSync(LOCAL_HTML_FILE)) {
        console.error(`❌ Local HTML file not found: ${LOCAL_HTML_FILE}`);
        console.log('💡 Please make sure the file exists and the path is correct');
        return;
    }
    
    // Read local HTML file
    console.log('📖 Reading local HTML file...');
    const htmlContent = fs.readFileSync(LOCAL_HTML_FILE, 'utf8');
    
    // Extract data from HTML
    console.log('🔍 Extracting data from HTML...');
    const extractedData = extractDataFromHTML(htmlContent);
    
    if (!extractedData) {
        console.log('❌ No data found in HTML file');
        console.log('💡 The HTML file might not contain embedded data');
        console.log('💡 Try using the browser data fetcher instead');
        return;
    }
    
    console.log('📊 Extracted data summary:');
    console.log(`   - Phases: ${Object.keys(extractedData.phases).length}`);
    console.log(`   - Categories: ${extractedData.metadata?.totalCategories || 'N/A'}`);
    console.log(`   - Items: ${extractedData.metadata?.totalItems || 'N/A'}`);
    
    // Read existing sdlc-workflow.json
    const existingData = readJSONFile(SDLC_WORKFLOW_FILE);
    if (!existingData) {
        console.error(`❌ Could not read ${SDLC_WORKFLOW_FILE}`);
        return;
    }
    
    // Merge data
    console.log('🔄 Merging data...');
    const mergedData = mergeData(existingData, extractedData);
    
    // Write updated data
    writeJSONFile(SDLC_WORKFLOW_FILE, mergedData);
    
    console.log('✅ Data successfully extracted and merged!');
    console.log(`📈 Updated totals:`);
    console.log(`   - Phases: ${mergedData.metadata.totalPhases}`);
    console.log(`   - Categories: ${mergedData.metadata.totalCategories}`);
    console.log(`   - Items: ${mergedData.metadata.totalItems}`);
    console.log(`   - Last modified: ${mergedData.metadata.lastModified}`);
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { extractDataFromHTML, mergeData };
