require('dotenv').config();
const express = require('express');

const healthRoutes = require('./presentation/healthRoutes');
const uploadRoutes = require('./presentation/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Mount route groups.
// Health check lives at the root (no /api prefix — convention for infra checks).
app.use('/', healthRoutes);

// All business-facing endpoints live under /api.
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
  console.log(`ThoughtFlow Ops backend listening on http://localhost:${PORT}`);
});