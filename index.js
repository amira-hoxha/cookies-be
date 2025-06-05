// backend/index.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 4000;

// List of allowed origins (trusted frontend URLs)
const allowedOrigins = ['http://localhost:3000', 'https://your-production-domain.com'];

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, false); // Block requests with no origin
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// API route to get visitor ID
app.get('/api/visitor', (req, res) => {
  const visitorId = req.cookies.my_visitor_id;

  if (!visitorId) {
    return res.status(400).json({ message: 'No visitor ID cookie found' });
  }

  res.json({ message: `Hello visitor with ID: ${visitorId}` });
});

app.post('/api/visitor', (req, res) => {
  const visitorId = req.cookies.my_visitor_id;

  if (!visitorId) {
    return res.status(400).json({ message: 'No visitor ID cookie found' });
  }

  // Optionally log or use body
  console.log('Request body:', req.body);

  res.json({ message: `Hello visitor with ID: ${visitorId}` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
