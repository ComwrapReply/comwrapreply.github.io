// Netlify serverless function to update SDLC data
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      
      // Update the JSON file
      const jsonPath = path.join(__dirname, '..', '..', 'sdlc-workflow.json');
      const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      // Merge new data
      const updatedData = {
        ...existingData,
        ...data,
        metadata: {
          ...existingData.metadata,
          lastAutoSave: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        }
      };
      
      fs.writeFileSync(jsonPath, JSON.stringify(updatedData, null, 2));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Data updated successfully',
          timestamp: new Date().toISOString()
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: error.message
        })
      };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const jsonPath = path.join(__dirname, '..', '..', 'sdlc-workflow.json');
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data)
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: error.message
        })
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
