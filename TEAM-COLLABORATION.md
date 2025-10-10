# Team Collaboration Setup for SDLC Board

## Overview
This guide explains how to set up team collaboration for 10 people to add/remove items and sync to Netlify.

## Option 1: GitHub Team Access (Recommended)

### Step 1: Create GitHub Organization Team
1. Go to your GitHub repository: `https://github.com/ComwrapReply/comwrapreply.github.io`
2. Click **Settings** → **Manage access**
3. Click **Invite teams or people**
4. Add your team members by email or GitHub username
5. Set permission level to **Write** (allows push access)

### Step 2: Configure Netlify Identity
1. In Netlify dashboard → **Site settings** → **Identity**
2. Enable **Identity** service
3. Configure **Registration preferences**:
   - Set to **Invite only** (most secure)
   - Or **Open** (easier for team setup)

### Step 3: Add Team Members to Netlify
1. Go to **Identity** → **Invite users**
2. Send invites to your team members
3. They'll receive email invitations to join

### Step 4: Update Environment Variables
Add these to Netlify **Site settings** → **Environment variables**:
```
GITHUB_TEAM_MEMBERS=szymon,member1,member2,member3,member4,member5,member6,member7,member8,member9,member10
ALLOWED_DOMAINS=yourcompany.com,netlify.app
```

## Option 2: Simple Token-Based Access

### Step 1: Generate Individual GitHub Tokens
Each team member needs their own GitHub Personal Access Token:
1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. Generate new token with `repo` scope
3. Share tokens securely with team members

### Step 2: Update Netlify Function
The save function will need to validate user tokens and track changes.

## Option 3: Netlify Identity + GitHub Integration

### Step 1: Enable Netlify Identity
1. **Site settings** → **Identity** → **Enable Identity**
2. Configure **External providers** → **GitHub**
3. Set up OAuth app in GitHub

### Step 2: Update Frontend Authentication
Add login/logout functionality to the board.

## Implementation Steps

### 1. Update Netlify Function for Team Access

Create `netlify/functions/save-data-team.js`:

```javascript
const { Octokit } = require('@octokit/rest');

exports.handler = async (event, context) => {
  // Validate user authentication
  const user = context.clientContext?.user;
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Authentication required' })
    };
  }

  // Get GitHub token from user's metadata or environment
  const githubToken = process.env.GITHUB_TOKEN;
  
  // Rest of the save logic...
};
```

### 2. Add User Tracking to JSON Structure

Update `sdlc-workflow-new.json` to include user information:

```json
{
  "metadata": {
    "lastModified": "2024-01-15T10:30:00Z",
    "lastModifiedBy": "szymon@company.com",
    "version": "1.2.0",
    "totalPhases": 11,
    "totalCategories": 45,
    "totalItems": 180
  },
  "changeHistory": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "user": "szymon@company.com",
      "action": "added_item",
      "phase": "Discovery & Planning",
      "category": "🤖 Automate This:",
      "item": "New automation item"
    }
  ]
}
```

### 3. Add Conflict Resolution

Implement optimistic locking to prevent conflicts:

```javascript
// Check if file was modified since last read
const currentFile = await octokit.repos.getContent({
  owner: process.env.GITHUB_OWNER,
  repo: process.env.GITHUB_REPO,
  path: 'sdlc-workflow-new.json'
});

const lastModified = JSON.parse(Buffer.from(currentFile.data.content, 'base64').toString()).metadata.lastModified;

if (lastModified > requestTimestamp) {
  return {
    statusCode: 409,
    body: JSON.stringify({ 
      error: 'Conflict: File was modified by another user',
      lastModified: lastModified
    })
  };
}
```

## Security Considerations

### 1. Access Control
- Use Netlify Identity for authentication
- Validate user permissions before allowing changes
- Log all changes with user attribution

### 2. Rate Limiting
- Implement rate limiting to prevent abuse
- Add request throttling per user

### 3. Data Validation
- Validate all input data
- Sanitize user inputs
- Prevent XSS attacks

## Team Workflow

### 1. Daily Collaboration
1. Team members log in to the board
2. Make changes to their assigned phases
3. Changes auto-save to GitHub
4. Other team members see updates in real-time

### 2. Conflict Resolution
1. If two people edit simultaneously, show conflict warning
2. Allow user to choose which version to keep
3. Merge changes when possible

### 3. Change Tracking
1. All changes logged with user and timestamp
2. Change history visible to all team members
3. Rollback capability for accidental changes

## Quick Setup Commands

```bash
# 1. Enable Netlify Identity
netlify addons:create netlify-identity-widget

# 2. Deploy with team features
netlify deploy --prod

# 3. Configure GitHub OAuth (if using Option 3)
# Follow GitHub OAuth app setup guide
```

## Testing Team Access

1. **Create test users** in Netlify Identity
2. **Test simultaneous edits** from different browsers
3. **Verify change tracking** works correctly
4. **Test conflict resolution** scenarios

## Monitoring and Analytics

- Track user activity and changes
- Monitor for conflicts and resolution
- Generate team collaboration reports
- Set up alerts for critical changes

## Next Steps

1. Choose your preferred collaboration method
2. Set up GitHub team permissions
3. Configure Netlify Identity
4. Update the save function for team access
5. Test with a small group first
6. Roll out to full team

Would you like me to implement any of these options?

