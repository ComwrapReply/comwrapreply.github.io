// Vercel API route to update SDLC data
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;
      
      // Update the JSON file
      const jsonPath = path.join(process.cwd(), 'sdlc-workflow.json');
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
      
      return res.status(200).json({
        success: true,
        message: 'Data updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  if (req.method === 'GET') {
    try {
      const jsonPath = path.join(process.cwd(), 'sdlc-workflow.json');
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
