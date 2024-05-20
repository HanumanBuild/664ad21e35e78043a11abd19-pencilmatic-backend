const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const drawingRoutes = require('./routes/drawing');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.MONGODB_DBNAME,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

app.use(cors());

app.use('/auth', authRoutes);
app.use('/drawings', drawingRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Pencilmatic Backend');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});