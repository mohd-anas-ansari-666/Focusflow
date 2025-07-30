const Habit = require('../models/Habit');
const { validationResult } = require('express-validator');

const createHabit = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const habit = new Habit({
      ...req.body,
      user: req.user.userId
    });

    await habit.save();

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      habit
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ 
      user: req.user.userId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      habits
    });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    Object.assign(habit, req.body);
    await habit.save();

    res.json({
      success: true,
      message: 'Habit updated successfully',
      habit
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const markHabitComplete = async (req, res) => {
  try {
    const { date } = req.body;
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    const completionDate = new Date(date);
    completionDate.setHours(0, 0, 0, 0);

    // Check if already completed today
    const existingCompletion = habit.completions.find(c => {
      const cDate = new Date(c.date);
      cDate.setHours(0, 0, 0, 0);
      return cDate.getTime() === completionDate.getTime();
    });

    if (existingCompletion) {
      existingCompletion.completed = !existingCompletion.completed;
    } else {
      habit.completions.push({
        date: completionDate,
        completed: true
      });
    }

    habit.updateStreak();
    await habit.save();

    res.json({
      success: true,
      message: 'Habit completion updated',
      habit
    });
  } catch (error) {
    console.error('Mark habit complete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit not found'
      });
    }

    habit.isActive = false;
    await habit.save();

    res.json({
      success: true,
      message: 'Habit deleted successfully'
    });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  updateHabit,
  markHabitComplete,
  deleteHabit
};
