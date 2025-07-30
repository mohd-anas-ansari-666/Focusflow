import { useState, useRef, useCallback, useEffect } from 'react';

export const useTimer = (initialTime = 0, onComplete) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (!isRunning && !isPaused) {
      setTime(initialTime);
    }
    setIsRunning(true);
    setIsPaused(false);
  }, [initialTime, isRunning, isPaused]);

  const pause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  // FIXED: Stop should just pause, not reset
  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true); // Changed from setIsPaused(false) - now it pauses instead of resetting
    // Removed setTime(initialTime) - this was causing the unwanted reset
  }, []);

  // Reset is the only function that should reset the timer
  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            onComplete?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, onComplete]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    time,
    isRunning,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
    formatTime: (t = time) => formatTime(t)
  };
};

export default useTimer;
