import React, { useState, useEffect } from 'react';
import { useTimer } from '../../hooks/useTimer';
import { Play, Pause, Square, RotateCcw, Settings, StopCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PomodoroTimer = () => {
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStart: false
  });
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const getTimerDuration = () => {
    switch (mode) {
      case 'work':
        return settings.workTime * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
      default:
        return settings.workTime * 60;
    }
  };

  const handleTimerComplete = () => {
    if (mode === 'work') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      
      if (newSessions % 4 === 0) {
        setMode('longBreak');
        toast.success('Great work! Time for a long break.');
      } else {
        setMode('shortBreak');
        toast.success('Pomodoro completed! Take a short break.');
      }
    } else {
      setMode('work');
      toast.success('Break over! Ready for another pomodoro?');
    }

    if (settings.autoStart) {
      setTimeout(() => start(), 1000);
    }
  };

  const {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
    formatTime
  } = useTimer(getTimerDuration(), handleTimerComplete);

  useEffect(() => {
    reset();
  }, [mode, settings, reset]);

  const progress = ((getTimerDuration() - time) / getTimerDuration()) * 100;

  const modeConfig = {
    work: {
      title: 'Focus Time',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    shortBreak: {
      title: 'Short Break',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    longBreak: {
      title: 'Long Break',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    }
  };

  const currentConfig = modeConfig[mode];

  return (
    <div className="max-w-md mx-auto">
      <div className={`card border-2 ${currentConfig.borderColor} ${currentConfig.bgColor} transition-colors duration-200`}>
        {/* Header - FIXED */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${currentConfig.color}`}>
            {currentConfig.title}
          </h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Display - FIXED */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={currentConfig.color}
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {/* FIXED: Timer text visibility in dark mode */}
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatTime()}
              </span>
            </div>
          </div>
        </div>

        {/* Controls - Already properly styled */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          {!isRunning && !isPaused && (
            <button
              onClick={start}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          )}

          {isRunning && (
            <button
              onClick={pause}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && !isRunning && (
            <button
              onClick={resume}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Resume</span>
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              onClick={stop}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              title="Pause timer"
            >
              <StopCircle className="w-5 h-5" />
              <span>Stop</span>
            </button>
          )}

          <button
            onClick={reset}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            disabled={!isPaused && !isRunning && time === getTimerDuration()}
            title="Reset timer to beginning"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Status Indicator - FIXED */}
        <div className="text-center mb-4">
          {isRunning && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              Running
            </span>
          )}
          {isPaused && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
              Paused
            </span>
          )}
          {!isRunning && !isPaused && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
              Ready
            </span>
          )}
        </div>

        {/* Mode Selector - FIXED */}
        <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-4 transition-colors duration-200">
          {Object.entries(modeConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                mode === key
                  ? `${config.color} bg-white dark:bg-gray-700 shadow-sm`
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {config.title}
            </button>
          ))}
        </div>

        {/* Sessions Counter - FIXED */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Completed Sessions: <span className="font-semibold text-gray-900 dark:text-white">{sessions}</span>
          </p>
        </div>

        {/* Settings Panel - FIXED */}
        {showSettings && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Timer Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Time (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.workTime}
                  onChange={(e) => setSettings({
                    ...settings,
                    workTime: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Short Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreak}
                  onChange={(e) => setSettings({
                    ...settings,
                    shortBreak: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Long Break (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreak}
                  onChange={(e) => setSettings({
                    ...settings,
                    longBreak: parseInt(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoStart"
                  checked={settings.autoStart}
                  onChange={(e) => setSettings({
                    ...settings,
                    autoStart: e.target.checked
                  })}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                />
                <label htmlFor="autoStart" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Auto-start next session
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroTimer;
