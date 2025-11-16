// Next.js API Route - Proxy to Node service health endpoint
// Demonstrates API route functionality in Next.js

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In development, proxy to local node service
    // In production, this would proxy to the deployed node service
    const nodeServiceUrl = process.env.NODE_SERVICE_URL || 'http://localhost:3000';

    const response = await fetch(`${nodeServiceUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Node service responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Add Next.js API route metadata
    const enhancedData = {
      ...data,
      proxiedBy: 'nextjs-api-route',
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(enhancedData);
  } catch (error) {
    console.error('Error proxying to node service:', error);
    res.status(500).json({
      error: 'Failed to connect to node service',
      details: error.message,
      service: 'nextjs-api-route',
      timestamp: new Date().toISOString(),
    });
  }
}