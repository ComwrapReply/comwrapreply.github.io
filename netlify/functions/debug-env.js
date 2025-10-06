exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      GITHUB_OWNER: process.env.GITHUB_OWNER,
      GITHUB_REPO: process.env.GITHUB_REPO,
      HAS_TOKEN: !!process.env.GITHUB_TOKEN,
      TOKEN_LENGTH: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.length : 0,
      ALL_ENV_KEYS: Object.keys(process.env).filter(key => key.includes('GITHUB'))
    })
  };
};
