#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

/**
 * Simple HTTP server to serve static files and handle CORS
 * This solves the CORS issue when accessing local files from the browser
 */

const PORT = 5000;
const HOST = 'localhost';

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

function serveFile(filePath, res) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        const mimeType = getMimeType(filePath);
        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(data);
    });
}

function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });
        res.end();
        return;
    }

    // Handle API endpoints
    if (pathname === '/api/update' && req.method === 'POST') {
        handleJSONUpdate(req, res);
        return;
    }

    // Remove query parameters for file path
    pathname = pathname.split('?')[0];

    // Default to index.html if root path
    if (pathname === '/') {
        pathname = '/sdlc-workflow.html';
    }

    // Security: prevent directory traversal
    if (pathname.includes('..')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    // Remove leading slash and construct file path
    const filePath = path.join(__dirname, pathname.substring(1));

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        // Check if it's a directory
        fs.stat(filePath, (err, stats) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal server error');
                return;
            }

            if (stats.isDirectory()) {
                res.writeHead(403, { 'Content-Type': 'text/plain' });
                res.end('Directory listing not allowed');
                return;
            }

            serveFile(filePath, res);
        });
    });
}

function handleJSONUpdate(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            
            // Update the sdlc-workflow.json file
            const jsonPath = path.join(__dirname, 'sdlc-workflow.json');
            fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
            
            console.log('✅ JSON file updated via API');
            
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            });
            res.end(JSON.stringify({ 
                success: true, 
                message: 'JSON file updated successfully',
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.error('❌ Error updating JSON file:', error.message);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });
            res.end(JSON.stringify({ 
                success: false, 
                error: error.message 
            }));
        }
    });
}

function startServer() {
    const server = http.createServer(handleRequest);

    server.listen(PORT, HOST, () => {
        console.log('🚀 SDLC Workflow Server Started');
        console.log('================================');
        console.log(`📍 Server running at: http://${HOST}:${PORT}`);
        console.log(`📄 Main page: http://${HOST}:${PORT}/sdlc-workflow.html`);
        console.log(`🔧 Data fetcher: http://${HOST}:${PORT}/fetch-local-browser-data.html`);
        console.log(`📊 JSON data: http://${HOST}:${PORT}/sdlc-workflow.json`);
        console.log('');
        console.log('💡 Press Ctrl+C to stop the server');
        console.log('🔄 The server will automatically serve updated JSON files');
    });

    // Handle server errors
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use. Please try a different port.`);
            console.log('💡 You can change the PORT variable in server.js');
        } else {
            console.error('❌ Server error:', err.message);
        }
        process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down server...');
        server.close(() => {
            console.log('✅ Server stopped');
            process.exit(0);
        });
    });
}

// Start the server
if (require.main === module) {
    startServer();
}

module.exports = { startServer, handleRequest };
