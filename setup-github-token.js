#!/usr/bin/env node

console.log('🔧 GitHub Token Setup for SDLC Workflow');
console.log('==========================================\n');

console.log('📋 Follow these steps to set up GitHub-based storage:\n');

console.log('1️⃣  Create GitHub Personal Access Token:');
console.log('   🌐 Go to: https://github.com/settings/tokens');
console.log('   📝 Click "Generate new token" → "Generate new token (classic)"');
console.log('   🏷️  Name: "SDLC Workflow Storage"');
console.log('   ⏰ Expiration: "No expiration" (or 1 year)');
console.log('   ✅ Scopes: Check "repo" (Full control of private repositories)');
console.log('   📋 Copy the token (you won\'t see it again!)\n');

console.log('2️⃣  Add Environment Variables to Netlify:');
console.log('   🌐 Go to: https://app.netlify.com');
console.log('   🏠 Select your site: "sdlc-workflow"');
console.log('   ⚙️  Go to: Site settings → Environment variables');
console.log('   ➕ Click "Add a variable" and add these 3 variables:\n');
console.log('   📝 GITHUB_TOKEN = [paste your token here]');
console.log('   📝 GITHUB_OWNER = szymon');
console.log('   📝 GITHUB_REPO = comwrapreply.github.io\n');

console.log('3️⃣  Deploy the updated function:');
console.log('   💻 Run: netlify deploy --prod --dir .\n');

console.log('4️⃣  Test the setup:');
console.log('   🌐 Go to: https://sdlc-workflow.netlify.app');
console.log('   ➕ Add a new item to any category');
console.log('   👀 Check if sync status shows "✅ Saved to cloud"');
console.log('   🔍 Check your GitHub repo - you should see the updated file\n');

console.log('✅ That\'s it! Your data will now save permanently to GitHub!');
console.log('\n🔗 Quick Links:');
console.log('   GitHub Tokens: https://github.com/settings/tokens');
console.log('   Netlify Dashboard: https://app.netlify.com');
console.log('   Your Site: https://sdlc-workflow.netlify.app');
