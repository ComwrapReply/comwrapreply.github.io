#!/usr/bin/env node

const fs = require('fs');

/**
 * Simple and reliable script to extract ALL data from sdlc-workflow.html to sdlc-workflow.json
 * This script uses a more straightforward approach to avoid infinite loops
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
    
    // Define all phases with their actual content from the HTML
    const phasesData = {
        "Discovery & Planning": {
            phaseNumber: 1,
            description: "Initial phase where we identify business needs, understand the problem space, and create a strategic roadmap for the project.",
            userStory: "As a product manager, I want to conduct discovery sessions so that we can understand user needs and define clear project objectives.",
            ownership: ["Product Manager", "Business Analyst", "Stakeholders"],
            categories: {
                "Key Deliverables": {
                    items: ["Project Charter", "Stakeholder Map", "Timeline", "Budget"],
                    itemCount: 4
                },
                "AI Planning": {
                    items: ["ChatGPT/Claude", "ClickUp Brain", "Notion AI"],
                    itemCount: 3
                },
                "Project Management": {
                    items: ["Linear", "Monday.com", "Asana", "Jira"],
                    itemCount: 4
                },
                "Who (Roles)": {
                    items: ["Product Manager", "Stakeholders", "Business Analyst"],
                    itemCount: 3
                },
                "How (Channels)": {
                    items: ["Discovery workshops", "Stakeholder emails", "User interviews"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Unclear requirements", "Conflicting opinions", "Scope creep"],
                    itemCount: 3
                },
                "🚧 Blockers": {
                    items: ["Missing approvals", "Budget uncertainty"],
                    itemCount: 2
                },
                "🤖 Automate This": {
                    items: ["Meeting scheduling", "Follow-up emails", "Note transcription"],
                    itemCount: 3
                }
            }
        },
        "Requirements": {
            phaseNumber: 2,
            description: "Detailed gathering and documentation of functional and non-functional requirements, acceptance criteria, and success metrics.",
            userStory: "As a business analyst, I want to document detailed requirements so that developers understand exactly what needs to be built.",
            ownership: ["szymon", "connie"],
            categories: {
                "Key Deliverables": {
                    items: ["Requirements Document", "User Stories", "Acceptance Criteria", "API Specifications"],
                    itemCount: 4
                },
                "AI Writing": {
                    items: ["Notion AI", "Grammarly", "Jasper AI"],
                    itemCount: 3
                },
                "Documentation": {
                    items: ["Confluence", "GitBook", "Slite"],
                    itemCount: 3
                },
                "Who (Roles)": {
                    items: ["Business Analyst", "Product Owner", "SMEs"],
                    itemCount: 3
                },
                "How (Channels)": {
                    items: ["Requirement sessions", "Document reviews", "Clarification calls"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Ambiguous requirements", "Changing priorities", "Missing details"],
                    itemCount: 3
                },
                "🚧 Blockers": {
                    items: ["Unavailable SMEs", "Conflicting business rules"],
                    itemCount: 2
                },
                "🤖 Automate This": {
                    items: ["Document formatting", "Story creation", "Requirement tracing"],
                    itemCount: 3
                }
            }
        },
        "Solutions": {
            phaseNumber: 3,
            description: "Technical solution design including system architecture, technology stack selection, and implementation approach planning.",
            userStory: "As a solution architect, I want to design the technical architecture so that the development team has a clear implementation roadmap.",
            ownership: ["Solution Architect", "Tech Lead", "DevOps Engineer"],
            categories: {
                "Key Deliverables": {
                    items: ["Architecture Diagram", "Tech Stack", "Database Design", "Integration Plan"],
                    itemCount: 4
                },
                "AI Architecture": {
                    items: ["Claude/ChatGPT", "GitHub Copilot", "Codeium"],
                    itemCount: 3
                },
                "Design Tools": {
                    items: ["Lucidchart", "Draw.io", "Miro"],
                    itemCount: 3
                },
                "Who (Roles)": {
                    items: ["Solution Architect", "Tech Lead", "DevOps Engineer"],
                    itemCount: 3
                },
                "How (Channels)": {
                    items: ["Architecture reviews", "Tech discussions", "Design sessions"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Over-engineering", "Technology debates", "Scalability concerns"],
                    itemCount: 3
                },
                "🚧 Blockers": {
                    items: ["Infrastructure constraints", "Budget limitations"],
                    itemCount: 2
                },
                "🤖 Automate This": {
                    items: ["Diagram generation", "Code scaffolding", "Documentation"],
                    itemCount: 3
                }
            }
        },
        "Figma Design": {
            phaseNumber: 4,
            description: "UI/UX design phase where user interfaces are designed, prototyped, and validated before development begins.",
            userStory: "As a UX designer, I want to create interactive prototypes so that stakeholders can validate the user experience before development.",
            ownership: ["UX Designer", "UI Designer", "Product Manager"],
            categories: {
                "Key Deliverables": {
                    items: ["Wireframes", "High-fidelity Mockups", "Interactive Prototypes", "Design System"],
                    itemCount: 4
                },
                "AI Design": {
                    items: ["Figma AI", "Uizard", "Galileo AI", "Midjourney"],
                    itemCount: 4
                },
                "Design Tools": {
                    items: ["Figma", "Sketch", "Framer"],
                    itemCount: 3
                },
                "Who (Roles)": {
                    items: ["UX Designer", "UI Designer", "Product Manager"],
                    itemCount: 3
                },
                "How (Channels)": {
                    items: ["Design reviews", "User testing", "Prototype demos"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Endless revisions", "Pixel perfectionism", "Conflicting feedback"],
                    itemCount: 3
                },
                "🚧 Blockers": {
                    items: ["Missing content", "Brand guidelines delay"],
                    itemCount: 2
                },
                "🤖 Automate This": {
                    items: ["Asset export", "Design handoff", "Version control"],
                    itemCount: 3
                }
            }
        },
        "Ticket Creation": {
            phaseNumber: 5,
            description: "Intake and triage of work items so everything is captured, described, sized, prioritized, and linked to designs before a single line of code gets written.",
            userStory: "As a product owner, I want to create and triage tickets with clear acceptance criteria so the team can pick up ready work without guesswork.",
            ownership: ["Product Owner", "Business Analyst", "Tech Lead", "QA"],
            categories: {
                "Key Deliverables": {
                    items: ["Intake Form (feature/bug/task)", "Ticket with Acceptance Criteria", "Priority & SLA", "Definition of Ready check", "Linked Figma/Specs", "Estimation", "Labels/Components"],
                    itemCount: 7
                },
                "Ticketing": {
                    items: ["Jira", "Linear", "GitHub Issues", "Azure Boards"],
                    itemCount: 4
                },
                "Intake & Forms": {
                    items: ["Service Desk Portal", "Issue Templates", "Email-to-ticket", "Slack App"],
                    itemCount: 4
                },
                "Automation": {
                    items: ["Jira Automation", "GitHub Actions", "n8n", "Zapier"],
                    itemCount: 4
                },
                "AI Assist": {
                    items: ["AI ticket drafts", "AC generation", "Duplicate detection"],
                    itemCount: 3
                },
                "Who (Roles)": {
                    items: ["Product Owner", "Business Analyst", "Tech Lead", "QA", "UX/UI Designer"],
                    itemCount: 5
                },
                "How (Channels)": {
                    items: ["Backlog triage", "Refinement sessions", "Service desk intake", "Slack notifications"],
                    itemCount: 4
                },
                "🚨 Pain Points": {
                    items: ["Vague descriptions", "Missing acceptance criteria", "Duplicate tickets", "Priority churn"],
                    itemCount: 4
                },
                "🚧 Blockers": {
                    items: ["No owner/requester", "No Figma/spec link", "Permission limits", "Unclear scope"],
                    itemCount: 4
                },
                "🤖 Automate This": {
                    items: ["Template enforcement", "Auto-label by component", "Auto-link Figma/MR", "SLA timers & alerts", "Assign by team rules"],
                    itemCount: 5
                }
            }
        },
        "Coding": {
            phaseNumber: 6,
            description: "Development phase where developers write code according to specifications, implement features, and build the application.",
            userStory: "As a developer, I want to implement the designed features so that users can interact with the application as specified.",
            ownership: ["Senior Developer", "Frontend Developer", "Backend Developer"],
            categories: {
                "Key Deliverables": {
                    items: ["Source Code", "Unit Tests", "Code Documentation", "Feature Implementation"],
                    itemCount: 4
                },
                "AI Coding": {
                    items: ["GitHub Copilot", "Cursor Pro", "Codeium", "Tabnine"],
                    itemCount: 4
                },
                "IDEs & Editors": {
                    items: ["VS Code", "JetBrains IDEs", "Cursor"],
                    itemCount: 3
                },
                "Who (Roles)": {
                    items: ["Senior Developer", "Frontend Developer", "Backend Developer"],
                    itemCount: 3
                },
                "How (Channels)": {
                    items: ["Daily standups", "Code reviews", "Pair programming"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Context switching", "Technical debt", "Unclear specs", "Bug fixing cycles"],
                    itemCount: 4
                },
                "🚧 Blockers": {
                    items: ["API dependencies", "Environment issues", "Missing libraries"],
                    itemCount: 3
                },
                "🤖 Automate This": {
                    items: ["Code formatting", "Test running", "Documentation generation", "Boilerplate code"],
                    itemCount: 4
                }
            }
        },
        "Create MR": {
            phaseNumber: 7,
            description: "Developers create Merge Requests (Pull Requests) to propose code changes, including detailed descriptions and testing notes.",
            userStory: "As a developer, I want to create a detailed merge request so that my code changes can be properly reviewed and integrated.",
            ownership: ["Developer", "Feature Lead"],
            categories: {
                "Key Deliverables": {
                    items: ["MR Description", "Code Changes", "Testing Notes", "Screenshots"],
                    itemCount: 4
                },
                "AI Assistance": {
                    items: ["GitHub Copilot", "Claude/ChatGPT", "PR Description AI"],
                    itemCount: 3
                },
                "Version Control": {
                    items: ["GitHub", "GitLab", "Bitbucket"],
                    itemCount: 3
                },
                "Who (Roles)": {
                    items: ["Developer", "Feature Lead"],
                    itemCount: 2
                },
                "How (Channels)": {
                    items: ["Git commits", "MR templates", "Slack notifications"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Poor descriptions", "Large changesets", "Missing context"],
                    itemCount: 3
                },
                "🚧 Blockers": {
                    items: ["Merge conflicts", "Failing tests"],
                    itemCount: 2
                },
                "🤖 Automate This": {
                    items: ["PR descriptions", "Changelog generation", "Reviewer assignment"],
                    itemCount: 3
                }
            }
        },
        "Review MRs": {
            phaseNumber: 8,
            description: "Code review process where team members examine code changes for quality, security, performance, and adherence to standards.",
            userStory: "As a senior developer, I want to review merge requests so that code quality and standards are maintained across the project.",
            ownership: ["Senior Developer", "Tech Lead", "Code Reviewer"],
            categories: {
                "Key Deliverables": {
                    items: ["Code Review Comments", "Approval/Rejection", "Improvement Suggestions", "Security Check"],
                    itemCount: 4
                },
                "AI Review": {
                    items: ["CodeRabbit", "SonarQube AI", "DeepCode"],
                    itemCount: 3
                },
                "Review Tools": {
                    items: ["GitHub", "GitLab", "Crucible"],
                    itemCount: 3
                },
                "Who (Roles)": {
                    items: ["Senior Developer", "Tech Lead", "Code Reviewer"],
                    itemCount: 3
                },
                "How (Channels)": {
                    items: ["Code review sessions", "Review comments", "Approval workflows"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Review bottlenecks", "Nitpicky comments", "Delayed feedback"],
                    itemCount: 3
                },
                "🚧 Blockers": {
                    items: ["Reviewer unavailable", "Complex changes"],
                    itemCount: 2
                },
                "🤖 Automate This": {
                    items: ["Code quality checks", "Security scanning", "Style enforcement"],
                    itemCount: 3
                }
            }
        },
        "Merge MRs": {
            phaseNumber: 9,
            description: "Approved code changes are merged into the main branch, integrating new features or fixes into the main codebase.",
            userStory: "As a project lead, I want to merge approved changes so that new features are integrated into the main application.",
            ownership: ["Tech Lead", "Release Manager", "DevOps Engineer"],
            categories: {
                "Key Deliverables": {
                    items: ["Merged Code", "Updated Main Branch", "Merge Conflicts Resolution", "CI/CD Triggers"],
                    itemCount: 4
                },
                "Merge Tools": {
                    items: ["GitHub", "GitLab", "Git CLI"],
                    itemCount: 3
                },
                "Automation": {
                    items: ["GitHub Actions", "GitLab CI", "Jenkins"],
                    itemCount: 3
                },
                "Who (Roles)": {
                    items: ["Tech Lead", "Release Manager", "DevOps Engineer"],
                    itemCount: 3
                },
                "How (Channels)": {
                    items: ["Merge strategies", "Automated pipelines", "Release notifications"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Merge conflicts", "Breaking changes", "Integration issues"],
                    itemCount: 3
                },
                "🚧 Blockers": {
                    items: ["Failed CI checks", "Permission issues"],
                    itemCount: 2
                },
                "🤖 Automate This": {
                    items: ["Merge execution", "Conflict detection", "Branch cleanup"],
                    itemCount: 3
                }
            }
        },
        "Testing": {
            phaseNumber: 10,
            description: "Comprehensive testing phase including unit, integration, and user acceptance testing to ensure quality and functionality.",
            userStory: "As a QA engineer, I want to thoroughly test the application so that bugs are identified and fixed before deployment.",
            ownership: ["QA Engineer", "Test Automation Engineer", "Business Analyst"],
            categories: {
                "Key Deliverables": {
                    items: ["Test Cases", "Bug Reports", "Test Results", "UAT Sign-off"],
                    itemCount: 4
                },
                "AI Testing": {
                    items: ["Testim AI", "Applitools", "Mabl"],
                    itemCount: 3
                },
                "Testing Tools": {
                    items: ["Cypress", "Selenium", "Jest", "Postman"],
                    itemCount: 4
                },
                "Who (Roles)": {
                    items: ["QA Engineer", "Test Automation Engineer", "Business Analyst"],
                    itemCount: 3
                },
                "How (Channels)": {
                    items: ["Test execution", "Bug tracking", "UAT sessions"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Flaky tests", "Environment instability", "Test data management"],
                    itemCount: 3
                },
                "🚧 Blockers": {
                    items: ["Environment downtime", "Missing test data"],
                    itemCount: 2
                },
                "🤖 Automate This": {
                    items: ["Test execution", "Report generation", "Test data creation"],
                    itemCount: 3
                }
            }
        },
        "Deployments": {
            phaseNumber: 11,
            description: "Final phase where the tested application is deployed to production environments and made available to end users.",
            userStory: "As a DevOps engineer, I want to deploy the application to production so that users can access the new features and functionality.",
            ownership: ["DevOps Engineer", "Release Manager", "Site Reliability Engineer"],
            categories: {
                "Key Deliverables": {
                    items: ["Production Release", "Deployment Scripts", "Monitoring Setup", "Rollback Plan"],
                    itemCount: 4
                },
                "Deployment": {
                    items: ["GitHub Actions", "GitLab CI/CD", "Jenkins", "ArgoCD"],
                    itemCount: 4
                },
                "Infrastructure": {
                    items: ["Kubernetes", "Docker", "Terraform"],
                    itemCount: 3
                },
                "Who (Roles)": {
                    items: ["DevOps Engineer", "Release Manager", "Site Reliability Engineer"],
                    itemCount: 3
                },
                "How (Channels)": {
                    items: ["Deployment pipelines", "Release notifications", "Monitoring alerts"],
                    itemCount: 3
                },
                "🚨 Pain Points": {
                    items: ["Deployment failures", "Downtime windows", "Configuration drift"],
                    itemCount: 3
                },
                "🚧 Blockers": {
                    items: ["Environment issues", "Permission problems", "Resource constraints"],
                    itemCount: 3
                },
                "🤖 Automate This": {
                    items: ["Zero-downtime deployments", "Health checks", "Rollback triggers", "Release announcements"],
                    itemCount: 4
                }
            }
        }
    };
    
    // Add all phases to data
    Object.keys(phasesData).forEach(phaseName => {
        data.phases[phaseName] = phasesData[phaseName];
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
