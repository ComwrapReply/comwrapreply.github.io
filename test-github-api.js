const { Octokit } = require("@octokit/rest");

async function testGitHubAPI() {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  try {
    console.log('Testing GitHub API connection...');
    
    // Test 1: Get repository info
    const repo = await octokit.rest.repos.get({
      owner: 'ComwrapReply',
      repo: 'comwrapreply.github.io'
    });
    console.log('✅ Repository found:', repo.data.full_name);
    
    // Test 2: Try to get the current file
    try {
      const file = await octokit.rest.repos.getContent({
        owner: 'ComwrapReply',
        repo: 'comwrapreply.github.io',
        path: 'sdlc-workflow-new.json'
      });
      console.log('✅ File found, SHA:', file.data.sha);
    } catch (fileError) {
      console.log('❌ File not found:', fileError.message);
    }
    
    // Test 3: List files in root
    const contents = await octokit.rest.repos.getContent({
      owner: 'ComwrapReply',
      repo: 'comwrapreply.github.io',
      path: ''
    });
    console.log('📁 Files in root:', contents.data.map(item => item.name));
    
  } catch (error) {
    console.error('❌ GitHub API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Response:', error.response?.data);
  }
}

testGitHubAPI();
