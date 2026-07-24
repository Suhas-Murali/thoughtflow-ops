const express = require('express');
const cors = require('cors');

const healthRoutes = require('./presentation/healthRoutes');
const uploadRoutes = require('./presentation/uploadRoutes');
const authRoutes = require('./presentation/authRoutes');
const statsRoutes = require('./presentation/statsRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());
app.use('/', healthRoutes);
app.use('/api', uploadRoutes);
app.use('/api', authRoutes);
app.use('/api', statsRoutes);

module.exports = app;