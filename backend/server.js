require('dotenv').config();

const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
const reportRoutes = require('./routes/reports');
const authRoutes = require('./routes/auth');
// const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://aivt.ouspg.org',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// app.use((req, res, next) => {
//   console.log('Authorization Header:', req.headers.authorization);
//   // console.log('Decoded User:', req.user);  
//   next();
// });

// Use JWT middleware
app.use('/api', reportRoutes);
app.use('/api/auth', authRoutes);


// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});
