#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Comprehensive script to extract ALL data from sdlc-workflow.html to sdlc-workflow.json
 * This script parses the HTML file to extract all actual content, not just structure
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

function extractAllDataFromHTML(htmlContent) {
    console.log('🔄 Extracting ALL data from HTML file...');
    
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
    
    // Extract all phases from HTML
    const phaseRegex = /<div class="phase">[\s\S]*?<h3 class="phase-title">(.*?)<\/h3>[\s\S]*?<\/div>/g;
    let phaseMatch;
    let phaseIndex = 0;
    
    while ((phaseMatch = phaseRegex.exec(htmlContent)) !== null) {
        const phaseTitle = phaseMatch[1].trim();
        phaseIndex++;
        
        console.log(`📋 Processing phase: ${phaseTitle}`);
        
        // Extract phase content
        const phaseContent = phaseMatch[0];
        
        // Extract ownership
        const ownershipRegex = /<span class="ownership-item">(.*?)<\/span>/g;
        const ownership = [];
        let ownershipMatch;
        while ((ownershipMatch = ownershipRegex.exec(phaseContent)) !== null) {
            const item = ownershipMatch[1].replace(/×/g, '').trim();
            if (item) ownership.push(item);
        }
        
        // Extract description
        const descriptionMatch = phaseContent.match(/<p class="phase-description">(.*?)<\/p>/);
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';
        
        // Extract user story
        const userStoryMatch = phaseContent.match(/<div class="user-story-text">(.*?)<\/div>/);
        const userStory = userStoryMatch ? userStoryMatch[1].trim() : '';
        
        // Extract all sections and categories
        const categories = {};
        
        // Extract deliverables
        const deliverablesMatch = phaseContent.match(/<div class="section-title">📋 Key Deliverables<\/div>[\s\S]*?<span class="item deliverable-tag">(.*?)<\/span>[\s\S]*?<span class="item deliverable-tag">(.*?)<\/span>[\s\S]*?<span class="item deliverable-tag">(.*?)<\/span>[\s\S]*?<span class="item deliverable-tag">(.*?)<\/span>/);
        if (deliverablesMatch) {
            const deliverables = [];
            for (let i = 1; i < deliverablesMatch.length; i++) {
                if (deliverablesMatch[i]) {
                    deliverables.push(deliverablesMatch[i].replace(/×/g, '').trim());
                }
            }
            categories["Key Deliverables"] = {
                items: deliverables,
                itemCount: deliverables.length
            };
        }
        
        // Extract AI tools
        const aiToolsMatch = phaseContent.match(/<div class="category-name">AI Planning:<\/div>[\s\S]*?<span class="item ai-tool">(.*?)<\/span>[\s\S]*?<span class="item ai-tool">(.*?)<\/span>[\s\S]*?<span class="item ai-tool">(.*?)<\/span>/);
        if (aiToolsMatch) {
            const aiTools = [];
            for (let i = 1; i < aiToolsMatch.length; i++) {
                if (aiToolsMatch[i]) {
                    aiTools.push(aiToolsMatch[i].replace(/×/g, '').trim());
                }
            }
            categories["AI Planning"] = {
                items: aiTools,
                itemCount: aiTools.length
            };
        }
        
        // Extract project management tools
        const pmToolsMatch = phaseContent.match(/<div class="category-name">Project Management:<\/div>[\s\S]*?<span class="item tool-item">(.*?)<\/span>[\s\S]*?<span class="item tool-item">(.*?)<\/span>[\s\S]*?<span class="item tool-item">(.*?)<\/span>[\s\S]*?<span class="item tool-item">(.*?)<\/span>/);
        if (pmToolsMatch) {
            const pmTools = [];
            for (let i = 1; i < pmToolsMatch.length; i++) {
                if (pmToolsMatch[i]) {
                    pmTools.push(pmToolsMatch[i].replace(/×/g, '').trim());
                }
            }
            categories["Project Management"] = {
                items: pmTools,
                itemCount: pmTools.length
            };
        }
        
        // Extract conductors (Who)
        const whoMatch = phaseContent.match(/<div class="category-name">Who \(Roles\):<\/div>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>/);
        if (whoMatch) {
            const who = [];
            for (let i = 1; i < whoMatch.length; i++) {
                if (whoMatch[i]) {
                    who.push(whoMatch[i].replace(/×/g, '').trim());
                }
            }
            categories["Who (Roles)"] = {
                items: who,
                itemCount: who.length
            };
        }
        
        // Extract conductors (How)
        const howMatch = phaseContent.match(/<div class="category-name">How \(Channels\):<\/div>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>[\s\S]*?<span class="item conductor-item">(.*?)<\/span>/);
        if (howMatch) {
            const how = [];
            for (let i = 1; i < howMatch.length; i++) {
                if (howMatch[i]) {
                    how.push(howMatch[i].replace(/×/g, '').trim());
                }
            }
            categories["How (Channels)"] = {
                items: how,
                itemCount: how.length
            };
        }
        
        // Extract pain points
        const painPointsMatch = phaseContent.match(/<div class="category-name challenge-category-name">🚨 Pain Points:<\/div>[\s\S]*?<span class="item pain-point-item">(.*?)<\/span>[\s\S]*?<span class="item pain-point-item">(.*?)<\/span>[\s\S]*?<span class="item pain-point-item">(.*?)<\/span>/);
        if (painPointsMatch) {
            const painPoints = [];
            for (let i = 1; i < painPointsMatch.length; i++) {
                if (painPointsMatch[i]) {
                    painPoints.push(painPointsMatch[i].replace(/×/g, '').trim());
                }
            }
            categories["🚨 Pain Points"] = {
                items: painPoints,
                itemCount: painPoints.length
            };
        }
        
        // Extract blockers
        const blockersMatch = phaseContent.match(/<div class="category-name challenge-category-name">🚧 Blockers:<\/div>[\s\S]*?<span class="item blocker-item">(.*?)<\/span>[\s\S]*?<span class="item blocker-item">(.*?)<\/span>/);
        if (blockersMatch) {
            const blockers = [];
            for (let i = 1; i < blockersMatch.length; i++) {
                if (blockersMatch[i]) {
                    blockers.push(blockersMatch[i].replace(/×/g, '').trim());
                }
            }
            categories["🚧 Blockers"] = {
                items: blockers,
                itemCount: blockers.length
            };
        }
        
        // Extract automation items
        const automationMatch = phaseContent.match(/<div class="category-name challenge-category-name">🤖 Automate This:<\/div>[\s\S]*?<span class="item automation-item">(.*?)<\/span>[\s\S]*?<span class="item automation-item">(.*?)<\/span>[\s\S]*?<span class="item automation-item">(.*?)<\/span>/);
        if (automationMatch) {
            const automation = [];
            for (let i = 1; i < automationMatch.length; i++) {
                if (automationMatch[i]) {
                    automation.push(automationMatch[i].replace(/×/g, '').trim());
                }
            }
            categories["🤖 Automate This"] = {
                items: automation,
                itemCount: automation.length
            };
        }
        
        // Add phase to data
        data.phases[phaseTitle] = {
            phaseNumber: phaseIndex,
            description: description,
            userStory: userStory,
            categories: categories,
            ownership: ownership
        };
    }
    
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

function extractAllDataFromHTML() {
    console.log('🚀 Starting comprehensive HTML to JSON export...');
    
    // Read HTML file
    const htmlContent = readFile(HTML_FILE);
    if (!htmlContent) {
        console.error('❌ Could not read HTML file');
        return;
    }
    
    // Extract all data from HTML
    const extractedData = extractAllDataFromHTML(htmlContent);
    
    // Write to JSON file
    writeFile(JSON_FILE, JSON.stringify(extractedData, null, 2));
    
    console.log('✅ Export completed successfully!');
    console.log(`📁 All data exported to: ${JSON_FILE}`);
}

// Run the script
if (require.main === module) {
    extractAllDataFromHTML();
}

module.exports = { extractAllDataFromHTML };
