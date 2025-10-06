const { Octokit } = require("@octokit/rest");

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      
      // Initialize GitHub client
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
      });

      // Update metadata
      data.metadata = {
        ...data.metadata,
        lastModified: new Date().toISOString(),
        lastAutoSave: new Date().toISOString()
      };

      console.log('Saving data to GitHub:', {
        phases: Object.keys(data.phases).length,
        totalItems: data.metadata.totalItems,
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        hasToken: !!process.env.GITHUB_TOKEN
      });

      try {
        // Try to get current file to get SHA
        const { data: currentFile } = await octokit.rest.repos.getContent({
          owner: process.env.GITHUB_OWNER,
          repo: process.env.GITHUB_REPO,
          path: 'sdlc-workflow-new.json'
        });

        // Update existing file
        const { data: result } = await octokit.rest.repos.createOrUpdateFileContents({
          owner: process.env.GITHUB_OWNER,
          repo: process.env.GITHUB_REPO,
          path: 'sdlc-workflow-new.json',
          message: `Update SDLC workflow data - ${new Date().toISOString()}`,
          content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
          sha: currentFile.sha
        });

        console.log('Successfully updated file:', result.commit.sha);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Data saved to GitHub successfully!',
            commit: result.commit.sha,
            metadata: data.metadata
          })
        };

      } catch (fileError) {
        if (fileError.status === 404) {
          // File doesn't exist, create it
          console.log('File not found, creating new file...');
          
          const { data: result } = await octokit.rest.repos.createOrUpdateFileContents({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            path: 'sdlc-workflow-new.json',
            message: `Create SDLC workflow data - ${new Date().toISOString()}`,
            content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64')
          });

          console.log('Successfully created file:', result.commit.sha);

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'Data created in GitHub successfully!',
              commit: result.commit.sha,
              metadata: data.metadata
            })
          };
        } else {
          throw fileError;
        }
      }

    } catch (error) {
      console.error('Error saving to GitHub:', error);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Error saving data to GitHub: ' + error.message,
          error: error.toString()
        })
      };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      // Initialize GitHub client
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
      });

      // Get current data from GitHub
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner: process.env.GITHUB_OWNER,
        repo: process.env.GITHUB_REPO,
        path: 'sdlc-workflow-new.json'
      });

      const data = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: data
        })
      };

    } catch (error) {
      console.error('Error loading from GitHub:', error);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Error loading data from GitHub: ' + error.message
        })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      success: false,
      message: 'Method not allowed'
    })
  };
};