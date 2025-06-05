import cookie from 'cookie';

function allowCors(handler) {
  return async (req, res) => {
    const allowedOrigins = [
      'http://localhost:3000',        // local dev frontend
      'https://your-live-frontend.com' // replace with your real deployed frontend URL
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Allow cookies and credentials (important for cookies)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Allowed HTTP methods
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

    // Allowed headers - include 'Authorization' if you might use it
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return handler(req, res);
  };
}

const handler = (req, res) => {
  // Parse cookies from the request headers
  const cookies = cookie.parse(req.headers.cookie || '');
  const visitorId = cookies.my_visitor_id;

  if (!visitorId) {
    return res.status(400).json({ message: 'No visitor ID cookie found' });
  }

  if (req.method === 'GET' || req.method === 'POST') {
    console.log('Request body:', req.body || {});
    return res.status(200).json({ message: `Hello visitor with ID: ${visitorId}` });
  }

  res.status(405).end(); // Method not allowed
};

export default allowCors(handler);
