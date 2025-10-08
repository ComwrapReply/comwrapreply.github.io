#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * Simple HTTP server to serve the local HTML file
 * This allows us to access localStorage data from the browser
 */

const PORT = 5000;
const LOCAL_HTML_FILE = '/Users/Szymon/Documents/PROJEKTY/Development-Livecycle/sdlc_miro_diagram-v1.html';

function serveFile(req, res) {
    const url = req.url === '/' ? '/index.html' : req.url;
    
    if (url === '/index.html') {
        // Serve the local HTML file
        if (fs.existsSync(LOCAL_HTML_FILE)) {
            const htmlContent = fs.readFileSync(LOCAL_HTML_FILE, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Local HTML file not found');
        }
    } else if (url === '/extract-data') {
        // Endpoint to extract localStorage data
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        
        // This would be called by JavaScript in the browser
        res.end(JSON.stringify({ message: 'Use the browser console to extract data' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
}

function startServer() {
    const server = http.createServer(serveFile);
    
    server.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📁 Serving local HTML file: ${LOCAL_HTML_FILE}`);
        console.log('');
        console.log('📋 Instructions:');
        console.log('1. Open http://localhost:5000 in your browser');
        console.log('2. Add or modify data in the workflow');
        console.log('3. Open browser console and run:');
        console.log('   localStorage.getItem("sdlc-auto-save")');
        console.log('4. Copy the JSON data and save it to sdlc-workflow-date.json');
        console.log('5. Run: node auto-sync.js');
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

module.exports = { startServer };
