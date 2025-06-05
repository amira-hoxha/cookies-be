import cookie from 'cookie';

function allowCors(handler) {
  return async (req, res) => {
    const allowedOrigins = [
      'http://localhost:3000',          // your local frontend
      'https://your-live-frontend.com'  // your live frontend — update this!
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return handler(req, res);
  };
}

const handler = (req, res) => {
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
