#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');

/**
 * Extract data from local HTML file and update JSON via server
 */

const LOCAL_HTML_FILE = '/Users/Szymon/Documents/PROJEKTY/Development-Livecycle/sdlc_miro_diagram-v1.html';
const SERVER_URL = 'http://localhost:5000';

function readJSONFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return null;
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
        
        return null;
    } catch (error) {
        console.error('Error extracting data from HTML:', error.message);
        return null;
    }
}

function updateJSONViaServer(data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/update',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    if (result.success) {
                        resolve(result);
                    } else {
                        reject(new Error(result.error || 'Unknown error'));
                    }
                } catch (error) {
                    reject(new Error('Invalid response from server'));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        console.log('🔄 Extracting data from local HTML file...');
        
        // Check if local HTML file exists
        if (!fs.existsSync(LOCAL_HTML_FILE)) {
            console.error(`❌ Local HTML file not found: ${LOCAL_HTML_FILE}`);
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
            console.log('💡 Try adding some data to the HTML file first');
            return;
        }
        
        console.log('📊 Extracted data summary:');
        console.log(`   - Phases: ${Object.keys(extractedData.phases).length}`);
        console.log(`   - Categories: ${extractedData.metadata?.totalCategories || 'N/A'}`);
        console.log(`   - Items: ${extractedData.metadata?.totalItems || 'N/A'}`);
        
        // Update JSON via server
        console.log('🔄 Updating JSON via server...');
        const result = await updateJSONViaServer(extractedData);
        
        console.log('✅ Data successfully extracted and updated!');
        console.log(`📈 Updated totals:`);
        console.log(`   - Phases: ${result.totals.phases}`);
        console.log(`   - Categories: ${result.totals.categories}`);
        console.log(`   - Items: ${result.totals.items}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('💡 JSON server is not running. Please start it with:');
            console.log('   node json-server.js');
        }
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { extractDataFromHTML, updateJSONViaServer };
