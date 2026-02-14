// Set tracking module placeholder for set logging/progression helpers.
(function initSetTrackingModule() {
  window.WorkoutSetTracking = {
    readWeightValue(selectEl) {
      if (!selectEl) return 0;
      const raw = String(selectEl.value || '');
      if (raw === 'BW') return 'BW';
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : 0;
    }
  };
})();
