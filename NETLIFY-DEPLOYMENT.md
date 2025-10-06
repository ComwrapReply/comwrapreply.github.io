# 🚀 Netlify Deployment Guide

## Quick Deploy (Recommended)

### Option 1: Using Netlify CLI
```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy directly
netlify deploy --prod --dir .
```

### Option 2: Using the deployment script
```bash
# Make script executable and run
chmod +x deploy-to-netlify.sh
./deploy-to-netlify.sh
```

## Manual Deploy via Netlify Dashboard

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign in or create account**
3. **Click "Add new site" → "Deploy manually"**
4. **Drag and drop your project folder** or select files:
   - `index.html` (main file)
   - `sdlc-workflow-new.json` (data file)
   - `netlify.toml` (configuration)
5. **Click "Deploy site"**

## Files Included in Deployment

- ✅ `index.html` - Main HTML file with all data
- ✅ `sdlc-workflow-new.json` - JSON data source
- ✅ `netlify.toml` - Netlify configuration
- ✅ `package.json` - Project metadata

## What Happens After Deployment

1. **Site URL**: You'll get a unique URL like `https://amazing-name-123456.netlify.app`
2. **Auto-updates**: Any changes pushed to your connected Git repo will auto-deploy
3. **Custom Domain**: You can add a custom domain in Netlify dashboard
4. **HTTPS**: Automatically enabled for all sites

## Troubleshooting

### If deployment fails:
- Check that `index.html` is in the root directory
- Ensure `sdlc-workflow-new.json` is accessible
- Verify `netlify.toml` configuration

### If data doesn't load:
- Check browser console for errors
- Verify JSON file path in HTML
- Ensure CORS is properly configured

## Next Steps

1. **Test your deployed site**
2. **Share the URL with your team**
3. **Set up custom domain (optional)**
4. **Configure auto-deployment from Git (optional)**

---

**Your SDLC Workflow is now live on the web! 🎉**
