import cookie from 'cookie';

function allowCors(handler) {
  return async (req, res) => {
    const allowedOrigins = [
      'http://localhost:3000', // your local frontend
      'https://your-frontend.vercel.app' // optional if deployed frontend
    ];

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
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
  const cookies = cookie.parse(req.headers.cookie || '');

  if (cookies.somecookie) {
    res.status(200).json({ message: 'Cookie already exists', cookie: cookies.somecookie });
  } else {
    const cookieSerialized = cookie.serialize('somecookie', 'cookie-from-server', {
      httpOnly: true,
      secure: true, // Vercel uses HTTPS
      sameSite: 'None', // Required for cross-origin
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    res.setHeader('Set-Cookie', cookieSerialized);
    res.status(200).json({ message: 'New cookie set' });
  }
};

export default allowCors(handler);
