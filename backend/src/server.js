const express = require('express');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 4000;

const upload = multer({ dest: 'uploads/' });

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

// File upload route.
// Purpose: accepts a single Excel/CSV file sent under the field name 'file'.
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }

  res.status(200).json({
    message: 'File received successfully.',
    originalName: req.file.originalname,
    savedAs: req.file.filename,
    sizeInBytes: req.file.size,
  });
});

app.listen(PORT, () => {
  console.log(`ThoughtFlow Ops backend listening on http://localhost:${PORT}`);
});