const jwt = require('jsonwebtoken');
require('dotenv').config();

const ADMIN_EMAIL = 'admin@codesfortomorrow.com';
const ADMIN_PASSWORD = 'Admin123!@#'; 

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ token });
};
