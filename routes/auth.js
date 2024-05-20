const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (e) {
    res.status(500).json({ message: 'Error' });
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid Credentials' });
  }

  try {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const accessToken = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);
      res.json({ accessToken });
    } else {
      res.status(400).json({ message: 'Invalid Credentials' });
    }
  } catch (e) {
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;