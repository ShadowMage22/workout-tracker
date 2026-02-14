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

// Centralized exercise media database
const exerciseMedia = {
  // PUSH
  "dumbbell-bench-press": {
    video: "https://www.youtube.com/watch?v=VmB1G1K7v94",
    img: "./media/push/dumbbell-bench-press-chest.gif",
    imgFull: "./media/push/dumbbell-bench-press-chest.gif"
  },
  "push-ups": {
    video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    img: "./media/push/push-up.gif",
    imgFull: "./media/push/push-up.gif"
  },
  "dumbbell-chest-fly": {
    video: "https://www.youtube.com/watch?v=eozdVDA78K0",
    img: "./media/push/dumbbell-chest-fly.gif",
    imgFull: "./media/push/dumbbell-chest-fly.gif"
  },
  "dumbbell-standing-overhead-press": {
    video: "https://www.youtube.com/watch?v=M2rwvNhTOu0",
    img: "./media/push/dumbbell-standing-overhead-press.gif",
    imgFull: "./media/push/dumbbell-standing-overhead-press.gif"
  },
  "single-arm-arnold-press": {
    video: "https://www.youtube.com/watch?v=6Z15_WdXmVw",
    img: "./media/push/single-arm-arnold-press.gif",
    imgFull: "./media/push/single-arm-arnold-press.gif"
  },
  "half-kneeling-dumbbell-press": {
    video: "https://youtu.be/-7zgcCU2kW4?si=_TqOC3qwyKUH2kbN",
    img: "./media/push/half-kneeling-dumbbell-press.gif",
    imgFull: "./media/push/half-kneeling-dumbbell-press.gif"
  },
  "dumbbell-incline-press": {
    video: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
    img: "./media/push/dumbbell-incline-chest-press.gif",
    imgFull: "./media/push/dumbbell-incline-chest-press.gif"
  },
  "dumbbell-incline-fly": {
    video: "https://youtu.be/JSDpq14vCZ8?si=W7ZUxeZlYktHgisS",
    img: "./media/push/dumbbell-incline-fly.gif",
    imgFull: "./media/push/dumbbell-incline-fly.gif"
  },
  "cable-fly": {
    video: "https://www.youtube.com/watch?v=taI4XduLpTk",
    img: "./media/push/low-cable-chest-flys.gif",
    imgFull: "./media/push/low-cable-chest-flys.gif"
  },
  "tricep-pushdown": {
    video: "https://www.youtube.com/watch?v=2-LAMcpzODU",
    img: "./media/push/tricep-pushdown.gif",
    imgFull: "./media/push/tricep-pushdown.gif"
  },
  "overhead-tricep-ext": {
    video: "https://www.youtube.com/watch?v=YbX7Wd8jQ-Q",
    img: "./media/push/overhead-tricep-extension.gif",
    imgFull: "./media/push/overhead-tricep-extension.gif"
  },
  "close-grip-pushup": {
    video: "https://www.youtube.com/watch?v=nTJQJzGkGTg",
    img: "./media/push/close-grip-push-up.gif",
    imgFull: "./media/push/close-grip-push-up.gif"
  },
  "plank": {
    video: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
    img: "./media/push/plank.gif",
    imgFull: "./media/push/plank.gif"
  },
  "mountain-climbers": {
    video: "https://www.youtube.com/watch?v=nmwgirgXLYM",
    img: "./media/push/mountain-climbers.gif",
    imgFull: "./media/push/mountain-climbers.gif"
  },
  "plank-walk-out": {
    video: "https://youtu.be/nYSYZgGVETI?si=AlMJAoUGONAYAiO8",
    img: "./media/push/plank-walk-outs.gif",
    imgFull: "./media/push/plank-walk-outs.gif"
  },

  // PULL
  "cable-row": {
    video: "https://www.youtube.com/watch?v=GZbfZ033f74",
    img: "./media/pull/seated-cable-row.gif",
    imgFull: "./media/pull/seated-cable-row.gif"
  },
  "dumbbell-row": {
    video: "https://www.youtube.com/watch?v=roCP6wCXPqo",
    img: "./media/pull/dumbbell-row.gif",
    imgFull: "./media/pull/dumbbell-row.gif"
  },
  "bent-over-dumbbell-row": {
    video: "https://youtu.be/ZXpZu_fmheU?si=q4ykfTgMqL-PY26Q",
    img: "./media/pull/bent-over-dumbbell-row.gif",
    imgFull: "./media/pull/bent-over-dumbbell-row.gif"
  },
  "lat-pulldown": {
    video: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
    img: "./media/pull/lat-pulldown.gif",
    imgFull: "./media/pull/lat-pulldown.gif"
  },
  "lat-pushdowns": {
    video: "https://youtu.be/AjCCGN2tU3Q?si=UNlUSJYcKhDqUeBJ",
    img: "./media/pull/lat-pushdown.gif",
    imgFull: "./media/pull/lat-pushdown.gif"
  },
  "straight-arm-pulldown": {
    video: "https://www.youtube.com/watch?v=kiuVA0gs3EI",
    img: "./media/pull/straight-arm-pulldown.gif",
    imgFull: "./media/pull/straight-arm-pulldown.gif"
  },
  "face-pulls": {
    video: "https://www.youtube.com/watch?v=rep-qVOkqgk",
    img: "./media/pull/face-pull.gif",
    imgFull: "./media/pull/face-pull.gif"
  },
  "reverse-fly": {
    video: "https://www.youtube.com/watch?v=ea-H-QB1ZNg",
    img: "./media/pull/dumbbell-reverse-fly.gif",
    imgFull: "./media/pull/dumbbell-reverse-fly.gif"
  },
  "lateral-raise": {
    video: "https://youtu.be/XPPfnSEATJA?si=pgWmQMf6D7r3SvKl",
    img: "./media/pull/lateral-raise.gif",
    imgFull: "./media/pull/lateral-raise.gif"
  },
  "bicep-curls": {
    video: "https://www.youtube.com/watch?v=ykJmrZ5v0Oo",
    img: "./media/pull/bicep-curls.gif",
    imgFull: "./media/pull/bicep-curls.gif"
  },
  "hammer-curls": {
    video: "https://www.youtube.com/watch?v=zC3nLlEvin4",
    img: "./media/pull/hammer-curls.gif",
    imgFull: "./media/pull/hammer-curls.gif"
  },
  "cable-curls": {
    video: "https://www.youtube.com/watch?v=Jvj2wV0vOYU",
    img: "./media/pull/cable-curls.gif",
    imgFull: "./media/pull/cable-curls.gif"
  },
  "dead-bug": {
    video: "https://www.youtube.com/watch?v=4XLEnwUr1d8",
    img: "./media/pull/dead-bug.gif",
    imgFull: "./media/pull/dead-bug.gif"
  },
  "bird-dog": {
    video: "https://www.youtube.com/watch?v=wiFNA3sqjCA",
    img: "./media/pull/bird-dog.gif",
    imgFull: "./media/pull/bird-dog.gif"
  },
  "hollow-body": {
    video: "https://www.youtube.com/watch?v=LlDNef_Ztsc",
    img: "./media/pull/hollow-body.gif",
    imgFull: "./media/pull/hollow-body.gif"
  },

  // LEGS
  "goblet-squat": {
    video: "https://www.youtube.com/watch?v=MeIiIdhvXT4",
    img: "./media/legs/goblet-squat.gif",
    imgFull: "./media/legs/goblet-squat.gif"
  },
  "dumbbell-sumo-squat": {
    video: "https://youtu.be/vBA3vyOxJv0?si=KkbO15q1OnN3FkgL",
    img: "./media/legs/dumbbell-sumo-squat.gif",
    imgFull: "./media/legs/dumbbell-sumo-squat.gif"
  },
  "dumbbell-front-squat": {
    video: "https://youtu.be/OtOayZUX370?si=eCqK1mUaTS6ORHdR",
    img: "./media/legs/dumbbell-front-squat.gif",
    imgFull: "./media/legs/dumbbell-front-squat.gif"
  },
  "dumbbell-rdl": {
    video: "https://www.youtube.com/watch?v=aa57T45iFSE&t=9s",
    img: "./media/legs/dumbbell-rdl.gif",
    imgFull: "./media/legs/dumbbell-rdl.gif"
  },
  "leg-curl": {
    video: "https://www.youtube.com/watch?v=ELOCsoDSmrg",
    img: "./media/legs/seated-leg-curl.gif",
    imgFull: "./media/legs/seated-leg-curl.gif"
  },
  "single-leg-rdl": {
    video: "https://youtu.be/lI8-igvsnVQ?si=QrNcX5IRgI73QEoW",
    img: "./media/legs/single-leg-rdl.gif",
    imgFull: "./media/legs/single-leg-rdl.gif"
  },
  "bulgarian-split-squat": {
    video: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
    img: "./media/legs/bulgarian-split-squat.gif",
    imgFull: "./media/legs/bulgarian-split-squat.gif"
  },
  "walking-lunges": {
    video: "https://www.youtube.com/watch?v=L8fvypPrzzs",
    img: "./media/legs/walking-lunges.gif",
    imgFull: "./media/legs/walking-lunges.gif"
  },
  "step-ups": {
    video: "https://www.youtube.com/watch?v=dQqApCGd5Ss",
    img: "./media/legs/step-ups.gif",
    imgFull: "./media/legs/step-ups.gif"
  },
  "calf-raises": {
    video: "https://www.youtube.com/watch?v=gwLzBJYoWlI",
    img: "./media/legs/standing-calf-raise.gif",
    imgFull: "./media/legs/standing-calf-raise.gif"
  },
  "seated-calf": {
    video: "https://www.youtube.com/watch?v=JbyjNymZOt0",
    img: "./media/legs/seated-calf-raise-dumbbell.gif",
    imgFull: "./media/legs/seated-calf-raise-dumbbell.gif"
  },
  "single-leg-calf-raise": {
    video: "https://youtu.be/hXB5YxfeoDo?si=vYZ7k46MiXknlXOi",
    img: "./media/legs/single-leg-calf-raise.gif",
    imgFull: "./media/legs/single-leg-calf-raise.gif"
  },
  "side-plank": {
    video: "https://www.youtube.com/watch?v=K2VljzCC16g",
    img: "./media/legs/side-plank.gif",
    imgFull: "./media/legs/side-plank.gif"
  },
  "pallof-press": {
    video: "https://www.youtube.com/watch?v=AH_QZLm_0-s",
    img: "./media/legs/pallof-press.gif",
    imgFull: "./media/legs/pallof-press.gif"
  },
  "russian-twists": {
    video: "https://www.youtube.com/watch?v=wkD8rjkodUI",
    img: "./media/legs/russian-twist.gif",
    imgFull: "./media/legs/russian-twist.gif"
  },

};

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

document.addEventListener('DOMContentLoaded', () => {
  if (isIosSafari() && !isStandaloneMode()) {
    showIosInstallHint();
  }
});

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

const WORKOUT_DATA_URL = './data/workouts.json';

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/'/g, '&#39;');

const buildInstructionString = (instructions = {}) => {
  const parts = [
    `Sets/Reps: ${instructions.sets || ''}`,
    `Rest: ${instructions.rest || ''}`,
    `Time: ${instructions.time || ''}`,
    `Targets: ${instructions.targets || ''}`
  ];
  return parts.join(' | ');
};

const buildInstructionHtml = (instructions = {}) => {
  const safe = {
    sets: escapeHtml(instructions.sets || ''),
    rest: escapeHtml(instructions.rest || ''),
    time: escapeHtml(instructions.time || ''),
    targets: escapeHtml(instructions.targets || ''),
    notes: instructions.notes ? escapeHtml(instructions.notes) : ''
  };
  let html = `<strong>Sets/Reps:</strong> ${safe.sets}<br>` +
    `<strong>Rest:</strong> ${safe.rest}<br>` +
    `<strong>Time:</strong> ${safe.time}<br>` +
    `<strong>Targets:</strong> ${safe.targets}`;
  return html;
};

const setCoachTip = (element, noteText) => {
  if (!element) return;
  const trimmed = (noteText || '').trim();
  if (!trimmed) {
    element.textContent = '';
    element.classList.remove('show');
    return;
  }
  element.textContent = `Coach tip: ${trimmed}`;
  element.classList.add('show');
};

const parseDurationFromTitle = (title = '', sectionType = '') => {
  const match = String(title).match(/(\d+)\s*min/i);
  if (match) {
    const minutes = Number(match[1]);
    if (Number.isFinite(minutes) && minutes > 0) return minutes * 60;
  }
  if (sectionType === 'warmup') return 8 * 60;
  if (sectionType === 'cooldown') return 5 * 60;
  return 6 * 60;
};

const EXERCISE_ITEM_SELECTOR = '.exercise-item[data-exercise-id]';

const renderWorkoutUI = (data = {}) => {
  if (!data || !Array.isArray(data.days)) return;
  document.querySelectorAll('.day.card .day-skeleton').forEach((node) => node.remove());
  let cardBodyCounter = 0;

  data.days.forEach(day => {
    if (!day || !day.id) return;
    const container = document.getElementById(day.id);
    if (!container) return;
    container.innerHTML = '';

    const heading = document.createElement('h2');
    heading.textContent = day.title || '';
    container.appendChild(heading);

    (day.sections || []).forEach(section => {
      if (!section) return;
      const sectionEl = document.createElement('div');
      sectionEl.className = 'section';
      if (section.type === 'warmup') sectionEl.classList.add('warmup');
      if (section.type === 'cooldown') sectionEl.classList.add('cooldown');
      if (section.type === 'strength') sectionEl.classList.add('strength');

      const title = document.createElement('h3');
      title.textContent = section.title || '';
      sectionEl.appendChild(title);

      if (section.type === 'warmup' || section.type === 'cooldown') {
        const timerWrap = document.createElement('div');
        timerWrap.className = 'section-timer';
        timerWrap.dataset.sectionType = section.type;
        timerWrap.dataset.duration = parseDurationFromTitle(section.title, section.type).toString();
        timerWrap.innerHTML = `
          <div class="section-timer__summary">
            <div class="section-timer__header">
              <span class="timer-label">${section.type === 'warmup' ? 'Warm-up timer' : 'Cooldown timer'}</span>
              <span class="section-timer-pill" data-state="ready">Ready</span>
            </div>
            <span class="timer-display">00:00</span>
          </div>
          <div class="timer-actions">
            <button type="button" class="ghost-button start-timer">Start</button>
            <button type="button" class="ghost-button stop-timer" disabled>Stop</button>
          </div>
        `;
        sectionEl.appendChild(timerWrap);
      }

      if (section.type === 'strength') {
        const list = document.createElement('div');
        list.className = 'exercise-card-list';
        (section.exercises || []).forEach(exercise => {
          const listItem = document.createElement('div');
          listItem.className = 'exercise-card exercise-item workout-item';
          const exerciseTitle = exercise.displayName || exercise.name || '';
          const bodyId = `${day.id || 'day'}-exercise-card-body-${cardBodyCounter++}`;

          const header = document.createElement('div');
          header.className = 'exercise-card__header';
          const titleEl = document.createElement('span');
          titleEl.className = 'exercise-card__title';
          titleEl.textContent = exerciseTitle;
          const toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.className = 'exercise-card__toggle';
          toggleBtn.setAttribute('aria-expanded', 'true');
          toggleBtn.setAttribute('aria-controls', bodyId);
          toggleBtn.textContent = 'Collapse';
          header.appendChild(titleEl);
          header.appendChild(toggleBtn);
          listItem.appendChild(header);

          const body = document.createElement('div');
          body.className = 'exercise-card__body';
          body.id = bodyId;

          if (exercise.instructions && exercise.instructions.sets) {
            listItem.dataset.recommendedSets = exercise.instructions.sets;
          }

          const exerciseWrap = document.createElement('div');
          exerciseWrap.className = 'exercise';

          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          label.appendChild(checkbox);
          exerciseWrap.appendChild(label);

          const visual = document.createElement('div');
          visual.className = 'exercise-visual';
          if (exercise.mediaKey) visual.dataset.mediaKey = exercise.mediaKey;

          const img = document.createElement('img');
          img.src = '';
          img.alt = exercise.name || exercise.displayName || 'Exercise demonstration';
          visual.appendChild(img);

          const expandHint = document.createElement('div');
          expandHint.className = 'expand-hint';
          expandHint.textContent = '🔍';
          visual.appendChild(expandHint);
          exerciseWrap.appendChild(visual);

          body.appendChild(exerciseWrap);

          const instructionsEl = document.createElement('div');
          instructionsEl.className = 'instructions';
          instructionsEl.innerHTML = buildInstructionHtml(exercise.instructions);
          body.appendChild(instructionsEl);

          listItem.dataset.coaching = exercise.instructions?.notes || '';
          const coachTip = document.createElement('div');
          coachTip.className = 'coach-tip';
          setCoachTip(coachTip, exercise.instructions?.notes);
          body.appendChild(coachTip);

          const progressionHint = document.createElement('div');
          progressionHint.className = 'progression-hint';
          progressionHint.textContent = 'Log a session to get progression tips.';
          body.appendChild(progressionHint);

          const videoLink = document.createElement('a');
          const media = exercise.mediaKey ? exerciseMedia[exercise.mediaKey] : null;
          videoLink.href = media?.video || '#';
          if (exercise.mediaKey) videoLink.dataset.mediaKey = exercise.mediaKey;
          videoLink.target = '_blank';
          videoLink.rel = 'noopener noreferrer';
          videoLink.className = 'video-link';
          videoLink.textContent = 'Watch Form Tutorial';
          body.appendChild(videoLink);

          const variantsToggle = document.createElement('div');
          variantsToggle.className = 'variants-toggle';
          variantsToggle.textContent = 'Change exercise (same muscles)';
          body.appendChild(variantsToggle);

          const variantsList = document.createElement('div');
          variantsList.className = 'exercise-variants';

          const baseOption = document.createElement('div');
          baseOption.className = 'variant-option';
          baseOption.dataset.variantBase = 'true';
          const baseName = exercise.displayName || exercise.name || '';
          baseOption.dataset.name = baseName;
          baseOption.dataset.instructions = buildInstructionString(exercise.instructions);
          if (exercise.instructions && exercise.instructions.sets) {
            baseOption.dataset.recommendedSets = exercise.instructions.sets;
          }
          baseOption.dataset.coaching = exercise.instructions?.notes || '';
          if (exercise.mediaKey) baseOption.dataset.mediaKey = exercise.mediaKey;

          const baseLabelText = baseName ? `Original: ${baseName}` : 'Original exercise';
          const baseLabel = document.createTextNode(baseLabelText);
          baseOption.appendChild(baseLabel);
          variantsList.appendChild(baseOption);

          (exercise.variants || []).forEach((variant) => {
            const option = document.createElement('div');
            option.className = 'variant-option';
            option.dataset.name = variant.displayName || variant.label || '';
            option.dataset.instructions = buildInstructionString(variant.instructions);
            if (variant.instructions && variant.instructions.sets) {
              option.dataset.recommendedSets = variant.instructions.sets;
            }
            option.dataset.coaching = variant.instructions?.notes || '';
            if (variant.mediaKey) option.dataset.mediaKey = variant.mediaKey;

            const labelText = document.createTextNode(variant.label || '');
            option.appendChild(labelText);
            if (variant.muscles) {
              const muscles = document.createElement('span');
              muscles.textContent = `(${variant.muscles})`;
              option.appendChild(document.createTextNode(' '));
              option.appendChild(muscles);
            }
            variantsList.appendChild(option);
          });

          body.appendChild(variantsList);
          listItem.appendChild(body);
          list.appendChild(listItem);
        });

        sectionEl.appendChild(list);
      } else {
        const list = document.createElement('div');
        list.className = 'exercise-card-list';
        (section.items || []).forEach(item => {
          const isObjectItem = item && typeof item === 'object';
          const itemName = isObjectItem ? item.name : item;
          const itemInstructions = isObjectItem ? item.instructions : null;

          const listItem = document.createElement('div');
          listItem.className = 'exercise-card workout-item prep-item';
          const bodyId = `${day.id || 'day'}-exercise-card-body-${cardBodyCounter++}`;

          const header = document.createElement('div');
          header.className = 'exercise-card__header';
          const titleEl = document.createElement('span');
          titleEl.className = 'exercise-card__title';
          titleEl.textContent = itemName || '';
          const toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.className = 'exercise-card__toggle';
          toggleBtn.setAttribute('aria-expanded', 'true');
          toggleBtn.setAttribute('aria-controls', bodyId);
          toggleBtn.textContent = 'Collapse';
          header.appendChild(titleEl);
          header.appendChild(toggleBtn);
          listItem.appendChild(header);

          const body = document.createElement('div');
          body.className = 'exercise-card__body';
          body.id = bodyId;

          const card = document.createElement('div');
          card.className = 'prep-card';
          const label = document.createElement('label');
          label.className = 'prep-label';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          label.appendChild(checkbox);
          card.appendChild(label);
          body.appendChild(card);

          const instructionsEl = document.createElement('div');
          instructionsEl.className = 'instructions';
          instructionsEl.innerHTML = buildInstructionHtml(itemInstructions || {});
          body.appendChild(instructionsEl);

          const coachTip = document.createElement('div');
          coachTip.className = 'coach-tip';
          setCoachTip(coachTip, itemInstructions?.notes);
          body.appendChild(coachTip);

          listItem.appendChild(body);

          list.appendChild(listItem);
        });

        sectionEl.appendChild(list);
      }
      container.appendChild(sectionEl);
    });

    const saveBtn = document.createElement('button');
    saveBtn.className = 'primary-button save-session';
    saveBtn.type = 'button';
    saveBtn.dataset.day = day.id;
    saveBtn.textContent = day.saveLabel || 'Save Session';
    container.appendChild(saveBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear';
    clearBtn.setAttribute('onclick', `clearChecks('${day.id}')`);
    clearBtn.textContent = day.clearLabel || 'Clear Day';
    container.appendChild(clearBtn);
  });
};

const loadWorkoutData = async () => {
  const response = await fetch(WORKOUT_DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to load workout data (${response.status})`);
  }
  return response.json();
};

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'workoutTrackerState';
  const STATE_VERSION = 2;
  const PROGRAM_VERSION = '2026-01-v2.4';
  const ACTIVE_TAB_KEY = 'workoutTrackerActiveTab';
  const ACTIVE_TAB_TTL_MS = 6000;
  const HISTORY_DB = 'workoutTrackerHistory';
  const HISTORY_STORE = 'sessions';
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
    initSectionTimers();
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

  function isVideoSource(url) {
    return typeof url === 'string' && /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
  }

  function getPreviewImage(media) {
    if (!media) return null;
    if (media.preview) return media.preview;
    if (media.imgFull && media.imgFull.toLowerCase().endsWith('.gif')) return media.imgFull;
    return media.img || null;
  }

  function showMissingMedia(visual, img) {
    if (!visual) return;
    if (img) img.removeAttribute('src');
    if (!visual.querySelector('.placeholder')) {
      const placeholder = document.createElement('span');
      placeholder.className = 'placeholder';
      placeholder.textContent = '🖼️';
      visual.appendChild(placeholder);
    }
  }

  function clearMissingMedia(visual) {
    if (!visual) return;
    const placeholder = visual.querySelector('.placeholder');
    if (placeholder) placeholder.remove();
  }

  function applyMediaToVisual(visual, img, media, altText) {
    if (!visual || !img) return;

    if (!media) {
      delete visual.dataset.fullSrc;
      showMissingMedia(visual, img);
      return;
    }

    const previewSrc = getPreviewImage(media);
    if (!previewSrc) {
      showMissingMedia(visual, img);
      return;
    }

    clearMissingMedia(visual);
    img.onerror = () => showMissingMedia(visual, img);
    delete img.dataset.loaded;
    img.dataset.src = previewSrc;
    img.removeAttribute('src');
    img.classList.add('lazy-media');
    if (typeof window.registerLazyMedia === 'function') {
      window.registerLazyMedia(img);
    }

    if (altText) {
      img.alt = altText;
      visual.setAttribute('aria-label', altText);
    }

    if (media.imgFull) {
      visual.dataset.fullSrc = media.imgFull;
    } else {
      delete visual.dataset.fullSrc;
    }
  }

  window.expandMedia = function(event, url, altText = 'Exercise demonstration') {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    const overlay = document.getElementById('svgOverlay');
    const container = document.getElementById('overlayContent');
    if (!overlay || !container || !url) return;
    const safeAlt = altText || 'Exercise demonstration';
    if (isVideoSource(url)) {
      container.innerHTML = `<video src="${url}" controls autoplay loop muted playsinline></video>`;
    } else {
      container.innerHTML = `<img src="${url}" alt="${safeAlt}" />`;
    }
    overlay.classList.add('active');
  };

  window.closeOverlay = function() {
    const overlay = document.getElementById('svgOverlay');
    if (overlay) overlay.classList.remove('active');
  };

  window.toggleVariants = function(btn) {
    const list = btn.closest('li')?.querySelector('.exercise-variants');
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

  window.selectVariant = function(option) {
    if (!ensureEditable({ allowIfReadOnly: isHydratingState || isApplyingExternalState })) return;
    const container = option.closest('.exercise-variants');
    const exerciseItem = option.closest('li');
    if (!container || !exerciseItem) return;

    const nameEl = exerciseItem.querySelector('.exercise-name');
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
      const checkId = e.target.dataset.checkId;
      if (!checkId) return;
      if (!ensureEditable()) {
        e.target.checked = !!state.checkmarks[checkId];
        const exerciseItem = e.target.closest(EXERCISE_ITEM_SELECTOR);
        if (exerciseItem) {
          exerciseItem.classList.toggle('exercise-completed', e.target.checked);
        }
        return;
      }
      if (e.target.checked) state.checkmarks[checkId] = true;
      else delete state.checkmarks[checkId];
      persistState();

      const exerciseItem = e.target.closest(EXERCISE_ITEM_SELECTOR);
      if (exerciseItem) {
        exerciseItem.classList.toggle('exercise-completed', e.target.checked);
      }

      if (e.target.checked) {
        if (exerciseItem && exerciseItem.dataset.exerciseId && typeof window.startRestTimer === 'function') {
          window.startRestTimer({ allowPrompt: false });
        }
      }
    }
  });

  document.addEventListener('click', (event) => {
    const startBtn = event.target.closest('.section-timer .start-timer');
    if (startBtn) {
      event.preventDefault();
      startSectionTimer(startBtn.closest('.section-timer'));
      return;
    }
    const stopBtn = event.target.closest('.section-timer .stop-timer');
    if (stopBtn) {
      event.preventDefault();
      stopSectionTimer(stopBtn.closest('.section-timer'));
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
      updateRestStatus(`Resting… ${formatMs(remainingMs)} remaining.`);
      renderTime();
    };

    const startTimer = async ({ allowPrompt = true } = {}) => {
      if (endTime) return;
      const durationMs = Number(restDurationSelect.value || 60) * 1000;
      if (!durationMs) return;
      if (allowPrompt && 'Notification' in window && Notification.permission === 'default') {
        await requestNotificationPermission();
      }
      if (intervalId) window.clearInterval(intervalId);
      endTime = Date.now() + durationMs;
      setPillState('running');
      updateButtons(true);
      bannerDismissed = false;
      updateBannerState({ state: 'running' });
      updateRestStatus('Resting…');
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
    const sectionType = timerEl?.dataset?.sectionType;
    if (sectionType === 'warmup') return 'Warm-up Timer';
    if (sectionType === 'cooldown') return 'Cooldown Timer';
    return 'Section Timer';
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

  function initSectionTimers() {
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
          stopSectionTimer(activeSectionTimer, { completed: false });
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
    pill.textContent = state === 'running' ? 'Running' : state === 'done' ? 'Done' : 'Ready';
    pill.dataset.state = state;
    timerEl.dataset.state = state;
  }

  function startSectionTimer(timerEl) {
    if (!timerEl) return;
    if (sectionTimerState.has(timerEl)) return;
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
        stopSectionTimer(timerEl, { completed: true });
      }
    }, 500);
    sectionTimerState.set(timerEl, { intervalId, endTime });
    if (startButton) startButton.disabled = true;
    if (stopButton) stopButton.disabled = false;
    if (display) display.textContent = formatTimer(durationSeconds * 1000);
    setSectionTimerState(timerEl, 'running');
  }

  function stopSectionTimer(timerEl, { completed = false } = {}) {
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
      li.appendChild(tracker);

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
            window.startRestTimer({ allowPrompt: false });
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
        const request = indexedDB.open(HISTORY_DB, 1);
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(HISTORY_STORE)) {
            const store = db.createObjectStore(HISTORY_STORE, { keyPath: 'id' });
            store.createIndex('by-day', 'dayId', { unique: false });
            store.createIndex('by-date', 'dateTs', { unique: false });
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
      const name = li.querySelector('.exercise-name')?.textContent?.trim();
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
        const sorted = sessions.sort((a, b) => b.dateTs - a.dateTs);
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
        const sorted = sessions.sort((a, b) => b.dateTs - a.dateTs);
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
        if (!checkbox) return;

        const section = li.closest('.section');
        const sectionIsWarm = section && section.classList.contains('warmup');
        const sectionIsCool = section && section.classList.contains('cooldown');
        const isStrengthItem = li.classList.contains('exercise-item');

        const visual = li.querySelector('.exercise-visual');
        const mediaKey = isStrengthItem && visual && visual.dataset.mediaKey
          ? visual.dataset.mediaKey
          : null;

        let itemId;
        if (sectionIsWarm) {
          itemId = `${dayId}-warmup-${warmIdx++}`;
        } else if (sectionIsCool) {
          itemId = `${dayId}-cooldown-${coolIdx++}`;
        } else if (isStrengthItem) {
          itemId = `${dayId}-ex-${mediaKey || strengthIdx++}`;
        } else {
          itemId = `${dayId}-item-${miscIdx++}`;
        }

        itemId = makeUniqueId(itemId);

        li.dataset.exerciseId = itemId;

        checkbox.dataset.checkId = itemId;

        const variants = li.querySelectorAll('.variant-option');
        variants.forEach(v => {
          if (v.dataset.mediaKey) {
            v.dataset.variantId = v.dataset.mediaKey;
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

  function applyMediaFromKeys() {
    // Initialize all exercise visuals from centralized media
    document.querySelectorAll('.exercise-visual').forEach(visual => {
      const mediaKey = visual.dataset.mediaKey;
      if (!mediaKey) return;

      const media = exerciseMedia[mediaKey];
      const img = visual.querySelector('img');
      applyMediaToVisual(visual, img, media, img ? img.alt : 'Exercise demonstration');
    });

    // Initialize all video links from centralized media
    document.querySelectorAll('.video-link').forEach(link => {
      const mediaKey = link.dataset.mediaKey;
      if (!mediaKey || !exerciseMedia[mediaKey] || !exerciseMedia[mediaKey].video) return;
      link.href = exerciseMedia[mediaKey].video;
    });
  }

  function initLazyMedia() {
    const pending = new Set();
    const hasRects = (img) => img && img.getClientRects && img.getClientRects().length > 0;

    const loadImage = (img) => {
      if (!img || !img.dataset || !img.dataset.src) return;
      if (img.dataset.loaded === 'true') return;
      img.src = img.dataset.src;
      img.dataset.loaded = 'true';
      img.classList.remove('lazy-media');
      pending.delete(img);
      if (observer) observer.unobserve(img);
    };

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '120px 0px' })
      : null;

    const registerLazyMedia = (img) => {
      if (!img || !img.dataset || !img.dataset.src) return;
      pending.add(img);
      if (observer && hasRects(img)) {
        observer.observe(img);
      } else {
        loadImage(img);
      }
    };

    window.registerLazyMedia = registerLazyMedia;

    document.querySelectorAll('.exercise-visual img').forEach(img => {
      registerLazyMedia(img);
    });

    window.loadActiveDayMedia = function loadActiveDayMedia() {
      const activeDay = document.querySelector('.day.active');
      if (!activeDay) return;
      activeDay.querySelectorAll('.exercise-visual').forEach(visual => {
        const img = visual.querySelector('img');
        if (!img) return;
        if (!img.dataset || !img.dataset.src) {
          const mediaKey = visual.dataset.mediaKey;
          const media = mediaKey ? exerciseMedia[mediaKey] : null;
          applyMediaToVisual(visual, img, media, img.alt || 'Exercise demonstration');
        }
        if (img.dataset && img.dataset.src) loadImage(img);
      });
    };

    window.addEventListener('load', () => {
      if (window.loadActiveDayMedia) window.loadActiveDayMedia();
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
