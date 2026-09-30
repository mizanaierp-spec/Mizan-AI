const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI service is available',
    status: 'ok'
  });
});

module.exports = router;
