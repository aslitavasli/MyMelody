const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const routes = require('./routes/Routes');
const mongoose = require('mongoose');

const app = express();

// Use dynamic port for Render, fallback for local development
const port = process.env.PORT || 8000;

// Database connection
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/', routes);

// Static file serving
app.use('/assets', express.static('assets'));

// Start the server and bind to 0.0.0.0
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
