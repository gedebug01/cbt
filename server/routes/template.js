const express = require('express');
const router = express.Router();

router.post('/admin/addClass', (req, res, next) => {
  try {
    setTimeout(() => {
      res.status(200).json({ status: 'done' });
    }, 1000);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
