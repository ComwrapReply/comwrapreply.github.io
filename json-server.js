#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

/**
 * Simple JSON server to handle updates to sdlc-workflow.json
 */

const PORT = 3001;
const JSON_FILE = 'sdlc-workflow.json';

function readJSONFile() {
    try {
        const data = fs.readFileSync(JSON_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${JSON_FILE}:`, error.message);
        return null;
    }
}

function writeJSONFile(data) {
    try {
        fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
        console.log(`✅ Successfully updated ${JSON_FILE}`);
        return true;
    } catch (error) {
        console.error(`Error writing ${JSON_FILE}:`, error.message);
        return false;
    }
}

function mergeData(existingData, newData) {
    if (!newData || !newData.phases) {
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

function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (parsedUrl.pathname === '/api/json' && method === 'GET') {
        // Get JSON data
        const data = readJSONFile();
        if (data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'JSON file not found' }));
        }
    } else if (parsedUrl.pathname === '/api/update' && method === 'POST') {
        // Update JSON data
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const newData = JSON.parse(body);
                const existingData = readJSONFile();
                
                if (!existingData) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Could not read existing JSON file' }));
                    return;
                }
                
                const mergedData = mergeData(existingData, newData);
                const success = writeJSONFile(mergedData);
                
                if (success) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: 'JSON file updated successfully',
                        totals: {
                            phases: mergedData.metadata.totalPhases,
                            categories: mergedData.metadata.totalCategories,
                            items: mergedData.metadata.totalItems
                        }
                    }));
                } else {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Could not write JSON file' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
}

function startServer() {
    const server = http.createServer(handleRequest);
    
    server.listen(PORT, () => {
        console.log(`🚀 JSON Server running at http://localhost:${PORT}`);
        console.log(`📁 Managing: ${JSON_FILE}`);
        console.log('');
        console.log('📋 API Endpoints:');
        console.log('   GET  /api/json   - Get current JSON data');
        console.log('   POST /api/update - Update JSON data');
        console.log('');
        console.log('🛑 Press Ctrl+C to stop the server');
    });
    
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`❌ Port ${PORT} is already in use`);
            console.log('💡 Try a different port or stop the existing server');
        } else {
            console.error('❌ Server error:', err.message);
        }
    });
}

// Start the server
if (require.main === module) {
    startServer();
}

module.exports = { startServer, mergeData, readJSONFile, writeJSONFile };
