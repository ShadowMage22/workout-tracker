// Shared timer helpers for rest/section countdowns and elapsed stopwatch display.
(function initTimersModule() {
  const asNonNegativeNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(0, parsed);
  };

  const pad2 = (value) => String(value).padStart(2, '0');

  const formatMinutesSecondsFromSeconds = (totalSeconds = 0) => {
    const safeSeconds = Math.floor(asNonNegativeNumber(totalSeconds));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${pad2(minutes)}:${pad2(seconds)}`;
  };

  window.WorkoutTimers = {
    // Countdown timers should round up (ceil) so users never lose the final partial second.
    formatCountdownFromMs(ms = 0) {
      const totalSeconds = Math.ceil(asNonNegativeNumber(ms) / 1000);
      return formatMinutesSecondsFromSeconds(totalSeconds);
    },

    // Elapsed timers should round down (floor) so elapsed time only advances after a full second.
    formatElapsedFromMs(ms = 0) {
      const totalSeconds = Math.floor(asNonNegativeNumber(ms) / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (hours > 0) {
        return `${pad2(hours)}:${pad2(minutes)}`;
      }
      return `${pad2(minutes)}:${pad2(seconds)}`;
    },

    formatMinutesSecondsFromSeconds,

    parseDurationSeconds(value, fallback = 0) {
      return Math.floor(asNonNegativeNumber(value, fallback));
    }
  };
})();
