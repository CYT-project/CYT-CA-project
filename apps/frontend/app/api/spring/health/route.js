// Next.js API Route - Proxy to Spring service health endpoint
// Demonstrates cross-service communication in microservices architecture

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const springServiceUrl = process.env.SPRING_SERVICE_URL || 'http://localhost:8080';

    const response = await fetch(`${springServiceUrl}/actuator/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spring service responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Transform Spring Boot health response to match our format
    const enhancedData = {
      status: data.status === 'UP' ? 'healthy' : 'unhealthy',
      service: 'spring-service',
      proxiedBy: 'nextjs-api-route',
      springBootStatus: data.status,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(enhancedData);
  } catch (error) {
    console.error('Error proxying to spring service:', error);
    res.status(500).json({
      error: 'Failed to connect to spring service',
      details: error.message,
      service: 'nextjs-api-route',
      timestamp: new Date().toISOString(),
    });
  }
}