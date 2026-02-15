let deferredPrompt;
const installPromptEl = document.getElementById('installPrompt');
const installButton = document.getElementById('installButton');
const iosInstallHint = document.getElementById('iosInstallHint');

function isIosSafari() {
  const ua = navigator.userAgent;
  const isIosDevice = /iPad|iPhone|iPod/i.test(ua) || (ua.includes('Mac') && 'ontouchend' in document);
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Chrome/i.test(ua);
  return isIosDevice && isSafari;
}

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
}

function showInstallPrompt() {
  if (!installPromptEl) return;
  installPromptEl.classList.add('show');
}

function showIosInstallHint() {
  if (iosInstallHint) iosInstallHint.hidden = false;
  if (installButton) {
    installButton.disabled = true;
    installButton.hidden = true;
    installButton.setAttribute('aria-hidden', 'true');
  }
  showInstallPrompt();
}

const { exerciseMedia, applyMediaToVisual, applyMediaFromKeys, initLazyMedia } = window.WorkoutMedia;

window.addEventListener('beforeinstallprompt', (e) => {
  if (isIosSafari()) return;
  e.preventDefault();
  deferredPrompt = e;
  showInstallPrompt();
});

function installApp() {
  if (isIosSafari()) return;
  if (installPromptEl) {
    installPromptEl.classList.remove('show');
  }

  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
    });
  }
}

function hideInstallPrompt() {
  if (installPromptEl) {
    installPromptEl.classList.remove('show');
  }
}

// ---- PWA: Service Worker registration + Update UX + Hard Reset ----
(function initPwa() {
  if (!('serviceWorker' in navigator)) return;

  let refreshing = false;

  window.addEventListener('load', async () => {
    try {
      // IMPORTANT for GitHub Pages subpaths: use ./sw.js and scope './'
      const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });

      // If a SW is already waiting (e.g., user opened after you deployed), prompt immediately
      if (registration.waiting) {
        showUpdateBanner(registration);
      }

      // When an update is found, wait until it installs, then prompt the user
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version ready, old still controlling
            showUpdateBanner(registration);
          }
        });
      });

      // Optionally: proactively check for updates shortly after load
      // (helps when browser doesn't recheck often)
      setTimeout(() => registration.update().catch(() => {}), 3000);
    } catch (err) {
      console.log('Service worker registration failed', err);
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  function showUpdateBanner(registration) {
    if (document.getElementById('pwaUpdateBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'pwaUpdateBanner';
    banner.style.cssText = `
      position: fixed;
      left: 12px;
      right: 12px;
      bottom: 12px;
      z-index: 9999;
      background: #222;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
      font-size: 0.95rem;
    `;

    const msg = document.createElement('span');
    msg.textContent = 'Update available. Refresh to load the latest version.';

    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex; gap:8px;';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Cache';
    clearBtn.style.cssText = `
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      padding: 8px 12px;
      cursor: pointer;
    `;
    clearBtn.addEventListener('click', () => {
      clearCacheAndReload();
    });

    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh';
    refreshBtn.style.cssText = `
      background: #fff;
      color: #111;
      border: none;
      border-radius: 10px;
      padding: 8px 12px;
      font-weight: 600;
      cursor: pointer;
    `;
    refreshBtn.addEventListener('click', () => {
      // If a SW is waiting, tell it to activate now.
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    });

    const laterBtn = document.createElement('button');
    laterBtn.textContent = 'Later';
    laterBtn.style.cssText = `
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 10px;
      padding: 8px 12px;
      cursor: pointer;
    `;
    laterBtn.addEventListener('click', () => banner.remove());

    actions.appendChild(laterBtn);
    actions.appendChild(clearBtn);
    actions.appendChild(refreshBtn);

    banner.appendChild(msg);
    banner.appendChild(actions);

    document.body.appendChild(banner);
  }

  // Hard reset utility: unregister SWs + delete caches + cache-busted reload
  async function clearCacheAndReload() {
    try {
      // Unregister service workers
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));

      // Clear Cache Storage
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch (_) {
      // ignore
    } finally {
      const url = new URL(window.location.href);
      url.searchParams.set('cachebust', Date.now().toString());
      window.location.replace(url.toString());
    }
  }

  // Expose for optional manual UI wiring elsewhere
  window.clearCacheAndReload = clearCacheAndReload;
})();

const WORKOUT_DAY_IDS = ['push', 'pull', 'legs'];
const LAST_VIEWED_TAB_KEY = 'workoutTrackerLastViewedTab';

// Make tab switching resilient (exists even if later init code throws)
// ---- Tab navigation (resilient, no inline onclick required) ----
window.showDay = function showDay(dayId, tabBtn) {
  const day = document.getElementById(dayId);
  if (!day) return;

  document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  day.classList.add('active');

  if (tabBtn && tabBtn.classList) {
    tabBtn.classList.add('active');
  } else {
    const btn = document.querySelector(`.tab[data-day="${CSS.escape(dayId)}"]`);
    if (btn) btn.classList.add('active');
  }
  try {
    localStorage.setItem(LAST_VIEWED_TAB_KEY, dayId);
  } catch (_) {
    // ignore localStorage write errors
  }
  if (typeof window.loadActiveDayMedia === 'function') window.loadActiveDayMedia();
  if (typeof window.attachRestTimerToDay === 'function' && WORKOUT_DAY_IDS.includes(dayId)) {
    window.attachRestTimerToDay(dayId);
  }
  if (typeof window.attachStopwatchToDay === 'function' && WORKOUT_DAY_IDS.includes(dayId)) {
    window.attachStopwatchToDay(dayId);
  }
  if (typeof window.updateHistoryDay === 'function' && WORKOUT_DAY_IDS.includes(dayId)) {
    window.updateHistoryDay(dayId);
  }
  if (typeof window.applyProgressionHintsForDay === 'function' && WORKOUT_DAY_IDS.includes(dayId)) {
    window.applyProgressionHintsForDay(dayId);
  }
};

// Event delegation: works even if inline handlers fail
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab[data-day]');
  if (!btn) return;

  e.preventDefault();
  window.showDay(btn.dataset.day, btn);
});

document.addEventListener('click', (event) => {
  const cardToggle = event.target.closest('.exercise-card__toggle');
  if (cardToggle) {
    event.preventDefault();
    const card = cardToggle.closest('.exercise-card');
    if (!card) return;
    card.classList.toggle('is-collapsed');
    const isCollapsed = card.classList.contains('is-collapsed');
    cardToggle.setAttribute('aria-expanded', String(!isCollapsed));
    cardToggle.textContent = isCollapsed ? 'Expand' : 'Collapse';
    const exerciseId = card.dataset.exerciseId;
    if (exerciseId && window.setCardCollapsedState) {
      window.setCardCollapsedState(exerciseId, isCollapsed);
    }
    return;
  }

  const toggle = event.target.closest('.variants-toggle');
  if (toggle) {
    event.preventDefault();
    window.toggleVariants(toggle);
    return;
  }

  const option = event.target.closest('.variant-option');
  if (option) {
    event.preventDefault();
    window.selectVariant(option);
    return;
  }

  const visual = event.target.closest('.exercise-visual');
  if (visual) {
    const mediaKey = visual.dataset.mediaKey;
    const media = mediaKey ? exerciseMedia[mediaKey] : null;
    const url = visual.dataset.fullSrc || (media ? (media.imgFull || media.img) : null);
    if (!url) return;
    const img = visual.querySelector('img');
    window.expandMedia(event, url, img?.alt || 'Exercise demonstration');
  }
});

const {
  WORKOUT_DATA_URL,
  escapeHtml,
  buildInstructionString,
  buildInstructionHtml,
  setCoachTip,
  parseDurationFromTitle,
  parseInstructionDurationToSeconds,
  getPrepItemDurationSeconds,
  parseRestDurationToSeconds,
  getExerciseRestSeconds,
  EXERCISE_ITEM_SELECTOR,
  EXERCISE_CONTAINER_SELECTOR,
  renderWorkoutUI,
  loadWorkoutData
} = window.WorkoutUIController;

document.addEventListener('DOMContentLoaded', () => {
  if (isIosSafari() && !isStandaloneMode()) {
    showIosInstallHint();
  }
});

// ---- PWA: Service Worker registration + Update UX + Hard Reset ----
document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'workoutTrackerState';
  const STATE_VERSION = 2;
  const PROGRAM_VERSION = '2026-02-v2.6';
  const APP_PROGRAM_VERSION = PROGRAM_VERSION;
  const ACTIVE_TAB_KEY = 'workoutTrackerActiveTab';
  const ACTIVE_TAB_TTL_MS = 6000;
  const HISTORY_DB = 'workoutTrackerHistory';
  const HISTORY_DB_VERSION = 2;
  const HISTORY_STORE = 'sessions';
  const SESSION_SCHEMA_VERSION = 1;
  const TAB_ID = (window.crypto && window.crypto.randomUUID)
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel('workout-tracker') : null;
  const statusBanner = document.getElementById('statusBanner');
  const readOnlyBanner = document.getElementById('readOnlyBanner');
  const offlineBanner = document.getElementById('offlineBanner');
  const syncStatus = document.getElementById('syncStatus');
  const historyDayFilter = document.getElementById('historyDayFilter');
  const historyList = document.getElementById('historyList');
  const sectionTimerBanner = document.getElementById('sectionTimerBanner');
  const sectionTimerBannerLabel = document.getElementById('sectionTimerBannerLabel');
  const sectionTimerBannerStatus = document.getElementById('sectionTimerBannerStatus');
  const sectionTimerBannerTime = document.getElementById('sectionTimerBannerTime');
  const sectionBannerDismiss = document.getElementById('dismissSectionBanner');
  const sectionBannerStop = document.getElementById('stopSectionBanner');

  // In-memory working state (persisted to localStorage)
  let state = loadState();
  let isHydratingState = false;
  let isApplyingExternalState = false;
  let isReadOnly = false;
  let statusTimeoutId = null;
  let historyDbPromise = null;
  let lastSavedAt = null;
  const sectionTimerState = new WeakMap();
  let activeSectionTimer = null;
  let sectionBannerState = 'ready';
  let sectionBannerDismissed = false;

  const initApp = async () => {
    try {
      const data = await loadWorkoutData();
      renderWorkoutUI(data);
    } catch (error) {
      if (statusBanner) {
        statusBanner.textContent = 'Unable to load workout data. Please refresh or check your connection.';
        statusBanner.classList.add('show', 'warning');
      }
      console.error(error);
    }

    enhanceAccessibility();
    assignStableIds();
    applyMediaFromKeys();
    initLazyMedia();
    applyStateToUI();
    initConnectivityStatus();
    initCrossTabSync();
    initActiveTabTracking();
    initRestTimer();
    initWorkoutStopwatch();
    initPrepCardTimers();
    initSetTracking();
    initHistoryPanel();
    const storedDayId = (() => {
      try {
        return localStorage.getItem(LAST_VIEWED_TAB_KEY);
      } catch (_) {
        return null;
      }
    })();
    const initialDayId = WORKOUT_DAY_IDS.includes(storedDayId)
      ? storedDayId
      : (document.querySelector('.day.active')?.id || WORKOUT_DAY_IDS[0]);
    if (initialDayId) {
      window.showDay(initialDayId);
    }
  };

  initApp();

  // ---------- Public API ----------
  window.setCardCollapsedState = function(exerciseId, isCollapsed) {
    if (!exerciseId) return;
    state.collapsedCards[exerciseId] = Boolean(isCollapsed);
    if (!isHydratingState && !isApplyingExternalState) {
      persistState();
    }
  };

  window.clearChecks = function(dayId) {
    if (!ensureEditable()) return;
    const container = document.getElementById(dayId);
    if (!container) return;

    container.querySelectorAll('input[type="checkbox"]').forEach(c => {
      c.checked = false;
      const checkId = c.dataset.checkId;
      if (checkId) delete state.checkmarks[checkId];
    });

    resetSetStateForDay(dayId);
    container.querySelectorAll(EXERCISE_ITEM_SELECTOR).forEach(li => {
      const rows = li.querySelector('.set-rows');
      if (!rows) return;
      rows.innerHTML = '';
      populateRecommendedRows(rows);
      updateSetStateFromRows(rows);
    });
    persistState();
  };

  window.resetApp = async function(options = {}) {
    const { clearHistory = false } = options;
    const shouldReset = window.confirm('Reset the app and clear your saved progress? This cannot be undone.');
    if (!shouldReset) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_TAB_KEY);
      localStorage.removeItem(LAST_VIEWED_TAB_KEY);
    } catch (_) {
      // ignore
    }

    state = defaultState();
    persistState({ broadcast: true });
    if (clearHistory) {
      const shouldClearHistory = window.confirm('Delete workout history too? This cannot be undone.');
      if (shouldClearHistory) {
        await clearHistoryDb();
      }
    }

    if (typeof window.clearCacheAndReload === 'function') {
      window.clearCacheAndReload();
      return;
    }

    window.location.reload();
  };

  window.expandSVG = function(el) {
    const overlay = document.getElementById('svgOverlay');
    const container = document.getElementById('overlayContent');
    if (!overlay || !container || !el) return;
    container.innerHTML = el.innerHTML;
    overlay.classList.add('active');
  };

  window.toggleVariants = function(btn) {
    const exerciseItem = btn.closest(EXERCISE_CONTAINER_SELECTOR);
    const list = exerciseItem?.querySelector('.exercise-variants');
    if (!list) return;
    const day = btn.closest('.day');
    if (day) {
      day.querySelectorAll('.exercise-variants.active').forEach(openList => {
        if (openList !== list) {
          openList.classList.remove('active');
        }
      });
    }
    list.classList.toggle('active');
  };

  function getExerciseTitleElement(exerciseItem) {
    if (!exerciseItem) return null;
    return exerciseItem.querySelector('.exercise-card__title, .exercise-name');
  }

  function getExerciseTitleText(exerciseItem) {
    return getExerciseTitleElement(exerciseItem)?.textContent?.trim() || '';
  }

  window.selectVariant = function(option) {
    if (!ensureEditable({ allowIfReadOnly: isHydratingState || isApplyingExternalState })) return;
    const container = option.closest('.exercise-variants');
    const exerciseItem = option.closest(EXERCISE_CONTAINER_SELECTOR);
    if (!container || !exerciseItem) return;

    const nameEl = getExerciseTitleElement(exerciseItem);
    const instructionsEl = exerciseItem.querySelector('.instructions');
    const coachTip = exerciseItem.querySelector('.coach-tip');
    const videoLink = exerciseItem.querySelector('.video-link');
    const visualEl = exerciseItem.querySelector('.exercise-visual');
    const imgEl = visualEl ? visualEl.querySelector('img') : null;

    const mediaKey = option.dataset.mediaKey;
    const media = mediaKey ? exerciseMedia[mediaKey] : null;
    const isBaseOption = option.dataset.variantBase === 'true';

    if (nameEl) nameEl.textContent = option.dataset.name || nameEl.textContent;
    if (instructionsEl && option.dataset.instructions) {
      // Preserve existing display style while avoiding brittle parsing
      const normalized = option.dataset.instructions
        .split('|')
        .map(s => s.trim())
        .filter(Boolean)
        .map(line => {
          const idx = line.indexOf(':');
          if (idx === -1) return line;
          const k = line.slice(0, idx).trim();
          const v = line.slice(idx + 1).trim();
          return `<strong>${k}:</strong> ${v}`;
        })
        .join('<br>');
      instructionsEl.innerHTML = normalized;
    }
    if (coachTip) {
      setCoachTip(coachTip, option.dataset.coaching || '');
      if (option.dataset.coaching) {
        exerciseItem.dataset.coaching = option.dataset.coaching;
      }
    }
    if (option.dataset.recommendedSets) {
      exerciseItem.dataset.recommendedSets = option.dataset.recommendedSets;
    }
    const optionRestSeconds = Number.parseInt(option.dataset.restSeconds || '', 10);
    if (Number.isFinite(optionRestSeconds) && optionRestSeconds > 0) {
      exerciseItem.dataset.restSeconds = String(optionRestSeconds);
    } else {
      delete exerciseItem.dataset.restSeconds;
    }

    // Update media key on the exercise (single source of truth)
    if (visualEl && mediaKey) {
      visualEl.dataset.mediaKey = mediaKey;
    } else if (visualEl) {
      delete visualEl.dataset.mediaKey;
    }
    if (videoLink && mediaKey) {
      videoLink.dataset.mediaKey = mediaKey;
    } else if (videoLink) {
      delete videoLink.dataset.mediaKey;
    }

    if (media) {
      if (videoLink && media.video) videoLink.href = media.video;
      applyMediaToVisual(visualEl, imgEl, media, option.dataset.name || (imgEl ? imgEl.alt : 'Exercise demonstration'));
    } else {
      if (videoLink) videoLink.removeAttribute('href');
      applyMediaToVisual(visualEl, imgEl, null, option.dataset.name || (imgEl ? imgEl.alt : 'Exercise demonstration'));
    }

    // Persist selection by stable exercise id
    const exerciseId = exerciseItem.dataset.exerciseId;
    if (exerciseId && isBaseOption) {
      delete state.selections[exerciseId];
      if (!isHydratingState && !isApplyingExternalState) {
        persistState();
      }
    } else if (exerciseId && mediaKey) {
      state.selections[exerciseId] = mediaKey;
      if (!isHydratingState && !isApplyingExternalState) {
        persistState();
      }
    }

    container.classList.remove('active');
    container.querySelectorAll('.variant-option').forEach(v => v.classList.remove('selected'));
    option.classList.add('selected');

    const rows = exerciseItem.querySelector('.set-rows');
    if (rows && !rowsHaveValues(rows) && (!exerciseId || !state.sets[exerciseId])) {
      populateRecommendedRows(rows);
      updateSetStateFromRows(rows);
    }
  };

  // ---------- Event Wiring ----------
  document.addEventListener('change', function(e) {
    if (e.target && e.target.type === 'checkbox') {
      const checkableItemSelector = `${EXERCISE_ITEM_SELECTOR}, .prep-item`;

      const syncExerciseCompletionState = (exerciseItem, isChecked) => {
        if (!exerciseItem) return;

        exerciseItem.classList.toggle('exercise-completed', isChecked);

        const card = exerciseItem.closest('.exercise-card[data-exercise-id]');
        if (!card) return;

        const shouldCollapse = Boolean(isChecked);
        card.classList.toggle('is-collapsed', shouldCollapse);

        const toggleButton = card.querySelector('.exercise-card__toggle');
        if (toggleButton) {
          toggleButton.textContent = shouldCollapse ? 'Expand' : 'Collapse';
          toggleButton.setAttribute('aria-expanded', String(!shouldCollapse));
        }

        if (card.dataset.exerciseId && window.setCardCollapsedState) {
          window.setCardCollapsedState(card.dataset.exerciseId, shouldCollapse);
        }
      };

      const checkId = e.target.dataset.checkId;
      if (!checkId) return;
      if (!ensureEditable()) {
        e.target.checked = !!state.checkmarks[checkId];
        const exerciseItem = e.target.closest(checkableItemSelector);
        syncExerciseCompletionState(exerciseItem, e.target.checked);
        return;
      }
      if (e.target.checked) state.checkmarks[checkId] = true;
      else delete state.checkmarks[checkId];
      persistState();

      const exerciseItem = e.target.closest(checkableItemSelector);
      syncExerciseCompletionState(exerciseItem, e.target.checked);

      if (e.target.checked) {
        if (exerciseItem && exerciseItem.dataset.exerciseId && typeof window.startRestTimer === 'function') {
          const sourceExerciseId = exerciseItem.dataset.exerciseId;
          const sourceExerciseName = exerciseItem.querySelector('.exercise-card__title')?.textContent?.trim() || '';
          const durationSeconds = getExerciseRestSeconds(exerciseItem);
          window.startRestTimer({
            allowPrompt: false,
            exerciseId: sourceExerciseId,
            exerciseName: sourceExerciseName,
            durationSeconds
          });
        }
      }
    }
  });

  document.addEventListener('click', (event) => {
    const startBtn = event.target.closest('.section-timer .start-timer');
    if (startBtn) {
      event.preventDefault();
      startPrepCardTimer(startBtn.closest('.section-timer'));
      return;
    }
    const stopBtn = event.target.closest('.section-timer .stop-timer');
    if (stopBtn) {
      event.preventDefault();
      stopPrepCardTimer(stopBtn.closest('.section-timer'));
      return;
    }
  });

  // ---------- State + Media ----------
  function defaultState() {
    return {
      stateVersion: STATE_VERSION,
      programVersion: PROGRAM_VERSION,
      checkmarks: {},
      sets: {},
      selections: {},
      collapsedCards: {},
      lastUpdated: 0,
      lastUpdatedBy: null
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);

      if (!parsed || typeof parsed !== 'object') return defaultState();
      if (parsed.stateVersion !== STATE_VERSION || parsed.programVersion !== PROGRAM_VERSION) {
        return migrateState(parsed);
      }

      return normalizeState(parsed);
    } catch (_) {
      return defaultState();
    }
  }

  function persistState({ broadcast = true } = {}) {
    try {
      state.lastUpdated = Date.now();
      state.lastUpdatedBy = TAB_ID;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      lastSavedAt = state.lastUpdated;
      updateSyncStatus();
      if (broadcast && channel) {
        channel.postMessage({ type: 'state-update', state });
      }
    } catch (_) {
      // Ignore storage errors (private mode, quota, etc.)
    }
  }

  function normalizeState(parsed) {
    return {
      stateVersion: STATE_VERSION,
      programVersion: PROGRAM_VERSION,
      checkmarks: parsed.checkmarks && typeof parsed.checkmarks === 'object' ? parsed.checkmarks : {},
      sets: normalizeSets(parsed.sets),
      selections: parsed.selections && typeof parsed.selections === 'object' ? parsed.selections : {},
      collapsedCards: normalizeCollapsedCards(parsed.collapsedCards),
      lastUpdated: typeof parsed.lastUpdated === 'number' ? parsed.lastUpdated : 0,
      lastUpdatedBy: parsed.lastUpdatedBy || null
    };
  }


  function normalizeCollapsedCards(rawCollapsedCards) {
    if (!rawCollapsedCards || typeof rawCollapsedCards !== 'object') return {};
    const normalized = {};
    Object.entries(rawCollapsedCards).forEach(([exerciseId, isCollapsed]) => {
      normalized[exerciseId] = Boolean(isCollapsed);
    });
    return normalized;
  }

  function normalizeSets(rawSets) {
    if (!rawSets || typeof rawSets !== 'object') return {};
    const normalized = {};
    Object.entries(rawSets).forEach(([exerciseId, sets]) => {
      if (!Array.isArray(sets)) return;
      const cleaned = sets.map(set => {
        if (!set || typeof set !== 'object') return null;
        const reps = Number(set.reps || 0);
        const weight = set.weight === 'BW' ? 'BW' : Number(set.weight || 0);
        const hasWeight = weight === 'BW' || weight > 0;
        if (!reps && !hasWeight) return null;
        return {
          reps: reps || 0,
          weight: weight === 'BW' || weight > 0 ? weight : 0,
          completed: Boolean(set.completed)
        };
      }).filter(Boolean);
      if (cleaned.length) normalized[exerciseId] = cleaned;
    });
    return normalized;
  }

  function migrateState(parsed) {
    const migrated = normalizeState(parsed || {});
    showStatusMessage('We updated your program version. Your last saved selections were kept.', 6000);
    return migrated;
  }

  function normalizeHistorySessionRow(session, fallbackDayId) {
    if (!session || typeof session !== 'object') return null;
    const dateTs = Number(session.dateTs || Date.parse(session.date || '')) || Date.now();
    const normalizedExercises = Array.isArray(session.exercises)
      ? session.exercises.map((exercise, exerciseIndex) => {
        if (!exercise || typeof exercise !== 'object') return null;
        const sets = Array.isArray(exercise.sets)
          ? exercise.sets.map(set => {
            if (!set || typeof set !== 'object') return null;
            const reps = Number(set.reps || 0);
            const weight = set.weight === 'BW' ? 'BW' : Number(set.weight || 0);
            const hasWeight = weight === 'BW' || weight > 0;
            if (!reps && !hasWeight) return null;
            return {
              reps: reps || 0,
              weight: weight === 'BW' || weight > 0 ? weight : 0,
              completed: Boolean(set.completed)
            };
          }).filter(Boolean)
          : [];
        if (!sets.length) return null;
        return {
          exerciseId: exercise.exerciseId || `legacy-exercise-${exerciseIndex + 1}`,
          name: exercise.name || 'Exercise',
          sets
        };
      }).filter(Boolean)
      : [];

    return {
      id: session.id || `legacy-${session.dayId || fallbackDayId || 'day'}-${dateTs}`,
      schemaVersion: SESSION_SCHEMA_VERSION,
      appProgramVersion: typeof session.appProgramVersion === 'string' && session.appProgramVersion.trim()
        ? session.appProgramVersion
        : APP_PROGRAM_VERSION,
      dayId: session.dayId || fallbackDayId || 'push',
      date: session.date || new Date(dateTs).toISOString(),
      dateTs,
      exercises: normalizedExercises
    };
  }

  function showStatusMessage(message, timeoutMs = 4000) {
    if (!statusBanner) return;
    statusBanner.textContent = message;
    statusBanner.classList.add('show');
    if (statusTimeoutId) {
      window.clearTimeout(statusTimeoutId);
      statusTimeoutId = null;
    }
    if (timeoutMs > 0) {
      statusTimeoutId = window.setTimeout(() => {
        statusBanner.classList.remove('show');
        statusTimeoutId = null;
      }, timeoutMs);
    }
  }

  function formatTimer(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function updateSyncStatus({ message, state } = {}) {
    if (!syncStatus) return;
    const online = navigator.onLine;
    const statusText = message || (online ? 'Online • All changes saved' : 'Offline • Saved locally');
    syncStatus.textContent = statusText;
    syncStatus.dataset.state = state || (online ? 'online' : 'offline');
    if (lastSavedAt) {
      syncStatus.dataset.updated = new Date(lastSavedAt).toISOString();
    }
  }

  function setBannerVisibility(banner, shouldShow, message) {
    if (!banner) return;
    if (message) banner.textContent = message;
    banner.classList.toggle('show', shouldShow);
  }

  function initConnectivityStatus() {
    if (!offlineBanner) return;
    const update = () => {
      setBannerVisibility(offlineBanner, !navigator.onLine);
      updateSyncStatus();
    };
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
  }

  function initCrossTabSync() {
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const incoming = JSON.parse(event.newValue);
          applyIncomingState(incoming, 'storage');
        } catch (_) {
          // ignore malformed payload
        }
      }
      if (event.key === STORAGE_KEY && event.newValue === null) {
        state = defaultState();
        applyStateToUI();
        showStatusMessage('This session was reset in another tab.');
      }
      if (event.key === ACTIVE_TAB_KEY) {
        updateReadOnlyStatus();
      }
    });

    if (channel) {
      channel.addEventListener('message', (event) => {
        const payload = event.data;
        if (payload && payload.type === 'state-update') {
          applyIncomingState(payload.state, 'broadcast');
        }
      });
    }
  }

  function applyIncomingState(incoming, source) {
    const normalized = normalizeState(incoming || {});
    if (normalized.lastUpdatedBy === TAB_ID) return;
    if (normalized.lastUpdated <= state.lastUpdated) return;
    isApplyingExternalState = true;
    state = normalized;
    applyStateToUI();
    isApplyingExternalState = false;
    showStatusMessage(`Updated from another tab (${source}).`);
  }

  function initActiveTabTracking() {
    const heartbeat = () => {
      if (document.visibilityState !== 'visible') return;
      claimActiveTab();
    };
    window.addEventListener('focus', heartbeat);
    window.addEventListener('visibilitychange', heartbeat);
    window.addEventListener('pageshow', heartbeat);
    window.setInterval(heartbeat, ACTIVE_TAB_TTL_MS / 2);
    updateReadOnlyStatus();
    claimActiveTab();
  }

  function getActiveTabRecord() {
    try {
      return JSON.parse(localStorage.getItem(ACTIVE_TAB_KEY));
    } catch (_) {
      return null;
    }
  }

  function isAnotherTabActive() {
    const record = getActiveTabRecord();
    if (!record || !record.tabId || !record.lastActive) return false;
    if (record.tabId === TAB_ID) return false;
    return Date.now() - record.lastActive < ACTIVE_TAB_TTL_MS;
  }

  function claimActiveTab(force = false) {
    if (!force && isAnotherTabActive()) {
      setReadOnly(true);
      return false;
    }
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify({
        tabId: TAB_ID,
        lastActive: Date.now()
      }));
    } catch (_) {
      // ignore
    }
    setReadOnly(false);
    return true;
  }

  function setReadOnly(value) {
    isReadOnly = value;
    const message = isReadOnly
      ? 'Read-only: another tab is actively editing this workout.'
      : '';
    setBannerVisibility(readOnlyBanner, isReadOnly, message);
  }

  function updateReadOnlyStatus() {
    if (isAnotherTabActive()) {
      setReadOnly(true);
    } else {
      setReadOnly(false);
    }
  }

  function ensureEditable({ allowIfReadOnly = false } = {}) {
    if (allowIfReadOnly) return true;
    if (!isReadOnly) {
      claimActiveTab();
      return true;
    }
    if (claimActiveTab()) {
      return true;
    }
    showStatusMessage('Another tab is active. Switch to it to make edits.', 4000);
    return false;
  }

  function initWorkoutStopwatch() {
    const stopwatchTemplate = document.getElementById('workoutStopwatchTemplate');
    const stopwatchCard = stopwatchTemplate?.content?.firstElementChild
      ? stopwatchTemplate.content.firstElementChild.cloneNode(true)
      : document.querySelector('.workout-stopwatch');
    if (!stopwatchCard) return;

    const stopwatchDisplay = stopwatchCard.querySelector('#stopwatchDisplay');
    const toggleButton = stopwatchCard.querySelector('#toggleStopwatch');
    const resetButton = stopwatchCard.querySelector('#resetStopwatch');
    const statusPill = stopwatchCard.querySelector('.workout-stopwatch__pill');

    if (!stopwatchDisplay || !toggleButton || !resetButton || !statusPill) return;

    const storageKey = 'workoutStopwatchElapsed';
    let activeDayId = null;
    let persistedElapsed = {};
    const stopwatchState = {};

    try {
      persistedElapsed = JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch (_) {
      persistedElapsed = {};
    }

    const formatElapsed = (ms) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const ensureDayState = (dayId) => {
      if (!stopwatchState[dayId]) {
        stopwatchState[dayId] = {
          elapsedMs: Number(persistedElapsed[dayId]) || 0,
          isRunning: false,
          startedAt: null,
          intervalId: null
        };
      }
      return stopwatchState[dayId];
    };

    const saveElapsed = () => {
      const snapshot = {};
      WORKOUT_DAY_IDS.forEach((dayId) => {
        const state = stopwatchState[dayId];
        if (state) {
          snapshot[dayId] = state.elapsedMs;
        } else if (persistedElapsed[dayId]) {
          snapshot[dayId] = persistedElapsed[dayId];
        }
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify(snapshot));
      } catch (_) {
        // ignore storage errors
      }
    };

    const persistElapsedForDay = (dayId) => {
      const state = ensureDayState(dayId);
      if (state.isRunning) {
        state.elapsedMs = getElapsedMs(dayId);
        state.startedAt = Date.now();
      }
      saveElapsed();
    };

    const getElapsedMs = (dayId) => {
      const state = ensureDayState(dayId);
      const runningMs = state.isRunning && state.startedAt
        ? Date.now() - state.startedAt
        : 0;
      return state.elapsedMs + runningMs;
    };

    const updateStopwatchUI = (dayId) => {
      const state = ensureDayState(dayId);
      stopwatchDisplay.textContent = formatElapsed(getElapsedMs(dayId));
      const isRunning = state.isRunning;
      statusPill.dataset.state = isRunning ? 'running' : 'paused';
      statusPill.textContent = isRunning ? 'Running' : 'Paused';
      toggleButton.textContent = isRunning ? 'Pause' : 'Start';
    };

    const startStopwatch = (dayId) => {
      const state = ensureDayState(dayId);
      if (state.isRunning) return;
      state.isRunning = true;
      state.startedAt = Date.now();
      state.intervalId = window.setInterval(() => {
        if (dayId === activeDayId) {
          updateStopwatchUI(dayId);
        }
        persistElapsedForDay(dayId);
      }, 1000);
      updateStopwatchUI(dayId);
    };

    const pauseStopwatch = (dayId) => {
      const state = ensureDayState(dayId);
      if (!state.isRunning) return;
      state.elapsedMs = getElapsedMs(dayId);
      state.isRunning = false;
      state.startedAt = null;
      if (state.intervalId) {
        window.clearInterval(state.intervalId);
        state.intervalId = null;
      }
      saveElapsed();
      updateStopwatchUI(dayId);
    };

    const resetStopwatch = (dayId) => {
      const state = ensureDayState(dayId);
      state.elapsedMs = 0;
      if (state.isRunning) {
        state.startedAt = Date.now();
      }
      saveElapsed();
      updateStopwatchUI(dayId);
    };

    toggleButton.addEventListener('click', () => {
      if (!activeDayId) return;
      const state = ensureDayState(activeDayId);
      if (state.isRunning) {
        pauseStopwatch(activeDayId);
      } else {
        startStopwatch(activeDayId);
      }
    });

    resetButton.addEventListener('click', () => {
      if (!activeDayId) return;
      resetStopwatch(activeDayId);
    });

    window.addEventListener('beforeunload', () => {
      if (activeDayId) {
        persistElapsedForDay(activeDayId);
      }
    });

    const attachStopwatchToDay = (dayId) => {
      const day = document.getElementById(dayId);
      if (!day) return;
      if (!WORKOUT_DAY_IDS.includes(dayId)) return;
      if (stopwatchCard.parentElement === day) {
        activeDayId = dayId;
        updateStopwatchUI(dayId);
        return;
      }
      const restTimer = day.querySelector('.rest-timer');
      if (restTimer && restTimer.parentElement === day) {
        day.insertBefore(stopwatchCard, restTimer.nextSibling);
      } else {
        const heading = day.querySelector('h2');
        if (heading && heading.nextSibling) {
          day.insertBefore(stopwatchCard, heading.nextSibling);
        } else if (heading) {
          day.appendChild(stopwatchCard);
        } else {
          day.prepend(stopwatchCard);
        }
      }
      activeDayId = dayId;
      updateStopwatchUI(dayId);
    };

    const initialDay = document.querySelector('.day.active')?.id || WORKOUT_DAY_IDS[0];
    if (initialDay) {
      attachStopwatchToDay(initialDay);
    }
    window.attachStopwatchToDay = attachStopwatchToDay;
  }

  function initRestTimer() {
    const restTemplate = document.getElementById('restTimerTemplate');
    const restTimerCard = restTemplate?.content?.firstElementChild
      ? restTemplate.content.firstElementChild.cloneNode(true)
      : document.querySelector('.rest-timer');
    if (!restTimerCard) return;

    const restDurationSelect = restTimerCard.querySelector('#restDuration');
    const restStatus = restTimerCard.querySelector('#restStatus');
    const restTimeDisplay = restTimerCard.querySelector('#restTimeDisplay');
    const restPill = restTimerCard.querySelector('#restPill');
    const startButton = restTimerCard.querySelector('#startRestTimer');
    const stopButton = restTimerCard.querySelector('#stopRestTimer');
    const notifyButton = restTimerCard.querySelector('#enableRestNotifications');
    const restSoundToggle = restTimerCard.querySelector('#restSoundToggle');
    const restVibrateToggle = restTimerCard.querySelector('#restVibrateToggle');
    const restVibrateToggleWrap = restTimerCard.querySelector('#restVibrateToggleWrap');
    const restBanner = document.getElementById('restTimerBanner');
    const restBannerStatus = document.getElementById('restTimerBannerStatus');
    const restBannerTime = document.getElementById('restTimerBannerTime');
    const restBannerDismiss = document.getElementById('dismissRestBanner');
    const restBannerStop = document.getElementById('stopRestBanner');

    if (!restDurationSelect || !restStatus || !restTimeDisplay || !restPill || !startButton || !stopButton || !notifyButton) {
      return;
    }

    const attachRestTimerToDay = (dayId) => {
      const day = document.getElementById(dayId);
      if (!day) return;
      if (!WORKOUT_DAY_IDS.includes(dayId)) return;
      if (restTimerCard.parentElement === day) return;
      const heading = day.querySelector('h2');
      if (heading && heading.nextSibling) {
        day.insertBefore(restTimerCard, heading.nextSibling);
      } else if (heading) {
        day.appendChild(restTimerCard);
      } else {
        day.prepend(restTimerCard);
      }
    };

    const initialDay = document.querySelector('.day.active')?.id || WORKOUT_DAY_IDS[0];
    if (initialDay) {
      attachRestTimerToDay(initialDay);
    }
    window.attachRestTimerToDay = attachRestTimerToDay;

    let intervalId = null;
    let endTime = null;
    let bannerState = 'ready';
    let bannerDismissed = false;
    const soundPrefKey = 'restSoundEnabled';
    const vibratePrefKey = 'restVibrateEnabled';
    let audioContext = null;
    let currentRestContext = null;

    const playRestBeep = () => {
      if (!restSoundToggle?.checked) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioContext) {
        audioContext = new AudioContext();
      }
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.value = 0.15;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.25);
    };

    const formatMs = (ms) => {
      const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const setBannerVisibility = (shouldShow) => {
      if (!restBanner) return;
      restBanner.classList.toggle('show', shouldShow);
      restBanner.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
    };

    const updateBannerState = ({ state, statusText, timeText } = {}) => {
      if (state) bannerState = state;
      if (typeof statusText === 'string' && restBannerStatus) {
        restBannerStatus.textContent = statusText;
      }
      if (typeof timeText === 'string' && restBannerTime) {
        restBannerTime.textContent = timeText;
      }
      if (bannerState === 'running') {
        setBannerVisibility(!bannerDismissed);
      } else if (bannerState === 'done') {
        setBannerVisibility(!bannerDismissed);
      } else {
        setBannerVisibility(false);
      }
    };

    const updateRestStatus = (message) => {
      restStatus.textContent = message;
      updateBannerState({ statusText: message });
    };

    const setPillState = (state) => {
      restPill.classList.remove('running', 'done');
      if (state === 'running') restPill.classList.add('running');
      if (state === 'done') restPill.classList.add('done');
      restPill.textContent = state === 'running' ? 'Running' : state === 'done' ? 'Done' : 'Ready';
    };

    const updateButtons = (isRunning) => {
      startButton.disabled = isRunning;
      stopButton.disabled = !isRunning;
      restDurationSelect.disabled = isRunning;
    };

    const renderTime = () => {
      let timeText = '';
      if (!endTime) {
        const durationMs = Number(restDurationSelect.value || 60) * 1000;
        timeText = formatMs(durationMs);
        restTimeDisplay.textContent = timeText;
        updateBannerState({ timeText });
        return;
      }
      const remainingMs = endTime - Date.now();
      timeText = formatMs(remainingMs);
      restTimeDisplay.textContent = timeText;
      updateBannerState({ timeText });
    };

    const triggerCompletionEffects = () => {
      playRestBeep();
      if (restVibrateToggle?.checked && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }
    };

    const finishTimer = ({ completed = false } = {}) => {
      if (intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
      endTime = null;
      currentRestContext = null;
      updateButtons(false);
      setPillState(completed ? 'done' : 'ready');
      bannerDismissed = completed ? false : bannerDismissed;
      updateRestStatus(completed
        ? 'Rest complete. Ready for your next set or session.'
        : 'Rest timer stopped.');
      updateBannerState({ state: completed ? 'done' : 'ready' });
      if (completed) {
        triggerCompletionEffects();
      }
      renderTime();
    };

    const maybeNotify = () => {
      if (!('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;
      new Notification('Rest finished', {
        body: 'Time to start your next set or move to the next exercise.',
        tag: 'rest-timer'
      });
    };

    const tick = () => {
      if (!endTime) return;
      const remainingMs = endTime - Date.now();
      if (remainingMs <= 0) {
        finishTimer({ completed: true });
        maybeNotify();
        return;
      }
      const restContextLabel = currentRestContext?.label || '';
      updateRestStatus(`Resting${restContextLabel ? ` after ${restContextLabel}` : ''}… ${formatMs(remainingMs)} remaining.`);
      renderTime();
    };

    const startTimer = async ({
      allowPrompt = true,
      durationSeconds,
      exerciseId,
      exerciseName,
      setIndex,
      sourceExerciseId,
      sourceExerciseName
    } = {}) => {
      if (endTime) return;
      const hasCustomDuration = Number.isFinite(Number(durationSeconds)) && Number(durationSeconds) > 0;
      const durationMs = hasCustomDuration
        ? Number(durationSeconds) * 1000
        : Number(restDurationSelect.value || 60) * 1000;
      if (!durationMs) return;
      if (allowPrompt && 'Notification' in window && Notification.permission === 'default') {
        await requestNotificationPermission();
      }
      if (intervalId) window.clearInterval(intervalId);
      if (hasCustomDuration && restDurationSelect) {
        const durationValue = String(Number(durationSeconds));
        if ([...restDurationSelect.options].some((option) => option.value === durationValue)) {
          restDurationSelect.value = durationValue;
        }
      }
      endTime = Date.now() + durationMs;
      setPillState('running');
      updateButtons(true);
      bannerDismissed = false;
      updateBannerState({ state: 'running' });
      const resolvedExerciseId = exerciseId || sourceExerciseId;
      const resolvedExerciseName = exerciseName || sourceExerciseName;
      const resolvedSetIndex = Number.isFinite(Number(setIndex)) && Number(setIndex) > 0
        ? Number(setIndex)
        : null;
      const contextLabel = resolvedExerciseName
        ? `${resolvedExerciseName}${resolvedSetIndex ? ` (Set ${resolvedSetIndex})` : ''}`
        : '';
      currentRestContext = {
        exerciseId: resolvedExerciseId || '',
        exerciseName: resolvedExerciseName || '',
        setIndex: resolvedSetIndex,
        label: contextLabel
      };
      if (resolvedExerciseId) {
        restTimerCard.dataset.sourceExerciseId = resolvedExerciseId;
      } else {
        delete restTimerCard.dataset.sourceExerciseId;
      }
      updateRestStatus(`Resting${contextLabel ? ` after ${contextLabel}` : ''}…`);
      renderTime();
      intervalId = window.setInterval(tick, 500);
    };

    const requestNotificationPermission = async () => {
      if (!('Notification' in window)) {
        updateRestStatus('Notifications are not supported in this browser.');
        notifyButton.disabled = true;
        return;
      }
      if (Notification.permission === 'granted') {
        updateRestStatus('Notifications are enabled for rest alerts.');
        notifyButton.disabled = true;
        return;
      }
      const result = await Notification.requestPermission();
      if (result === 'granted') {
        updateRestStatus('Notifications enabled. You will get a rest alert.');
        notifyButton.disabled = true;
      } else {
        updateRestStatus('Notifications blocked. Enable them in your browser settings to get rest alerts.');
      }
    };

    restDurationSelect.addEventListener('change', () => {
      if (!endTime) renderTime();
    });
    startButton.addEventListener('click', () => startTimer());
    stopButton.addEventListener('click', () => finishTimer());
    notifyButton.addEventListener('click', requestNotificationPermission);
    restBannerDismiss?.addEventListener('click', () => {
      bannerDismissed = true;
      updateBannerState({ state: bannerState });
    });
    restBannerStop?.addEventListener('click', () => {
      if (endTime) {
        finishTimer({ completed: false });
      }
      updateBannerState({ state: 'ready' });
    });

    const loadPreference = (key, fallback = false) => {
      try {
        const value = window.localStorage.getItem(key);
        if (value === null) return fallback;
        return value === 'true';
      } catch (_) {
        return fallback;
      }
    };

    const savePreference = (key, value) => {
      try {
        window.localStorage.setItem(key, String(value));
      } catch (_) {
        // ignore
      }
    };

    if (restSoundToggle) {
      restSoundToggle.checked = loadPreference(soundPrefKey, false);
      restSoundToggle.addEventListener('change', () => {
        savePreference(soundPrefKey, restSoundToggle.checked);
      });
    }

    if (restVibrateToggle) {
      const canVibrate = 'vibrate' in navigator;
      if (!canVibrate && restVibrateToggleWrap) {
        restVibrateToggleWrap.hidden = true;
      }
      restVibrateToggle.checked = loadPreference(vibratePrefKey, false);
      restVibrateToggle.addEventListener('change', () => {
        savePreference(vibratePrefKey, restVibrateToggle.checked);
      });
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      notifyButton.disabled = true;
      updateRestStatus('Notifications are enabled for rest alerts.');
    }
    setPillState('ready');
    updateBannerState({ state: 'ready', statusText: 'Ready' });
    renderTime();
    window.startRestTimer = (options = {}) => startTimer(options);
  }

  function setSectionBannerVisibility(shouldShow) {
    if (!sectionTimerBanner) return;
    sectionTimerBanner.classList.toggle('show', shouldShow);
    sectionTimerBanner.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  }

  function getSectionBannerLabel(timerEl) {
    const exerciseName = timerEl?.dataset?.exerciseName?.trim();
    if (exerciseName) return exerciseName;
    return 'Exercise Timer';
  }

  function updateSectionBannerState({ timerEl, state, statusText, timeText } = {}) {
    if (timerEl) activeSectionTimer = timerEl;
    if (state) sectionBannerState = state;
    if (timerEl && sectionTimerBannerLabel) {
      sectionTimerBannerLabel.textContent = getSectionBannerLabel(timerEl);
    }
    if (typeof statusText === 'string' && sectionTimerBannerStatus) {
      sectionTimerBannerStatus.textContent = statusText;
    }
    if (typeof timeText === 'string' && sectionTimerBannerTime) {
      sectionTimerBannerTime.textContent = timeText;
    }
    if (sectionBannerState === 'running' || sectionBannerState === 'done') {
      setSectionBannerVisibility(!sectionBannerDismissed);
    } else {
      setSectionBannerVisibility(false);
    }
  }

  function clearSectionBanner() {
    activeSectionTimer = null;
    sectionBannerState = 'ready';
    sectionBannerDismissed = false;
    setSectionBannerVisibility(false);
  }

  function initPrepCardTimers() {
    document.querySelectorAll('.section-timer').forEach(timer => {
      if (timer.dataset.initialized === 'true') return;
      timer.dataset.initialized = 'true';
      const durationSeconds = Number(timer.dataset.duration || 0);
      const display = timer.querySelector('.timer-display');
      if (display) {
        display.textContent = formatTimer(durationSeconds * 1000);
      }
      setSectionTimerState(timer, 'ready');
    });

    if (sectionBannerDismiss) {
      sectionBannerDismiss.addEventListener('click', () => {
        sectionBannerDismissed = true;
        updateSectionBannerState({ state: sectionBannerState });
      });
    }

    if (sectionBannerStop) {
      sectionBannerStop.addEventListener('click', () => {
        if (activeSectionTimer) {
          stopPrepCardTimer(activeSectionTimer, { completed: false });
        }
        clearSectionBanner();
      });
    }
  }

  function setSectionTimerState(timerEl, state) {
    if (!timerEl) return;
    const pill = timerEl.querySelector('.section-timer-pill');
    if (!pill) return;
    pill.classList.remove('running', 'done');
    if (state === 'running') pill.classList.add('running');
    if (state === 'done') pill.classList.add('done');
    const stateLabel = state === 'running' ? 'Running' : state === 'done' ? 'Done' : 'Ready';
    pill.textContent = stateLabel;
    pill.dataset.state = state;
    pill.setAttribute('aria-label', `Timer status: ${stateLabel}`);
    timerEl.dataset.state = state;
  }

  function startPrepCardTimer(timerEl) {
    if (!timerEl) return;
    if (sectionTimerState.has(timerEl)) return;
    if (activeSectionTimer && activeSectionTimer !== timerEl && sectionTimerState.has(activeSectionTimer)) {
      stopPrepCardTimer(activeSectionTimer, { completed: false });
    }
    const durationSeconds = Number(timerEl.dataset.duration || 0);
    if (!durationSeconds) return;
    const display = timerEl.querySelector('.timer-display');
    const startButton = timerEl.querySelector('.start-timer');
    const stopButton = timerEl.querySelector('.stop-timer');
    const endTime = Date.now() + durationSeconds * 1000;
    sectionBannerDismissed = false;
    updateSectionBannerState({
      timerEl,
      state: 'running',
      statusText: 'Running',
      timeText: formatTimer(durationSeconds * 1000)
    });
    const intervalId = window.setInterval(() => {
      const remaining = endTime - Date.now();
      if (display) display.textContent = formatTimer(remaining);
      updateSectionBannerState({
        timerEl,
        state: 'running',
        statusText: 'Running',
        timeText: formatTimer(remaining)
      });
      if (remaining <= 0) {
        stopPrepCardTimer(timerEl, { completed: true });
      }
    }, 500);
    sectionTimerState.set(timerEl, { intervalId, endTime });
    if (startButton) startButton.disabled = true;
    if (stopButton) stopButton.disabled = false;
    if (display) display.textContent = formatTimer(durationSeconds * 1000);
    setSectionTimerState(timerEl, 'running');
  }

  function stopPrepCardTimer(timerEl, { completed = false } = {}) {
    const state = sectionTimerState.get(timerEl);
    if (state?.intervalId) {
      window.clearInterval(state.intervalId);
    }
    sectionTimerState.delete(timerEl);
    const durationSeconds = Number(timerEl?.dataset?.duration || 0);
    const display = timerEl?.querySelector('.timer-display');
    if (display) {
      display.textContent = formatTimer(completed ? 0 : durationSeconds * 1000);
    }
    const startButton = timerEl?.querySelector('.start-timer');
    const stopButton = timerEl?.querySelector('.stop-timer');
    if (startButton) startButton.disabled = false;
    if (stopButton) stopButton.disabled = true;
    setSectionTimerState(timerEl, completed ? 'done' : 'ready');
    if (timerEl && activeSectionTimer === timerEl) {
      if (completed) {
        sectionBannerDismissed = false;
        updateSectionBannerState({
          timerEl,
          state: 'done',
          statusText: 'Done',
          timeText: formatTimer(0)
        });
      } else {
        updateSectionBannerState({
          timerEl,
          state: 'ready',
          statusText: 'Ready',
          timeText: formatTimer(durationSeconds * 1000)
        });
        clearSectionBanner();
      }
    }
  }

  function parseRecommendedSets(setsText) {
    if (!setsText || typeof setsText !== 'string') return null;
    const match = setsText.match(/(\d+)\s*[x×]\s*(\d+)(?:\s*[-–]\s*(\d+))?/i);
    if (!match) return null;
    const setCount = Number(match[1] || 0);
    const minReps = Number(match[2] || 0);
    const maxReps = Number(match[3] || match[2] || 0);
    if (!setCount || !minReps) return null;
    return { setCount, minReps, maxReps };
  }

  function getRecommendedSetRows(exerciseItem) {
    const recommendation = parseRecommendedSets(exerciseItem?.dataset?.recommendedSets || '');
    if (!recommendation) return [];
    return Array.from({ length: recommendation.setCount }, () => ({
      reps: recommendation.minReps
    }));
  }

  function populateRecommendedRows(rows) {
    if (!rows) return;
    const exerciseItem = rows.closest(EXERCISE_ITEM_SELECTOR);
    const recommended = getRecommendedSetRows(exerciseItem);
    rows.innerHTML = '';
    if (recommended.length > 0) {
      recommended.forEach(setData => addSetRow(rows, setData));
    } else {
      addSetRow(rows);
    }
  }

  function readWeightValue(weightSelect) {
    const rawValue = weightSelect?.value;
    if (!rawValue) return 0;
    if (rawValue === 'BW') return 'BW';
    const parsed = Number(rawValue);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function rowsHaveValues(rows) {
    return Array.from(rows?.querySelectorAll('.set-row') || []).some(row => {
      const repsValue = Number(row.querySelector('.set-reps')?.value || 0);
      const weightValue = readWeightValue(row.querySelector('.set-weight'));
      return repsValue > 0 || weightValue === 'BW' || weightValue > 0;
    });
  }

  function initSetTracking() {
    document.querySelectorAll(EXERCISE_ITEM_SELECTOR).forEach(li => {
      if (li.querySelector('.set-tracker')) return;
      const trackerHost = li.querySelector('.exercise-card__body') || li;
      const tracker = document.createElement('div');
      tracker.className = 'set-tracker';
      tracker.innerHTML = `
        <h4>Log sets (reps / weight)</h4>
        <div class="set-rows"></div>
        <div class="set-actions">
          <button type="button" class="add-set">Add set</button>
          <button type="button" class="clear-sets">Clear sets</button>
        </div>
      `;
      trackerHost.appendChild(tracker);

      const rows = tracker.querySelector('.set-rows');
      populateRecommendedRows(rows);

      tracker.querySelector('.add-set').addEventListener('click', () => {
        if (!ensureEditable()) return;
        addSetRow(rows);
      });
      tracker.querySelector('.clear-sets').addEventListener('click', () => {
        if (!ensureEditable()) return;
        populateRecommendedRows(rows);
        updateSetStateFromRows(rows);
      });
      rows.addEventListener('change', (event) => {
        if (!event.target.matches('.set-reps, .set-weight, .set-completed')) return;
        if (!ensureEditable()) {
          applyStateToUI();
          return;
        }
        if (event.target.matches('.set-completed')) {
          const row = event.target.closest('.set-row');
          if (row) toggleSetRowCompleted(row, event.target.checked);
          if (event.target.checked && typeof window.startRestTimer === 'function') {
            const durationSeconds = getExerciseRestSeconds(li);
            const exerciseName = li.querySelector('.exercise-card__title')?.textContent?.trim() || '';
            const setRows = Array.from(rows.querySelectorAll('.set-row'));
            const setIndex = row ? setRows.indexOf(row) + 1 : null;
            window.startRestTimer({
              allowPrompt: false,
              exerciseId: li.dataset.exerciseId,
              exerciseName,
              setIndex: setIndex > 0 ? setIndex : undefined,
              durationSeconds
            });
          }
        }
        updateSetStateFromRows(rows);
      });
      rows.addEventListener('click', (event) => {
        const btn = event.target.closest('.remove-set');
        if (!btn) return;
        if (!ensureEditable()) return;
        const row = btn.closest('.set-row');
        if (row) row.remove();
        if (!rows.querySelector('.set-row')) addSetRow(rows);
        updateSetStateFromRows(rows);
      });
    });

    document.querySelectorAll('.save-session').forEach(button => {
      button.addEventListener('click', () => {
        const dayId = button.dataset.day;
        if (!dayId) return;
        saveSession(dayId);
      });
    });
  }

  function toggleSetRowCompleted(row, isCompleted) {
    if (!row) return;
    row.classList.toggle('is-completed', Boolean(isCompleted));
  }

  function addSetRow(container, setData = {}) {
    if (!container) return;
    const repsOptions = Array.from({ length: 20 }, (_, idx) => idx + 1);
    const weightOptions = ['BW', ...Array.from({ length: 81 }, (_, idx) => Number((idx * 2.5).toFixed(1)))];
    const row = document.createElement('div');
    row.className = 'set-row';
    row.innerHTML = `
      <input type="checkbox" class="set-completed" aria-label="Set completed">
      <select class="set-reps" aria-label="Reps">
        <option value="" selected disabled>Reps</option>
        ${repsOptions.map(value => `<option value="${value}">${value}</option>`).join('')}
      </select>
      <select class="set-weight" aria-label="Weight">
        <option value="" selected disabled>Weight</option>
        ${weightOptions.map(value => value === 'BW'
    ? '<option value="BW">Bodyweight</option>'
    : `<option value="${value}">${value}</option>`).join('')}
      </select>
      <button type="button" class="remove-set" aria-label="Remove set">×</button>
    `;
    container.appendChild(row);

    const completedInput = row.querySelector('.set-completed');
    if (completedInput) {
      completedInput.checked = Boolean(setData.completed);
      toggleSetRowCompleted(row, completedInput.checked);
    }
    if (typeof setData.reps === 'number' && setData.reps > 0) {
      const repsSelect = row.querySelector('.set-reps');
      if (repsSelect) repsSelect.value = String(setData.reps);
    }
    if (setData.weight === 'BW') {
      const weightSelect = row.querySelector('.set-weight');
      if (weightSelect) weightSelect.value = 'BW';
    } else if (typeof setData.weight === 'number' && setData.weight > 0) {
      const weightSelect = row.querySelector('.set-weight');
      if (weightSelect) weightSelect.value = String(setData.weight);
    }
  }

  function updateSetStateFromRows(rows) {
    const exerciseId = rows?.closest(EXERCISE_ITEM_SELECTOR)?.dataset.exerciseId;
    if (!exerciseId) return;
    const sets = Array.from(rows.querySelectorAll('.set-row')).map(row => {
      const repsValue = Number(row.querySelector('.set-reps')?.value || 0);
      const weightValue = readWeightValue(row.querySelector('.set-weight'));
      const completed = row.querySelector('.set-completed')?.checked;
      const hasWeight = weightValue === 'BW' || weightValue > 0;
      if (!repsValue && !hasWeight) return null;
      return {
        reps: repsValue || 0,
        weight: weightValue || 0,
        completed: Boolean(completed)
      };
    }).filter(Boolean);

    if (sets.length > 0) {
      state.sets[exerciseId] = sets;
    } else {
      delete state.sets[exerciseId];
    }

    if (!isHydratingState && !isApplyingExternalState) {
      persistState();
    }
  }

  function initHistoryPanel() {
    if (!historyDayFilter || !historyList) return;
    const activeDay = document.querySelector('.day.active');
    if (activeDay && activeDay.id && WORKOUT_DAY_IDS.includes(activeDay.id)) {
      historyDayFilter.value = activeDay.id;
    }
    historyDayFilter.addEventListener('change', () => {
      renderHistory(historyDayFilter.value);
    });
    renderHistory(historyDayFilter.value || 'push');
    window.updateHistoryDay = (dayId) => {
      if (!historyDayFilter) return;
      historyDayFilter.value = dayId;
      renderHistory(dayId);
    };
  }

  function getHistoryDb() {
    if (!('indexedDB' in window)) return Promise.reject(new Error('IndexedDB unavailable'));
    if (!historyDbPromise) {
      historyDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(HISTORY_DB, HISTORY_DB_VERSION);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const tx = event.target.transaction;
          let store;
          if (!db.objectStoreNames.contains(HISTORY_STORE)) {
            store = db.createObjectStore(HISTORY_STORE, { keyPath: 'id' });
          } else {
            store = tx.objectStore(HISTORY_STORE);
          }
          if (!store.indexNames.contains('by-day')) {
            store.createIndex('by-day', 'dayId', { unique: false });
          }
          if (!store.indexNames.contains('by-date')) {
            store.createIndex('by-date', 'dateTs', { unique: false });
          }

          if (event.oldVersion < 2) {
            const cursorRequest = store.openCursor();
            cursorRequest.onsuccess = () => {
              const cursor = cursorRequest.result;
              if (!cursor) return;
              const row = cursor.value;
              if (typeof row.schemaVersion !== 'number' || !row.appProgramVersion) {
                const normalizedRow = normalizeHistorySessionRow(row);
                if (normalizedRow) {
                  cursor.update(normalizedRow);
                }
              }
              cursor.continue();
            };
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
    return historyDbPromise;
  }

  function saveSession(dayId) {
    const day = document.getElementById(dayId);
    if (!day) return;
    const exerciseEntries = [];
    day.querySelectorAll(EXERCISE_ITEM_SELECTOR).forEach(li => {
      const name = getExerciseTitleText(li);
      const sets = Array.from(li.querySelectorAll('.set-row')).map(row => {
        const reps = Number(row.querySelector('.set-reps')?.value || 0);
        const weight = readWeightValue(row.querySelector('.set-weight'));
        const completed = row.querySelector('.set-completed')?.checked;
        const hasWeight = weight === 'BW' || weight > 0;
        if (!reps && !hasWeight) return null;
        return {
          reps: reps || 0,
          weight: weight || 0,
          completed: Boolean(completed)
        };
      }).filter(Boolean);
      if (sets.length > 0) {
        exerciseEntries.push({
          exerciseId: li.dataset.exerciseId,
          name: name || 'Exercise',
          sets
        });
      }
    });

    if (exerciseEntries.length === 0) {
      showStatusMessage('Add reps and weight for at least one set before saving.', 4000);
      return;
    }

    const now = new Date();
    const session = {
      id: (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      schemaVersion: SESSION_SCHEMA_VERSION,
      appProgramVersion: APP_PROGRAM_VERSION,
      dayId,
      date: now.toISOString(),
      dateTs: now.getTime(),
      exercises: exerciseEntries
    };

    getHistoryDb()
      .then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(HISTORY_STORE, 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.objectStore(HISTORY_STORE).add(session);
      }))
      .then(() => {
        showStatusMessage('Session saved to history.', 4000);
        lastSavedAt = Date.now();
        updateSyncStatus({
          message: navigator.onLine ? 'Online • Session saved' : 'Offline • Session saved locally',
          state: navigator.onLine ? 'online' : 'offline'
        });
        clearSetInputs(dayId);
        renderHistory(historyDayFilter ? historyDayFilter.value : dayId);
        applyProgressionHintsForDay(dayId);
      })
      .catch(() => {
        showStatusMessage('Could not save session. Check storage permissions.', 5000);
      });
  }

  function getRepRangeForExercise(exerciseItem) {
    const recommendation = parseRecommendedSets(exerciseItem?.dataset?.recommendedSets || '');
    if (!recommendation) return null;
    return {
      minReps: recommendation.minReps,
      maxReps: recommendation.maxReps || recommendation.minReps
    };
  }

  function buildProgressionHint(exerciseItem, entry) {
    if (!entry || !exerciseItem) return 'Log a session to get progression tips.';
    const repRange = getRepRangeForExercise(exerciseItem);
    const sets = entry.sets || [];
    if (sets.length === 0 || !repRange) {
      return 'Match your last session and aim to improve one rep.';
    }
    const weights = sets.map(set => set.weight);
    const reps = sets.map(set => set.reps || 0);
    const maxReps = Math.max(...reps, 0);
    const minReps = Math.min(...reps.filter(r => r > 0));
    const numericWeights = weights.filter(w => typeof w === 'number' && w > 0);
    const isBodyweight = weights.some(w => w === 'BW') || numericWeights.length === 0;
    if (maxReps >= repRange.maxReps) {
      return isBodyweight
        ? 'Next time: add 1–2 reps per set.'
        : 'Next time: add 2.5–5 lb if form felt solid.';
    }
    if (minReps && minReps < repRange.minReps) {
      return isBodyweight
        ? `Aim for ${repRange.minReps} reps per set at the same difficulty.`
        : `Hold weight and aim for ${repRange.minReps} reps per set.`;
    }
    if (numericWeights.length > 0) {
      const topWeight = Math.max(...numericWeights);
      return `Stay at ${topWeight} and try to reach ${repRange.maxReps} reps.`;
    }
    return `Aim for ${repRange.maxReps} reps per set.`;
  }

  function applyProgressionHintsForDay(dayId) {
    const day = document.getElementById(dayId);
    if (!day) return;
    const hintEls = day.querySelectorAll('.progression-hint');
    hintEls.forEach(el => {
      el.textContent = 'Log a session to get progression tips.';
    });

    getHistoryDb()
      .then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(HISTORY_STORE, 'readonly');
        const store = tx.objectStore(HISTORY_STORE);
        const index = store.index('by-day');
        const request = index.getAll(IDBKeyRange.only(dayId));
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      }))
      .then(sessions => {
        const normalizedSessions = sessions
          .map(session => normalizeHistorySessionRow(session, dayId))
          .filter(Boolean);
        const sorted = normalizedSessions.sort((a, b) => b.dateTs - a.dateTs);
        const latest = sorted[0];
        if (!latest) return;
        const lookup = new Map(latest.exercises.map(entry => [entry.exerciseId, entry]));
        day.querySelectorAll(EXERCISE_ITEM_SELECTOR).forEach(li => {
          const hintEl = li.querySelector('.progression-hint');
          if (!hintEl) return;
          const entry = lookup.get(li.dataset.exerciseId);
          hintEl.textContent = buildProgressionHint(li, entry);
        });
      })
      .catch(() => {
        day.querySelectorAll('.progression-hint').forEach(el => {
          el.textContent = 'Progression tips are unavailable right now.';
        });
      });
  }

  window.applyProgressionHintsForDay = applyProgressionHintsForDay;

  function clearSetInputs(dayId) {
    const day = document.getElementById(dayId);
    if (!day) return;
    day.querySelectorAll('.set-rows').forEach(rows => {
      populateRecommendedRows(rows);
    });
    resetSetStateForDay(dayId);
    persistState();
  }

  function renderHistory(dayId) {
    if (!historyList) return;
    if (!('indexedDB' in window)) {
      historyList.innerHTML = '<div class="history-card">IndexedDB is unavailable in this browser.</div>';
      return;
    }

    getHistoryDb()
      .then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(HISTORY_STORE, 'readonly');
        const store = tx.objectStore(HISTORY_STORE);
        const index = store.index('by-day');
        const request = index.getAll(IDBKeyRange.only(dayId));
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      }))
      .then(sessions => {
        const normalizedSessions = sessions
          .map(session => normalizeHistorySessionRow(session, dayId))
          .filter(Boolean);
        const sorted = normalizedSessions.sort((a, b) => b.dateTs - a.dateTs);
        if (sorted.length === 0) {
          historyList.innerHTML = '<div class="history-card">No sessions logged yet for this day.</div>';
          return;
        }
        historyList.innerHTML = '';
        sorted.forEach(session => {
          const totalSets = session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
          const totals = session.exercises.reduce((acc, ex) => {
            ex.sets.forEach(set => {
              acc.reps += set.reps || 0;
              const weightValue = typeof set.weight === 'number' ? set.weight : 0;
              acc.volume += (set.reps || 0) * weightValue;
            });
            return acc;
          }, { reps: 0, volume: 0 });
          const card = document.createElement('div');
          card.className = 'history-card';
          const dateLabel = new Date(session.date).toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          card.innerHTML = `
            <h3>${dateLabel}</h3>
            <div class="history-summary">${totalSets} sets • ${totals.reps} reps • ${totals.volume.toFixed(0)} total volume</div>
          `;
          session.exercises.forEach(exercise => {
            const exerciseEl = document.createElement('div');
            exerciseEl.className = 'history-exercise';
            const setsLabel = exercise.sets.map(set => {
              const weightLabel = set.weight === 'BW' ? 'BW' : set.weight;
              const completionLabel = set.completed ? ' ✓' : '';
              return `${set.reps}×${weightLabel}${completionLabel}`;
            }).join(', ');
            exerciseEl.textContent = `${exercise.name}: ${setsLabel}`;
            card.appendChild(exerciseEl);
          });
          historyList.appendChild(card);
        });
      })
      .catch(() => {
        historyList.innerHTML = '<div class="history-card">Unable to load history right now.</div>';
      });
  }

  function clearHistoryDb() {
    if (!('indexedDB' in window)) return Promise.resolve();
    return getHistoryDb()
      .then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(HISTORY_STORE, 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.objectStore(HISTORY_STORE).clear();
      }))
      .catch(() => {
        // ignore
      });
  }

  function assignStableIds() {
    document.querySelectorAll('.day').forEach(day => {
      const dayId = day.id || 'day';
      let warmIdx = 0;
      let coolIdx = 0;
      let prepIdx = 0;
      let strengthIdx = 0;
      let miscIdx = 0;
      const idCounts = new Map();

      const makeUniqueId = (baseId) => {
        const seenCount = idCounts.get(baseId) || 0;
        idCounts.set(baseId, seenCount + 1);
        return seenCount === 0 ? baseId : `${baseId}-${seenCount}`;
      };

      day.querySelectorAll('.workout-item').forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const existingExerciseId = li.dataset.exerciseId;

        const section = li.closest('.section');
        const sectionIsWarm = section && section.classList.contains('warmup');
        const sectionIsCool = section && section.classList.contains('cooldown');
        const isPrepItem = li.classList.contains('prep-item');
        const isStrengthItem = li.classList.contains('exercise-item');

        const visual = li.querySelector('.exercise-visual');
        const mediaKey = isStrengthItem && visual && visual.dataset.mediaKey
          ? visual.dataset.mediaKey
          : null;

        let itemId = existingExerciseId;
        if (!itemId && li.classList.contains('exercise-li')) {
          // reserved if you later add a class
          itemId = `${dayId}-ex-${mediaKey || (miscIdx++)}`;
        } else if (!itemId && visual && getExerciseTitleElement(li)) {
          itemId = `${dayId}-ex-${mediaKey || (miscIdx++)}`;
        } else if (!itemId && sectionIsWarm) {
          itemId = `${dayId}-warmup-${warmIdx++}`;
        } else if (!itemId && sectionIsCool) {
          itemId = `${dayId}-cooldown-${coolIdx++}`;
        } else if (!itemId && isPrepItem) {
          itemId = `${dayId}-prep-${prepIdx++}`;
        } else if (!itemId && isStrengthItem) {
          itemId = `${dayId}-ex-${mediaKey || strengthIdx++}`;
        } else if (!itemId) {
          itemId = `${dayId}-item-${miscIdx++}`;
        }

        itemId = makeUniqueId(itemId);

        li.dataset.exerciseId = itemId;

        if (checkbox) {
          checkbox.dataset.checkId = itemId;
        }

        const variants = li.querySelectorAll('.variant-option');
        variants.forEach(v => {
          if (v.dataset.variantId) {
            v.dataset.variantId = makeUniqueId(v.dataset.variantId);
          } else if (v.dataset.mediaKey) {
            v.dataset.variantId = makeUniqueId(v.dataset.mediaKey);
          } else {
            delete v.dataset.variantId;
          }
          v.dataset.exerciseId = itemId;
        });
      });
    });
  }

  function enhanceAccessibility() {
    document.querySelectorAll('.exercise-visual, .svg-wrap').forEach(el => {
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      const img = el.querySelector('img');
      const label = img && img.alt ? img.alt : 'Exercise demonstration';
      if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', label);
    });

    document.querySelectorAll('.exercise-visual img').forEach(img => {
      if (!img.hasAttribute('loading')) img.loading = 'lazy';
      if (!img.hasAttribute('decoding')) img.decoding = 'async';
      if (!img.hasAttribute('width')) img.width = 80;
      if (!img.hasAttribute('height')) img.height = 80;
    });

    const overlayClose = document.querySelector('#svgOverlay .close');
    if (overlayClose) {
      overlayClose.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.closeOverlay();
        }
      });
    }

    document.querySelectorAll('.exercise-visual, .svg-wrap').forEach(el => {
      el.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          el.click();
        }
      });
    });
  }

  function applyStateToUI() {
    isHydratingState = true;
    const escapeCssValue = window.CSS && CSS.escape
      ? CSS.escape
      : (value) => String(value).replace(/["\\]/g, '\\$&');

    // Apply checkmarks
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
      const checkId = c.dataset.checkId;
      if (!checkId) return;
      c.checked = !!state.checkmarks[checkId];
    });

    document.querySelectorAll(EXERCISE_ITEM_SELECTOR).forEach(li => {
      const checkbox = li.querySelector('input[type="checkbox"][data-check-id]');
      if (!checkbox) return;
      li.classList.toggle('exercise-completed', checkbox.checked);
    });

    document.querySelectorAll('.exercise-card[data-exercise-id]').forEach(card => {
      const exerciseId = card.dataset.exerciseId;
      if (!exerciseId) return;
      const isCollapsed = !!state.collapsedCards[exerciseId];
      card.classList.toggle('is-collapsed', isCollapsed);
      const toggle = card.querySelector('.exercise-card__toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', String(!isCollapsed));
        toggle.textContent = isCollapsed ? 'Expand' : 'Collapse';
      }
    });

    // Apply saved variant selections
    document.querySelectorAll(`${EXERCISE_ITEM_SELECTOR}, .exercise-item[data-exercise-id=""]`).forEach(li => {
      const exerciseId = li.dataset.exerciseId;
      if (!exerciseId) return;
      const selectedKey = state.selections[exerciseId];
      if (!selectedKey) return;

      const option = li.querySelector(`.variant-option[data-media-key="${escapeCssValue(selectedKey)}"]`);
      if (option) {
        // Update selection styling + UI media
        window.selectVariant(option);
      }
    });

    document.querySelectorAll(EXERCISE_ITEM_SELECTOR).forEach(li => {
      const rows = li.querySelector('.set-rows');
      if (!rows) return;
      const exerciseId = li.dataset.exerciseId;
      const storedSets = exerciseId ? state.sets[exerciseId] : null;
      if (Array.isArray(storedSets) && storedSets.length > 0) {
        rows.innerHTML = '';
        storedSets.forEach(set => {
          addSetRow(rows, set);
        });
      } else {
        populateRecommendedRows(rows);
      }
    });
    isHydratingState = false;
  }

  function resetSetStateForDay(dayId) {
    const day = document.getElementById(dayId);
    if (!day) return;
    day.querySelectorAll(EXERCISE_ITEM_SELECTOR).forEach(li => {
      const exerciseId = li.dataset.exerciseId;
      if (exerciseId && state.sets[exerciseId]) {
        delete state.sets[exerciseId];
      }
    });
  }
});
