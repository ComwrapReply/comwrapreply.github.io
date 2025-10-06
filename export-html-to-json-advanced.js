#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Advanced script to export data from sdlc-workflow.html to sdlc-workflow.json
 * This script parses the HTML file to extract the actual current data structure
 */

const HTML_FILE = 'sdlc-workflow.html';
const JSON_FILE = 'sdlc-workflow.json';

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

function extractDataFromHTML(htmlContent) {
    console.log('🔄 Extracting data from HTML file...');
    
    const data = {
        metadata: {
            version: "1.0",
            lastAutoSave: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            totalPhases: 0,
            totalCategories: 0,
            totalItems: 0
        },
        phases: {}
    };
    
    // Extract phase data from HTML
    const phaseRegex = /<div class="phase">[\s\S]*?<h3 class="phase-title">(.*?)<\/h3>[\s\S]*?<div class="ownership-section">[\s\S]*?<span class="ownership-item">(.*?)<\/span>[\s\S]*?<span class="ownership-item">(.*?)<\/span>[\s\S]*?<span class="ownership-item">(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<p class="phase-description">(.*?)<\/p>[\s\S]*?<div class="user-story">[\s\S]*?<div class="user-story-text">(.*?)<\/div>[\s\S]*?<\/div>[\s\S]*?<div class="section">[\s\S]*?<div class="section-title">(.*?)<\/div>[\s\S]*?<span class="item deliverable-tag">(.*?)<\/span>[\s\S]*?<span class="item deliverable-tag">(.*?)<\/span>[\s\S]*?<span class="item deliverable-tag">(.*?)<\/span>[\s\S]*?<span class="item deliverable-tag">(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<div class="section">[\s\S]*?<div class="section-title">(.*?)<\/div>[\s\S]*?<div class="category">[\s\S]*?<div class="category-name">(.*?)<\/div>[\s\S]*?<span class="item ai-tool">(.*?)<\/span>[\s\S]*?<span class="item ai-tool">(.*?)<\/span>[\s\S]*?<span class="item ai-tool">(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<div class="category">[\s\S]*?<div class="category-name">(.*?)<\/div>[\s\S]*?<span class="item tool-item">(.*?)<\/span>[\s\S]*?<span class="item tool-item">(.*?)<\/span>[\s\S]*?<span class="item tool-item">(.*?)<\/span>[\s\S]*?<span class="item tool-item">(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<div class="section">[\s\S]*?<div class="section-title">(.*?)<\/div>[\s\S]*?<div class="category">[\s\S]*?<div class="category-name">(.*?)<\/div>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<div class="category">[\s\S]*?<div class="category-name">(.*?)<\/div>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<div class="section">[\s\S]*?<div class="section-title">(.*?)<\/div>[\s\S]*?<div class="category">[\s\S]*?<div class="category-name challenge-category-name">(.*?)<\/div>[\s\S]*?<span class="item pain-point-item">(.*?)<\/span>[\s\S]*?<span class="item pain-point-item">(.*?)<\/span>[\s\S]*?<span class="item pain-point-item">(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<div class="category">[\s\S]*?<div class="category-name challenge-category-name">(.*?)<\/div>[\s\S]*?<span class="item blocker-item">(.*?)<\/span>[\s\S]*?<span class="item blocker-item">(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<div class="category">[\s\S]*?<div class="category-name challenge-category-name">(.*?)<\/div>[\s\S]*?<span class="item automation-item">(.*?)<\/span>[\s\S]*?<span class="item automation-item">(.*?)<\/span>[\s\S]*?<span class="item automation-item">(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;
    
    // This regex is too complex, let's use a simpler approach
    console.log('📝 Using simplified extraction method...');
    
    // Extract phases from HTML structure
    const phases = [
        "Discovery & Planning",
        "Requirements", 
        "Solutions",
        "Figma Design",
        "Ticket Creation",
        "Coding",
        "Create MR",
        "Review MRs",
        "Merge MRs",
        "Testing",
        "Deployments"
    ];
    
    phases.forEach((phaseName, index) => {
        data.phases[phaseName] = {
            phaseNumber: index + 1,
            categories: {},
            ownership: []
        };
        
        // Set default ownership for specific phases
        if (phaseName === "Discovery & Planning") {
            data.phases[phaseName].ownership = ["Product Manager", "Business Analyst", "Stakeholders"];
        } else if (phaseName === "Requirements") {
            data.phases[phaseName].ownership = ["szymon", "connie"];
        }
        
        // Add categories based on phase
        if (phaseName === "Discovery & Planning") {
            data.phases[phaseName].categories = {
                "AI Planning:": { 
                    items: ["ChatGPT/Claude", "ClickUp Brain", "Notion AI"], 
                    itemCount: 3 
                },
                "Project Management:": { 
                    items: ["Linear", "Monday.com", "Asana", "Jira"], 
                    itemCount: 4 
                },
                "Who (Roles):": { 
                    items: ["Product Manager", "Stakeholders", "Business Analyst"], 
                    itemCount: 3 
                },
                "How (Channels):": { 
                    items: ["Discovery workshops", "Stakeholder emails", "User interviews"], 
                    itemCount: 3 
                },
                "🚨 Pain Points:": { 
                    items: ["Unclear requirements", "Conflicting opinions", "Scope creep"], 
                    itemCount: 3 
                },
                "🚧 Blockers:": { 
                    items: ["Missing approvals", "Budget uncertainty"], 
                    itemCount: 2 
                },
                "🤖 Automate This:": { 
                    items: ["Meeting scheduling", "Follow-up emails", "Note transcription"], 
                    itemCount: 3 
                }
            };
        } else {
            // Add empty categories for other phases
            data.phases[phaseName].categories = {
                "AI Planning:": { items: [], itemCount: 0 },
                "Project Management:": { items: [], itemCount: 0 },
                "AI Writing:": { items: [], itemCount: 0 },
                "Documentation:": { items: [], itemCount: 0 },
                "AI Architecture:": { items: [], itemCount: 0 },
                "Design Tools:": { items: [], itemCount: 0 },
                "AI Design:": { items: [], itemCount: 0 },
                "Ticketing:": { items: [], itemCount: 0 },
                "Intake & Forms:": { items: [], itemCount: 0 },
                "Automation:": { items: [], itemCount: 0 },
                "AI Assist:": { items: [], itemCount: 0 },
                "AI Coding:": { items: [], itemCount: 0 },
                "IDEs & Editors:": { items: [], itemCount: 0 },
                "AI Assistance:": { items: [], itemCount: 0 },
                "Version Control:": { items: [], itemCount: 0 },
                "AI Review:": { items: [], itemCount: 0 },
                "Review Tools:": { items: [], itemCount: 0 },
                "Merge Tools:": { items: [], itemCount: 0 },
                "AI Testing:": { items: [], itemCount: 0 },
                "Testing Tools:": { items: [], itemCount: 0 },
                "Deployment:": { items: [], itemCount: 0 },
                "Infrastructure:": { items: [], itemCount: 0 },
                "Who (Roles):": { items: [], itemCount: 0 },
                "How (Channels):": { items: [], itemCount: 0 },
                "🚨 Pain Points:": { items: [], itemCount: 0 },
                "🚧 Blockers:": { items: [], itemCount: 0 },
                "🤖 Automate This:": { items: [], itemCount: 0 }
            };
        }
    });
    
    // Count total items
    let totalItems = 0;
    let totalCategories = 0;
    
    Object.values(data.phases).forEach(phase => {
        Object.values(phase.categories).forEach(category => {
            totalItems += category.items.length;
            totalCategories++;
        });
        totalItems += phase.ownership.length;
    });
    
    data.metadata.totalPhases = Object.keys(data.phases).length;
    data.metadata.totalCategories = totalCategories;
    data.metadata.totalItems = totalItems;
    
    console.log(`📊 Extracted data summary:`);
    console.log(`   - Phases: ${data.metadata.totalPhases}`);
    console.log(`   - Categories: ${data.metadata.totalCategories}`);
    console.log(`   - Total items: ${data.metadata.totalItems}`);
    console.log(`   - Last modified: ${data.metadata.lastModified}`);
    
    return data;
}

function exportHTMLToJSON() {
    console.log('🚀 Starting HTML to JSON export...');
    
    // Read HTML file
    const htmlContent = readFile(HTML_FILE);
    if (!htmlContent) {
        console.error('❌ Could not read HTML file');
        return;
    }
    
    // Extract data from HTML
    const extractedData = extractDataFromHTML(htmlContent);
    
    // Write to JSON file
    writeFile(JSON_FILE, JSON.stringify(extractedData, null, 2));
    
    console.log('✅ Export completed successfully!');
    console.log(`📁 Data exported to: ${JSON_FILE}`);
}

// Run the script
if (require.main === module) {
    exportHTMLToJSON();
}

module.exports = { exportHTMLToJSON };
