import React from 'react';
import PomodoroTimer from './PomodoroTimer';

const TimerPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Focus Timer</h1>
        <p className="text-gray-600">Use the Pomodoro technique to boost productivity</p>
      </div>
      
      <div className="flex justify-center">
        <PomodoroTimer />
      </div>
    </div>
  );
};

export default TimerPage;
