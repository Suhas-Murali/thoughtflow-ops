const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

// Parse incoming JSON request bodies automatically
app.use(express.json());

// Simple health-check route.
// Purpose: lets us (and later, monitoring tools / Docker) confirm the server is alive.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'thoughtflow-ops-backend',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`ThoughtFlow Ops backend listening on http://localhost:${PORT}`);
});
