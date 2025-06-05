import cookie from 'cookie';

function allowCors(handler) {
  return async (req, res) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://your-live-frontend.com',  // <-- Replace this with your actual frontend URL
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      // Optional: you can block unknown origins explicitly if you want
      res.setHeader('Access-Control-Allow-Origin', 'null');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return handler(req, res);
  };
}

const handler = (req, res) => {
  const cookieHeader = req.headers.cookie || '';
  console.log('Raw cookie header:', cookieHeader);

  const cookies = cookie.parse(cookieHeader);
  const visitorId = cookies.my_visitor_id;

  console.log('Parsed cookies:', cookies);

  if (!visitorId) {
    return res.status(400).json({ message: 'No visitor ID cookie found' });
  }

  if (req.method === 'GET' || req.method === 'POST') {
    console.log('Request body:', req.body || {});
    return res.status(200).json({ message: `Hello visitor with ID: ${visitorId}` });
  }

  res.status(405).end();
};

export default allowCors(handler);
