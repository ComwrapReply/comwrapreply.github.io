#!/usr/bin/env node

const http = require('http');
const fs = require('fs');

/**
 * Comprehensive test script for the SDLC Workflow System
 * Tests all components: server, API, JSON file, and data flow
 */

const SERVER_URL = 'http://localhost:3000';
const JSON_FILE = 'sdlc-workflow.json';

// Test data
const testData = {
    metadata: {
        version: "1.0.0",
        lastAutoSave: new Date().toISOString(),
        totalPhases: 2,
        totalCategories: 4,
        totalItems: 8
    },
    phases: {
        "Test Phase 1": {
            phaseNumber: 1,
            categories: {
                "Test Tools": {
                    items: ["Test Tool 1", "Test Tool 2"],
                    itemCount: 2
                },
                "Test Roles": {
                    items: ["Tester", "Developer"],
                    itemCount: 2
                }
            },
            ownership: ["Test Manager"]
        },
        "Test Phase 2": {
            phaseNumber: 2,
            categories: {
                "Test Deliverables": {
                    items: ["Test Report", "Test Plan"],
                    itemCount: 2
                },
                "Test Automation": {
                    items: ["Jest", "Cypress"],
                    itemCount: 2
                }
            },
            ownership: ["QA Engineer"]
        }
    }
};

function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
}

function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve({ status: res.statusCode, data: result });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        
        req.on('error', reject);
        
        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        
        req.end();
    });
}

async function testServerHealth() {
    log('Testing server health...');
    try {
        const response = await makeRequest(`${SERVER_URL}/sdlc-workflow.json`);
        if (response.status === 200) {
            log('Server is running and responding', 'success');
            return true;
        } else {
            log(`Server returned status ${response.status}`, 'error');
            return false;
        }
    } catch (error) {
        log(`Server is not running: ${error.message}`, 'error');
        return false;
    }
}

async function testJSONFileAccess() {
    log('Testing JSON file access...');
    try {
        const response = await makeRequest(`${SERVER_URL}/sdlc-workflow.json`);
        if (response.status === 200 && response.data.metadata) {
            log('JSON file is accessible and has proper structure', 'success');
            log(`Current data: ${response.data.metadata.totalPhases} phases, ${response.data.metadata.totalItems} items`);
            return true;
        } else {
            log('JSON file is not accessible or malformed', 'error');
            return false;
        }
    } catch (error) {
        log(`Error accessing JSON file: ${error.message}`, 'error');
        return false;
    }
}

async function testAPIUpdate() {
    log('Testing API update endpoint...');
    try {
        const response = await makeRequest(`${SERVER_URL}/api/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: testData
        });
        
        if (response.status === 200 && response.data.success) {
            log('API update endpoint is working', 'success');
            return true;
        } else {
            log(`API update failed: ${response.data.error || 'Unknown error'}`, 'error');
            return false;
        }
    } catch (error) {
        log(`Error testing API update: ${error.message}`, 'error');
        return false;
    }
}

async function testDataPersistence() {
    log('Testing data persistence...');
    try {
        // Wait a moment for file to be written
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await makeRequest(`${SERVER_URL}/sdlc-workflow.json`);
        if (response.status === 200) {
            const data = response.data;
            if (data.phases && data.phases["Test Phase 1"]) {
                log('Test data was successfully saved and retrieved', 'success');
                log(`Saved phases: ${Object.keys(data.phases).length}`);
                return true;
            } else {
                log('Test data was not properly saved', 'error');
                return false;
            }
        } else {
            log('Could not retrieve saved data', 'error');
            return false;
        }
    } catch (error) {
        log(`Error testing data persistence: ${error.message}`, 'error');
        return false;
    }
}

async function testFileSystem() {
    log('Testing file system...');
    try {
        if (fs.existsSync(JSON_FILE)) {
            const stats = fs.statSync(JSON_FILE);
            const fileSize = stats.size;
            log(`JSON file exists and is ${fileSize} bytes`, 'success');
            
            if (fileSize > 100) {
                log('File size looks reasonable', 'success');
                return true;
            } else {
                log('File size seems too small', 'warning');
                return false;
            }
        } else {
            log('JSON file does not exist', 'error');
            return false;
        }
    } catch (error) {
        log(`Error checking file system: ${error.message}`, 'error');
        return false;
    }
}

async function runAllTests() {
    log('🧪 Starting SDLC Workflow System Tests');
    log('=====================================');
    
    const tests = [
        { name: 'Server Health', fn: testServerHealth },
        { name: 'JSON File Access', fn: testJSONFileAccess },
        { name: 'API Update', fn: testAPIUpdate },
        { name: 'Data Persistence', fn: testDataPersistence },
        { name: 'File System', fn: testFileSystem }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    for (const test of tests) {
        log(`\n--- Testing ${test.name} ---`);
        try {
            const result = await test.fn();
            if (result) {
                passed++;
            }
        } catch (error) {
            log(`Test ${test.name} failed with error: ${error.message}`, 'error');
        }
    }
    
    log('\n📊 Test Results');
    log('===============');
    log(`Passed: ${passed}/${total} tests`);
    
    if (passed === total) {
        log('🎉 All tests passed! System is working correctly.', 'success');
    } else {
        log(`⚠️  ${total - passed} tests failed. Please check the issues above.`, 'warning');
    }
    
    return passed === total;
}

// Run tests if this script is executed directly
if (require.main === module) {
    runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { runAllTests, testServerHealth, testJSONFileAccess, testAPIUpdate, testDataPersistence, testFileSystem };
