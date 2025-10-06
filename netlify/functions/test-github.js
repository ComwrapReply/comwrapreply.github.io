const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });

    console.log('Testing GitHub API with token length:', process.env.GITHUB_TOKEN?.length);

    // Test 1: Get current user
    const user = await octokit.rest.users.getAuthenticated();
    console.log('✅ User authenticated:', user.data.login);

    // Test 2: Get repository
    const repo = await octokit.rest.repos.get({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO
    });
    console.log('✅ Repository found:', repo.data.full_name);

    // Test 3: Try to get the file
    try {
      const file = await octokit.rest.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: 'sdlc-workflow-new.json'
      });
      console.log('✅ File found, SHA:', file.data.sha);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'GitHub API working perfectly!',
          user: user.data.login,
          repository: repo.data.full_name,
          fileExists: true,
          fileSha: file.data.sha
        })
      };
    } catch (fileError) {
      console.log('File not found, will create it');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'GitHub API working, file will be created',
          user: user.data.login,
          repository: repo.data.full_name,
          fileExists: false,
          error: fileError.message
        })
      };
    }

  } catch (error) {
    console.error('GitHub API Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'GitHub API Error: ' + error.message,
        status: error.status,
        tokenLength: process.env.GITHUB_TOKEN?.length || 0,
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO
      })
    };
  }
};
