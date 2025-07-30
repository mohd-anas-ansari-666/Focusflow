const mongoose = require('mongoose');

const timeSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['work', 'study', 'exercise', 'reading', 'coding', 'other'],
    default: 'other'
  },
  type: {
    type: String,
    enum: ['manual', 'pomodoro'],
    default: 'manual'
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  pomodoroSessions: {
    type: Number,
    default: 0
  },
  breaks: [{
    startTime: Date,
    endTime: Date,
    duration: Number
  }]
}, {
  timestamps: true
});

timeSessionSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60));
    this.isCompleted = true;
  }
  next();
});

module.exports = mongoose.model('TimeSession', timeSessionSchema);
