// State manager module placeholder for persistence/sync concerns.
(function initStateManagerModule() {
  window.WorkoutStateManager = {
    createStorageState(defaultFactory, key) {
      return {
        load() {
          try {
            const parsed = JSON.parse(localStorage.getItem(key));
            return parsed || defaultFactory();
          } catch (_) {
            return defaultFactory();
          }
        },
        save(nextState) {
          try {
            localStorage.setItem(key, JSON.stringify(nextState));
          } catch (_) {
            // ignore
          }
        }
      };
    }
  };
})();
