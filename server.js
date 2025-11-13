const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verifyToken = require('./middleware/auth');

dotenv.config();
const app = express();
app.use(express.json());

// Hardcoded demo user
const user = {
  id: 1,
  username: 'ayush',
  password: '12345', // For demo; use bcrypt in real apps
};

// Public Route - Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple credential check
  if (username !== user.username || password !== user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login successful',
    token: token,
  });
});

// Protected Route
app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}. You have access to protected data.`,
  });
});

// Public Route
app.get('/', (req, res) => {
  res.send('Public route: No authentication needed.');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
