const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const requestRoutes = require('./routes/requestRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/requests', requestRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('E-Cycle Lanka API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});