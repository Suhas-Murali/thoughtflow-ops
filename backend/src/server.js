require('dotenv').config();
const express = require('express');

const healthRoutes = require('./presentation/healthRoutes');
const uploadRoutes = require('./presentation/uploadRoutes');
const authRoutes = require('./presentation/authRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Mount route groups.
app.use('/', healthRoutes);
app.use('/api', uploadRoutes);
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`ThoughtFlow Ops backend listening on http://localhost:${PORT}`);
});