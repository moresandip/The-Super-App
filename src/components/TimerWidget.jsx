import React, { useState, useEffect, useRef } from "react";

const TimerWidget = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  const playBuzzer = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn("Buzzer audio playback error:", e);
    }
  };

  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            clearInterval(timerIntervalRef.current);
            playBuzzer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const handleStartTimer = () => {
    if (isTimerRunning) return;
    const computedTotal = (hours * 3600) + (minutes * 60) + seconds;
    if (computedTotal > 0) {
      setTotalSeconds(computedTotal);
      setTimeLeft(computedTotal);
      setIsTimerRunning(true);
    }
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleResumeTimer = () => {
    if (timeLeft > 0) {
      setIsTimerRunning(true);
    }
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTotalSeconds(0);
    setTimeLeft(0);
  };

  const formatTime = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="bg-widgetBg border border-white/5 rounded-3xl p-4 sm:p-5 flex flex-col gap-4 shadow-lg h-full justify-between">
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Circular Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="56" cy="56" r={radius} className="stroke-white/5 fill-transparent" strokeWidth="6" />
            <circle
              cx="56" cy="56" r={radius}
              className="stroke-accentNeon fill-transparent transition-all duration-1000 ease-linear"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-black font-mono leading-none">
              {formatTime(timeLeft > 0 ? timeLeft : (hours*3600 + minutes*60 + seconds))}
            </span>
            {timeLeft === 0 && !isTimerRunning && (
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">Idle</span>
            )}
            {isTimerRunning && (
              <span className="text-[9px] text-accentNeon font-bold uppercase tracking-wide mt-0.5 animate-pulse">Live</span>
            )}
            {timeLeft > 0 && !isTimerRunning && (
              <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-wide mt-0.5">Paused</span>
            )}
          </div>
        </div>

        {/* Selector Panel */}
        <div className="w-full flex-1 flex justify-between sm:justify-around items-center bg-white/5 border border-white/5 rounded-2xl px-3 py-3">
          {/* Hours */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Hr</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setHours(p => Math.max(0, p-1))} disabled={isTimerRunning}
                className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">−</button>
              <span className="text-sm font-black font-mono w-5 text-center">{hours}</span>
              <button onClick={() => setHours(p => Math.min(23, p+1))} disabled={isTimerRunning}
                className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">+</button>
            </div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Minutes */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Min</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setMinutes(p => Math.max(0, p-1))} disabled={isTimerRunning}
                className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">−</button>
              <span className="text-sm font-black font-mono w-5 text-center">{minutes}</span>
              <button onClick={() => setMinutes(p => Math.min(59, p+1))} disabled={isTimerRunning}
                className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">+</button>
            </div>
          </div>

          <div className="w-px h-8 bg-white/10" />

          {/* Seconds */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Sec</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setSeconds(p => Math.max(0, p-1))} disabled={isTimerRunning}
                className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">−</button>
              <span className="text-sm font-black font-mono w-5 text-center">{seconds}</span>
              <button onClick={() => setSeconds(p => Math.min(59, p+1))} disabled={isTimerRunning}
                className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Button Controls */}
      <div className="grid grid-cols-3 gap-2.5 mt-4">
        {!isTimerRunning ? (
          timeLeft > 0 ? (
            <button onClick={handleResumeTimer}
              className="bg-accentNeon text-black font-bold text-sm py-3 rounded-2xl active:scale-95 transition-all shadow-[0_0_12px_rgba(29,248,169,0.25)]">
              Resume
            </button>
          ) : (
            <button onClick={handleStartTimer}
              className="bg-accentNeon text-black font-bold text-sm py-3 rounded-2xl active:scale-95 transition-all shadow-[0_0_12px_rgba(29,248,169,0.25)]">
              Start
            </button>
          )
        ) : (
          <button onClick={handlePauseTimer}
            className="bg-yellow-400 text-black font-bold text-sm py-3 rounded-2xl active:scale-95 transition-all">
            Pause
          </button>
        )}

        <button onClick={handleResetTimer}
          className="bg-white/10 border border-white/10 text-white font-bold text-sm py-3 rounded-2xl hover:bg-white/20 active:scale-95 transition-all">
          Reset
        </button>

        <button
          onClick={() => { handleResetTimer(); setMinutes(1); }}
          disabled={isTimerRunning}
          className="bg-white/5 border border-white/10 text-gray-300 font-semibold text-sm py-3 rounded-2xl hover:bg-white/10 hover:text-white disabled:opacity-40 active:scale-95 transition-all">
          +1 Min
        </button>
      </div>
    </div>
  );
};

export default TimerWidget;
