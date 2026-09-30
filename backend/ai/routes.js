const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');

router.post('/analyze', auth, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query required' });
    
    res.json({ success: true, message: 'AI analysis placeholder', data: { query } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
