import cookie from 'cookie';

function allowCors(handler) {
  return async (req, res) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://your-live-frontend.com',  // replace this with your frontend URL
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
    // Cookie exists, respond accordingly
    res.status(200).send('Same cookie: A cookie received and the same sent to client');
  } else {
    // Set cookie if it doesn't exist
    const cookieSerialized = cookie.serialize('somecookie', 'cookie text', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'none',
      path: '/',
    });

    res.setHeader('Set-Cookie', cookieSerialized);
    res.status(200).send('New cookie: A new cookie created and sent to the client');
  }
};

export default allowCors(handler);
