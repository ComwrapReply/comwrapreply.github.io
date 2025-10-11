# SDLC Workflow Guide - GitHub Pages

This repository hosts the SDLC Complete Workflow Guide on GitHub Pages.

## 🚀 Quick Setup

### Files for GitHub Pages:
- `index-github-pages.html` → Rename to `index.html` for GitHub Pages
- `sdlc-workflow-new-copy.json` → JSON data file

## 📋 GitHub Pages Deployment Steps

### 1. **Prepare Files**
```bash
# Rename the GitHub Pages version to index.html
mv index-github-pages.html index.html

# Ensure JSON file has no spaces in name
# sdlc-workflow-new-copy.json (already done)
```

### 2. **Commit and Push to GitHub**
```bash
git add index.html sdlc-workflow-new-copy.json
git commit -m "Add GitHub Pages version of SDLC Workflow Guide"
git push origin main
```

### 3. **Enable GitHub Pages**
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### 4. **Access Your Site**
Your site will be available at:
`https://comwrapreply.github.io/`

## 🔧 Features

### ✅ **GitHub Pages Optimized**
- **Local Data Loading**: Loads from `sdlc-workflow-new-copy.json`
- **Auto-refresh**: Refreshes every 30 seconds
- **Auto-save**: Saves to localStorage every 1 second
- **Download**: Can download updated JSON files
- **GitHub Branding**: Shows GitHub Pages indicators

### 🎨 **Visual Indicators**
- **GitHub Badge**: Shows "🐙 GITHUB" indicator
- **Status Messages**: All messages indicate GitHub Pages operations
- **Data Summary**: Shows "GitHub Pages" as data source

### 📊 **Interactive Features**
- **Add/Remove Items**: Full CRUD operations
- **User Stories**: Add and manage user stories
- **Ownership**: Manage team ownership
- **Categories**: Organize tools and deliverables
- **Real-time Updates**: Auto-refresh from GitHub

## 🔄 **How It Works**

1. **Data Loading**: Loads JSON data from GitHub Pages hosted file
2. **Auto-save**: Saves changes to localStorage
3. **Auto-refresh**: Checks for updates every 30 seconds
4. **Download**: Users can download updated JSON files
5. **Offline Support**: Works with cached data when offline

## 📁 **File Structure**
```
/
├── index.html                    # Main GitHub Pages file
├── sdlc-workflow-new-copy.json  # JSON data file
└── README.md                     # This file
```

## 🎯 **Next Steps**

1. **Deploy**: Follow the GitHub Pages setup steps above
2. **Test**: Visit your GitHub Pages URL
3. **Customize**: Modify the JSON data as needed
4. **Share**: Share the GitHub Pages URL with your team

## 🔗 **Links**

- **GitHub Pages**: `https://comwrapreply.github.io/`
- **Miro Board**: [SDLC in Miro](https://miro.com/app/board/uXjVJCfwKNc=/)
- **Repository**: `https://github.com/ComwrapReply/comwrapreply.github.io`

---

**Note**: This is the GitHub Pages version optimized for hosting on GitHub Pages with proper file naming and URL handling.
