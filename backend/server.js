// We import 'express' — this is the framework that creates our web server.
// Without express, we'd have to write hundreds of lines just to handle one request.
const express = require('express');

// We import 'mongoose' — this lets our backend talk to MongoDB.
// Think of it as a translator between JavaScript and the database.
const mongoose = require('mongoose');

// We import 'cors' — by default, browsers BLOCK requests between different ports.
// Our React runs on port 3000, backend on port 5000. CORS removes that block.
const cors = require('cors');

// We import 'dotenv' — this reads our .env file and loads secret values
// like database passwords into the app. We never hardcode secrets in code.
const dotenv = require('dotenv');

// We import 'path' — this is a built-in Node.js tool that helps us
// work with file and folder paths correctly on any operating system.
const path = require('path');

// This line actually reads the .env file and makes the values available
// via process.env — must be called before anything uses process.env
dotenv.config();

// We create our express app — this 'app' object is our entire server.
// Everything (routes, middleware, settings) gets attached to this.
const app = express();

// This tells express to accept JSON data in request bodies.
// When React sends a form (like register or login), it sends JSON.
// Without this line, req.body would be undefined — we'd get nothing.
app.use(express.json());

// This enables CORS for all routes — allows our React app to
// send requests to this backend without being blocked by the browser.
app.use(cors());

// This makes the 'uploads' folder publicly accessible via URL.
// When a user uploads an e-waste item image, it gets saved here,
// and anyone can view it at: http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// We import our auth routes
const authRoutes = require('./routes/authRoutes');

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const requestRoutes = require('./routes/requestRoutes');
app.use('/api/requests', requestRoutes);

// We tell express to use authRoutes for any URL starting with /api/auth
// So /api/auth/register and /api/auth/login are now active.
// Grouping under /api/ is a best practice — it separates API from frontend URLs.
app.use('/api/auth', authRoutes);

// This is our database connection.
// mongoose.connect() takes the MongoDB connection string from .env
// and connects our app to the database.
// The .then() runs if connection is successful, .catch() runs if it fails.
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

  const itemRoutes = require('./routes/itemRoutes');
app.use('/api/items', itemRoutes);

  // We import protect middleware
const { protect } = require('./middleware/authMiddleware');

// This is a protected test route — only logged in users can access it.
// 'protect' runs first, checks the token, then the function runs.
app.get('/api/test-protected', protect, (req, res) => {
  // req.user is available here because protect middleware set it
  res.json({ message: `Hello ${req.user.name}, you are logged in!` });
});

// This is a simple test route — when someone visits http://localhost:5000/
// the server responds with this message. We use this to confirm the server works.
app.get('/', (req, res) => {
  res.send('E-Cycle Lanka API is running...');
});

// process.env.PORT reads the port from .env file.
// If it doesn't exist, we fall back to 5000.
// The server 'listens' on this port — waiting for incoming requests.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});