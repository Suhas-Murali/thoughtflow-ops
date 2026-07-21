const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../infrastructure/prismaClient');
const { registerUser } = require('../application/registerUser');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await registerUser({ email, password, role });
    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await prisma.systemUser.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.status(200).json({ message: 'Login successful.', token });
});

module.exports = router;