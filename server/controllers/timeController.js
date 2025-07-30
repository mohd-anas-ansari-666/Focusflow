const TimeSession = require('../models/TimeSession');
const { validationResult } = require('express-validator');

const startSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check for active session
    const activeSession = await TimeSession.findOne({
      user: req.user.userId,
      isCompleted: false
    });

    if (activeSession) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active session'
      });
    }

    const session = new TimeSession({
      ...req.body,
      user: req.user.userId,
      startTime: new Date()
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Session started successfully',
      session
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const endSession = async (req, res) => {
  try {
    const session = await TimeSession.findOne({
      _id: req.params.id,
      user: req.user.userId,
      isCompleted: false
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Active session not found'
      });
    }

    session.endTime = new Date();
    await session.save();

    res.json({
      success: true,
      message: 'Session ended successfully',
      session
    });
  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const filter = { user: req.user.userId };

    if (startDate && endDate) {
      filter.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    const sessions = await TimeSession.find(filter)
      .sort({ startTime: -1 })
      .limit(100);

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getActiveSession = async (req, res) => {
  try {
    const session = await TimeSession.findOne({
      user: req.user.userId,
      isCompleted: false
    });

    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get active session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getStats = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const sessions = await TimeSession.find({
      user: req.user.userId,
      isCompleted: true,
      startTime: { $gte: startDate }
    });

    const stats = {
      totalTime: sessions.reduce((sum, session) => sum + session.duration, 0),
      totalSessions: sessions.length,
      avgSessionLength: sessions.length ? 
        Math.round(sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length) : 0,
      categoryBreakdown: {},
      dailyTime: {}
    };

    // Category breakdown
    sessions.forEach(session => {
      if (!stats.categoryBreakdown[session.category]) {
        stats.categoryBreakdown[session.category] = 0;
      }
      stats.categoryBreakdown[session.category] += session.duration;
    });

    // Daily time breakdown
    sessions.forEach(session => {
      const date = session.startTime.toISOString().split('T')[0];
      if (!stats.dailyTime[date]) {
        stats.dailyTime[date] = 0;
      }
      stats.dailyTime[date] += session.duration;
    });

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  startSession,
  endSession,
  getSessions,
  getActiveSession,
  getStats
};
