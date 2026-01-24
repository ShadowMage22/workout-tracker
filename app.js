let deferredPrompt;

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
    video: "https://youtu.be/OtOayZUX370?si=eCqK1mUaTS6ORHdR",
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
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installPrompt').classList.add('show');
});

function installApp() {
  const promptEl = document.getElementById('installPrompt');
  promptEl.classList.remove('show');

  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
    });
  }
}

function hideInstallPrompt() {
  document.getElementById('installPrompt').classList.remove('show');
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

// Make tab switching resilient (exists even if later init code throws)
window.showDay = function showDay(dayId, tabBtn) {
  const day = document.getElementById(dayId);
  if (!day) return;

  document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  day.classList.add('active');
  if (tabBtn && tabBtn.classList) tabBtn.classList.add('active');
};

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
};

// Event delegation: works even if inline handlers fail
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab[data-day]');
  if (!btn) return;

  e.preventDefault();
  window.showDay(btn.dataset.day, btn);
});

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'workoutTrackerState';
  const STATE_VERSION = 1;
  const PROGRAM_VERSION = '2026-01-v2.2';

  // In-memory working state (persisted to localStorage)
  let state = loadState();

  enhanceAccessibility();
  assignStableIds();
  applyMediaFromKeys();
  applyStateToUI();

  // ---------- Public API ----------
  window.clearChecks = function(dayId) {
    const container = document.getElementById(dayId);
    if (!container) return;

    container.querySelectorAll('input[type="checkbox"]').forEach(c => {
      c.checked = false;
      const checkId = c.dataset.checkId;
      if (checkId) delete state.checkmarks[checkId];
    });

    persistState();
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
    img.src = previewSrc;

    if (altText) {
      img.alt = altText;
      visual.setAttribute('aria-label', altText);
    }

    if (media.imgFull) {
      visual.onclick = (e) => expandMedia(e, media.imgFull, img.alt || altText);
    } else {
      visual.removeAttribute('onclick');
    }
  }

  window.expandMedia = function(event, url, altText = 'Exercise demonstration') {
    event.stopPropagation();
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
    const list = btn.nextElementSibling;
    if (!list) return;
    list.classList.toggle('active');
  };

  window.selectVariant = function(option) {
    const container = option.closest('.exercise-variants');
    const exerciseItem = option.closest('li');
    if (!container || !exerciseItem) return;

    const nameEl = exerciseItem.querySelector('.exercise-name');
    const instructionsEl = exerciseItem.querySelector('.instructions');
    const videoLink = exerciseItem.querySelector('.video-link');
    const visualEl = exerciseItem.querySelector('.exercise-visual');
    const imgEl = visualEl ? visualEl.querySelector('img') : null;

    const mediaKey = option.dataset.mediaKey;
    const media = mediaKey ? exerciseMedia[mediaKey] : null;

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

    // Update media key on the exercise (single source of truth)
    if (visualEl && mediaKey) visualEl.dataset.mediaKey = mediaKey;
    if (videoLink && mediaKey) videoLink.dataset.mediaKey = mediaKey;

    if (media) {
      if (videoLink && media.video) videoLink.href = media.video;
      applyMediaToVisual(visualEl, imgEl, media, option.dataset.name || (imgEl ? imgEl.alt : 'Exercise demonstration'));
    }

    // Persist selection by stable exercise id
    const exerciseId = exerciseItem.dataset.exerciseId;
    if (exerciseId && mediaKey) {
      state.selections[exerciseId] = mediaKey;
      persistState();
    }

    container.classList.remove('active');
    container.querySelectorAll('.variant-option').forEach(v => v.classList.remove('selected'));
    option.classList.add('selected');
  };

  // ---------- Event Wiring ----------
  document.addEventListener('change', function(e) {
    if (e.target && e.target.type === 'checkbox') {
      const checkId = e.target.dataset.checkId;
      if (!checkId) return;
      if (e.target.checked) state.checkmarks[checkId] = true;
      else delete state.checkmarks[checkId];
      persistState();
    }
  });

  // ---------- State + Media ----------
  function defaultState() {
    return {
      stateVersion: STATE_VERSION,
      programVersion: PROGRAM_VERSION,
      checkmarks: {},
      selections: {}
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);

      if (!parsed || typeof parsed !== 'object') return defaultState();
      if (parsed.stateVersion !== STATE_VERSION) return defaultState();
      if (parsed.programVersion !== PROGRAM_VERSION) return defaultState();

      return {
        stateVersion: STATE_VERSION,
        programVersion: PROGRAM_VERSION,
        checkmarks: parsed.checkmarks && typeof parsed.checkmarks === 'object' ? parsed.checkmarks : {},
        selections: parsed.selections && typeof parsed.selections === 'object' ? parsed.selections : {}
      };
    } catch (_) {
      return defaultState();
    }
  }

  function persistState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      // Ignore storage errors (private mode, quota, etc.)
    }
  }

  function assignStableIds() {
    document.querySelectorAll('.day').forEach(day => {
      const dayId = day.id || 'day';
      let warmIdx = 0;
      let coolIdx = 0;
      let miscIdx = 0;

      day.querySelectorAll('li').forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        if (!checkbox) return;

        const section = li.closest('.section');
        const sectionIsWarm = section && section.classList.contains('warmup');
        const sectionIsCool = section && section.classList.contains('cooldown');

        // Strength/core exercises: use the media key as stable identity when possible
        const visual = li.querySelector('.exercise-visual');
        const mediaKey = visual && visual.dataset.mediaKey ? visual.dataset.mediaKey : null;

        let itemId;
        if (li.classList.contains('exercise-li')) {
          // reserved if you later add a class
          itemId = `${dayId}-ex-${mediaKey || (miscIdx++)}`;
        } else if (visual && li.querySelector('.exercise-name')) {
          itemId = `${dayId}-ex-${mediaKey || (miscIdx++)}`;
        } else if (sectionIsWarm) {
          itemId = `${dayId}-warmup-${warmIdx++}`;
        } else if (sectionIsCool) {
          itemId = `${dayId}-cooldown-${coolIdx++}`;
        } else {
          itemId = `${dayId}-item-${miscIdx++}`;
        }

        if (!li.dataset.exerciseId && (visual && li.querySelector('.exercise-name'))) {
          li.dataset.exerciseId = itemId;
        }

        checkbox.dataset.checkId = itemId;

        // Tag variants with stable ids (variantId = mediaKey)
        const variants = li.querySelectorAll('.variant-option');
        variants.forEach(v => {
          if (v.dataset.mediaKey) {
            v.dataset.variantId = v.dataset.mediaKey;
            if (li.dataset.exerciseId) v.dataset.exerciseId = li.dataset.exerciseId;
          }
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

  function applyStateToUI() {
    const escapeCssValue = window.CSS && CSS.escape
      ? CSS.escape
      : (value) => String(value).replace(/["\\]/g, '\\$&');

    // Apply checkmarks
    document.querySelectorAll('input[type="checkbox"]').forEach(c => {
      const checkId = c.dataset.checkId;
      if (!checkId) return;
      c.checked = !!state.checkmarks[checkId];
    });

    // Apply saved variant selections
    document.querySelectorAll('li[data-exercise-id], li[data-exercise-id=""]').forEach(li => {
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
  }
});
