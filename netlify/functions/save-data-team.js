const { Octokit } = require('@octokit/rest');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // Get user information from Netlify Identity
    const user = context.clientContext?.user;
    const userEmail = user?.email || 'anonymous@team.com';
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous User';

    console.log('🔐 User authenticated:', { userEmail, userName });

    // Validate required environment variables
    const requiredEnvVars = ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('❌ Missing environment variables:', missingVars);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Server configuration error',
          details: `Missing: ${missingVars.join(', ')}`
        }),
      };
    }

    // Initialize GitHub client
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    // Parse request data
    const requestData = JSON.parse(event.body);
    
    // Add user tracking to the data
    const timestamp = new Date().toISOString();
    const enhancedData = {
      ...requestData,
      metadata: {
        ...requestData.metadata,
        lastModified: timestamp,
        lastModifiedBy: userEmail,
        lastModifiedByName: userName,
        version: (parseFloat(requestData.metadata?.version || '1.0') + 0.1).toFixed(1)
      },
      changeHistory: [
        ...(requestData.changeHistory || []),
        {
          timestamp,
          user: userEmail,
          userName: userName,
          action: 'data_update',
          description: `Updated by ${userName} (${userEmail})`
        }
      ].slice(-50) // Keep only last 50 changes
    };

    console.log('📝 Saving data for user:', userName);

    // Get current file content
    let currentFile;
    try {
      currentFile = await octokit.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: 'sdlc-workflow-new.json',
      });
    } catch (error) {
      if (error.status === 404) {
        console.log('📄 File not found, will create new file');
        currentFile = null;
      } else {
        throw error;
      }
    }

    // Check for conflicts (optional - can be enabled for strict conflict resolution)
    const conflictCheck = process.env.ENABLE_CONFLICT_CHECK === 'true';
    if (conflictCheck && currentFile) {
      const currentContent = JSON.parse(Buffer.from(currentFile.data.content, 'base64').toString());
      const currentLastModified = currentContent.metadata?.lastModified;
      const requestTimestamp = requestData.metadata?.lastModified;
      
      if (currentLastModified && requestTimestamp && currentLastModified > requestTimestamp) {
        console.warn('⚠️ Potential conflict detected');
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Conflict detected',
            message: 'File was modified by another user. Please refresh and try again.',
            lastModified: currentLastModified,
            lastModifiedBy: currentContent.metadata?.lastModifiedBy
          }),
        };
      }
    }

    // Prepare file content
    const fileContent = JSON.stringify(enhancedData, null, 2);
    const base64Content = Buffer.from(fileContent).toString('base64');

    // Commit the changes
    const commitMessage = `Update SDLC workflow data by ${userName} (${userEmail})`;
    
    const updateParams = {
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: 'sdlc-workflow-new.json',
      message: commitMessage,
      content: base64Content,
      branch: 'main',
    };

    // Add SHA if updating existing file
    if (currentFile) {
      updateParams.sha = currentFile.data.sha;
    }

    const result = await octokit.repos.createOrUpdateFileContents(updateParams);

    console.log('✅ Successfully saved to GitHub:', {
      user: userName,
      commit: result.data.commit.sha,
      url: result.data.content.html_url
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Data saved successfully by ${userName}`,
        commit: result.data.commit.sha,
        url: result.data.content.html_url,
        timestamp,
        user: {
          email: userEmail,
          name: userName
        }
      }),
    };

  } catch (error) {
    console.error('❌ Error saving data:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        details: error.response?.data || 'Unknown error'
      }),
    };
  }
};

