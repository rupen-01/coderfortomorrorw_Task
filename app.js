const express = require('express');
const bodyParser = require('express').json;
const authRoutes = require('./routes/authRoute');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(bodyParser());

app.use('/auth', authRoutes);
app.use('/', categoryRoutes);

// basic health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
