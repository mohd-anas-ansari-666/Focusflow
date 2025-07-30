const express = require('express');
const { body } = require('express-validator');
const {
  startSession,
  endSession,
  getSessions,
  getActiveSession,
  getStats
} = require('../controllers/timeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/start', [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('category')
    .isIn(['work', 'study', 'exercise', 'reading', 'coding', 'other'])
    .withMessage('Invalid category')
], startSession);

router.put('/:id/end', endSession);

router.get('/sessions', getSessions);

router.get('/active', getActiveSession);

router.get('/stats', getStats);

module.exports = router;
