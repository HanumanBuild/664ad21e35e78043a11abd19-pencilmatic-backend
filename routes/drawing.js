const express = require('express');
const jwt = require('jsonwebtoken');
const Drawing = require('../models/Drawing');

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid Token' });
    req.user = user;
    next();
  });
};

router.post('/', authenticateToken, async (req, res) => {
  try {
    const drawing = new Drawing({
      userId: req.user.userId,
      drawingData: req.body.drawingData,
    });
    const savedDrawing = await drawing.save();
    res.json(savedDrawing);
  } catch (e) {
    res.status(500).json({ message: 'Error' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const drawings = await Drawing.find({ userId: req.user.userId });
    res.json(drawings);
  } catch (e) {
    res.status(500).json({ message: 'Error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const drawing = await Drawing.findById(req.params.id);
    if (!drawing) return res.status(404).json({ message: 'Drawing not found' });

    if (drawing.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await drawing.remove();
    res.json({ message: 'Drawing deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;