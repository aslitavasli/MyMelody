const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const routes = require('./routes/routes');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

// use dynamic port for Render, fallback for local development
const port = process.env.PORT || 8000;

// database connection
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routes
app.use('/', routes);

// start the server and bind to 0.0.0.0 (for render. If localhost, change!)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
