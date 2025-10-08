# 🚀 GitHub Pages Deployment Guide

## Files to Commit

### ✅ **Required Files:**
- `sdlc-workflow.html` - Main workflow interface
- `sdlc-workflow.json` - Data file
- `package.json` - Dependencies and scripts
- `README.md` - Documentation
- `.gitignore` - Git ignore rules

### ✅ **Optional Files:**
- `fetch-local-browser-data.html` - Data fetcher interface
- `fetch-browser-data.js` - Merge script
- `auto-sync.js` - Auto-sync functionality
- `test-system.js` - Testing script
- `server.js` - Local development server

### ❌ **Files to Exclude:**
- `sdlc-workflow-date.json` - Temporary download file
- `sdlc-workflow copy.json` - Backup copy
- `node_modules/` - Dependencies
- `*.log` - Log files

## Deployment Steps

### 1. **Initialize Git Repository:**
```bash
git init
git add .
git commit -m "Initial commit: SDLC Workflow System"
```

### 2. **Create GitHub Repository:**
- Go to GitHub and create a new repository
- Name it: `comwrapreply.github.io` (for GitHub Pages)
- Or use any name and enable GitHub Pages in settings

### 3. **Push to GitHub:**
```bash
git remote add origin https://github.com/yourusername/comwrapreply.github.io.git
git branch -M main
git push -u origin main
```

### 4. **Enable GitHub Pages:**
- Go to repository Settings
- Scroll to "Pages" section
- Select "Deploy from a branch"
- Choose "main" branch
- Select "/ (root)" folder
- Click "Save"

### 5. **Access Your Site:**
- Your site will be available at: `https://yourusername.github.io/comwrapreply.github.io/`
- Or if using `comwrapreply.github.io` repo: `https://comwrapreply.github.io/`

## Features Available in Static Hosting

### ✅ **Working:**
- View workflow data
- Add/remove items (saved to localStorage)
- Data persistence in browser
- All UI interactions

### ❌ **Not Available:**
- Real-time server updates
- API endpoints for data saving
- Server-side data synchronization

## Local Development

For full functionality with server features:

```bash
# Install dependencies
npm install

# Start local server
npm run serve

# Open in browser
open http://localhost:5000/sdlc-workflow.html
```

## Data Management

### **For Static Hosting:**
- Data is saved to browser localStorage
- Changes persist per browser/device
- No server-side synchronization

### **For Full Features:**
- Use local development server
- Data syncs with JSON file
- Real-time updates available

## Troubleshooting

### **If GitHub Pages doesn't work:**
1. Check repository name matches GitHub Pages requirements
2. Ensure files are in root directory
3. Wait 5-10 minutes for deployment
4. Check repository Settings > Pages

### **If data doesn't load:**
1. Check browser console for errors
2. Ensure `sdlc-workflow.json` is in root directory
3. Verify file paths are correct (using `./` not `http://`)

## File Structure for GitHub Pages

```
comwrapreply.github.io/
├── sdlc-workflow.html          # Main interface
├── sdlc-workflow.json          # Data file
├── package.json                # Dependencies
├── README.md                   # Documentation
├── .gitignore                  # Git ignore rules
├── fetch-local-browser-data.html
├── fetch-browser-data.js
├── auto-sync.js
├── test-system.js
└── server.js                   # Local dev only
```
