# 🔧 GitHub-Based Cloud Storage Setup

## Step 1: Create GitHub Personal Access Token

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Generate New Token**
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name: "SDLC Workflow Storage"
   - Set expiration: "No expiration" (or 1 year)
   - Select scopes: ✅ **repo** (Full control of private repositories)

3. **Copy the Token**
   - ⚠️ **IMPORTANT**: Copy the token immediately - you won't see it again!
   - Save it somewhere safe (like a password manager)

## Step 2: Add Environment Variables to Netlify

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Select your site: "sdlc-workflow"

2. **Navigate to Environment Variables**
   - Site settings → Environment variables
   - Click "Add a variable"

3. **Add These Variables**
   ```
   GITHUB_TOKEN = your-copied-token-here
   GITHUB_OWNER = szymon
   GITHUB_REPO = comwrapreply.github.io
   ```

## Step 3: Update Netlify Function

The function is already created, but let me show you what it does:

```javascript
// netlify/functions/save-data.js
const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  if (event.httpMethod === 'POST') {
    const data = JSON.parse(event.body);
    
    try {
      // Get current file to get SHA
      const { data: currentFile } = await octokit.rest.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: 'sdlc-workflow-new.json'
      });

      // Update the file
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: 'sdlc-workflow-new.json',
        message: `Update SDLC data - ${new Date().toISOString()}`,
        content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
        sha: currentFile.sha
      });

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: true, message: 'Data saved to GitHub!' })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ success: false, error: error.message })
      };
    }
  }
};
```

## Step 4: Install Dependencies

```bash
# In your project directory
npm init -y
npm install @octokit/rest
```

## Step 5: Deploy

```bash
netlify deploy --prod --dir .
```

## How It Works

1. **User makes changes** in the web interface
2. **Auto-save triggers** and calls Netlify function
3. **Function receives data** and authenticates with GitHub
4. **Data saves to GitHub** repository as JSON file
5. **All users see updates** when they refresh the page

## Benefits

✅ **Free** - No database costs  
✅ **Reliable** - GitHub's infrastructure  
✅ **Versioned** - Every change is tracked  
✅ **Accessible** - Data visible in GitHub repo  
✅ **Backup** - Automatic with GitHub  

## Troubleshooting

### If save fails:
- Check GitHub token has `repo` permissions
- Verify environment variables are set correctly
- Check Netlify function logs for errors

### If data doesn't update:
- Refresh the page to reload from GitHub
- Check if file exists in GitHub repository
- Verify file path matches exactly

## Test It

1. Make a change in the web interface
2. Check the sync status indicator
3. Look at your GitHub repository - you should see the updated file
4. Refresh the page - changes should persist

---

**That's it! Your data will now save permanently to GitHub! 🎉**
