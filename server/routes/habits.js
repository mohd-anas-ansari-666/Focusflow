const express = require('express');
const { body } = require('express-validator');
const {
  createHabit,
  getHabits,
  updateHabit,
  markHabitComplete,
  deleteHabit
} = require('../controllers/habitController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', [
  body('name')
    .isLength({ min: 1, max: 50 })
    .withMessage('Habit name must be between 1 and 50 characters'),
  body('category')
    .isIn(['health', 'productivity', 'learning', 'social', 'other'])
    .withMessage('Invalid category'),
  body('frequency')
    .isIn(['daily', 'weekly'])
    .withMessage('Invalid frequency')
], createHabit);

router.get('/', getHabits);

router.put('/:id', updateHabit);

router.post('/:id/complete', [
  body('date')
    .isISO8601()
    .withMessage('Invalid date format')
], markHabitComplete);

router.delete('/:id', deleteHabit);

module.exports = router;
