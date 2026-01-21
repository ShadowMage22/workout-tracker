let deferredPrompt;

// Centralized exercise media database
const exerciseMedia = {
  // PUSH
  "flat-bench-press": {
    video: "https://www.youtube.com/watch?v=gRVjAtPip0Y",
    img: "https://i.ytimg.com/vi/gRVjAtPip0Y/mqdefault.jpg",
    imgFull: "./media/push/Bench-Press.mp4"
  },
  "push-ups": {
    video: "https://www.youtube.com/watch?v=_l3ySVKYVJ8",
    img: "https://i.ytimg.com/vi/_l3ySVKYVJ8/mqdefault.jpg",
    imgFull: "./media/push/pushup.mp4"
  },
  "chest-fly": {
    video: "https://www.youtube.com/watch?v=eozdVDA78K0",
    img: "https://i.ytimg.com/vi/eozdVDA78K0/mqdefault.jpg",
    imgFull: "./media/push/chest-fly.mp4"
  },
  "overhead-press": {
    video: "https://www.youtube.com/watch?v=qEwKCR5JCog",
    img: "https://i.ytimg.com/vi/qEwKCR5JCog/mqdefault.jpg",
    imgFull: "./media/push/overhead-press.mp4"
  },
  "arnold-press": {
    video: "https://www.youtube.com/watch?v=vj2w851ZHRM",
    img: "https://i.ytimg.com/vi/vj2w851ZHRM/mqdefault.jpg",
    imgFull: "./media/push/arnold-press.mp4"
  },
  "landmine-press": {
    video: "https://www.youtube.com/watch?v=G0ZxJwTny3U",
    img: "https://i.ytimg.com/vi/G0ZxJwTny3U/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/G0ZxJwTny3U/hqdefault.jpg"
  },
  "incline-press": {
    video: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
    img: "https://i.ytimg.com/vi/8iPEnn-ltC8/mqdefault.jpg",
    imgFull: "./media/push/dumbbell-incline-chest-press.gif"
  },
  "incline-fly": {
    video: "https://www.youtube.com/watch?v=3xKsdFfbYTM",
    img: "https://i.ytimg.com/vi/3xKsdFfbYTM/mqdefault.jpg",
    imgFull: "./media/push/dumbbell-incline-fly.gif"
  },
  "cable-fly": {
    video: "https://www.youtube.com/watch?v=taI4XduLpTk",
    img: "https://i.ytimg.com/vi/taI4XduLpTk/mqdefault.jpg",
    imgFull: "./media/push/low-cable-chest-flys.gif"
  },
  "tricep-pushdown": {
    video: "https://www.youtube.com/watch?v=2-LqU9xeYVY",
    img: "https://i.ytimg.com/vi/2-LqU9xeYVY/mqdefault.jpg",
    imgFull: "./media/push/tricep-pushdown.gif"
  },
  "overhead-tricep-ext": {
    video: "https://www.youtube.com/watch?v=GzmlxvSFE7A",
    img: "https://i.ytimg.com/vi/GzmlxvSFE7A/mqdefault.jpg",
    imgFull: "./media/push/overhead-tricep-extension.gif"
  },
  "close-grip-pushup": {
    video: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    img: "https://i.ytimg.com/vi/IODxDxX7oi4/mqdefault.jpg",
    imgFull: "./media/push/close-grip-push-up.gif"
  },
  "plank": {
    video: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
    img: "https://i.ytimg.com/vi/pSHjTRCQxIw/mqdefault.jpg",
    imgFull: "./media/push/plank.gif"
  },
  "mountain-climbers": {
    video: "https://www.youtube.com/watch?v=nmwgirgXLYM",
    img: "https://i.ytimg.com/vi/nmwgirgXLYM/mqdefault.jpg",
    imgFull: "./media/push/mountain-climbers.gif"
  },
  "ab-wheel": {
    video: "https://www.youtube.com/watch?v=F2D08SHuZco",
    img: "https://i.ytimg.com/vi/F2D08SHuZco/mqdefault.jpg",
    imgFull: "./media/push/ab-wheel-rollout.mp4"
  },

  // PULL
  "cable-row": {
    video: "https://www.youtube.com/watch?v=7BkgqzC6WsM",
    img: "https://i.ytimg.com/vi/7BkgqzC6WsM/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/7BkgqzC6WsM/hqdefault.jpg"
  },
  "dumbbell-row": {
    video: "https://www.youtube.com/watch?v=gfUg6qWohTk",
    img: "https://i.ytimg.com/vi/gfUg6qWohTk/mqdefault.jpg",
    imgFull: "./media/pull/Dumbbell-Row.gif"
  },
  "barbell-row": {
    video: "https://www.youtube.com/watch?v=vT2GjY_Umpw",
    img: "https://i.ytimg.com/vi/vT2GjY_Umpw/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/vT2GjY_Umpw/hqdefault.jpg"
  },
  "lat-pulldown": {
    video: "https://www.youtube.com/watch?v=SALxEARiMkw",
    img: "https://i.ytimg.com/vi/SALxEARiMkw/mqdefault.jpg",
    imgFull: "./media/pull/Lat-Pulldown.gif"
  },
  "pull-ups": {
    video: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
    img: "https://i.ytimg.com/vi/eGo4IYlbE5g/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/eGo4IYlbE5g/hqdefault.jpg"
  },
  "straight-arm-pulldown": {
    video: "https://www.youtube.com/watch?v=ko0bgiRn0uQ",
    img: "https://i.ytimg.com/vi/ko0bgiRn0uQ/mqdefault.jpg",
    imgFull: "./media/pull/Stratight-Arm-Pulldown.gif"
  },
  "face-pulls": {
    video: "https://www.youtube.com/watch?v=dT1L1dRX494",
    img: "https://i.ytimg.com/vi/dT1L1dRX494/mqdefault.jpg",
    imgFull: "./media/pull/Face-pull.gif"
  },
  "reverse-fly": {
    video: "https://www.youtube.com/watch?v=KlQf6K-1Bfc",
    img: "https://i.ytimg.com/vi/KlQf6K-1Bfc/mqdefault.jpg",
    imgFull: "./media/pull/Dumbbell-Reverse-Fly.gif"
  },
  "upright-row": {
    video: "https://www.youtube.com/watch?v=7F1KhyI36zI",
    img: "https://i.ytimg.com/vi/7F1KhyI36zI/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/7F1KhyI36zI/hqdefault.jpg"
  },
  "bicep-curls": {
    video: "https://www.youtube.com/watch?v=NFzTWp2qpiE",
    img: "https://i.ytimg.com/vi/NFzTWp2qpiE/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/NFzTWp2qpiE/hqdefault.jpg"
  },
  "hammer-curls": {
    video: "https://www.youtube.com/watch?v=zC3nLlEvin4",
    img: "https://i.ytimg.com/vi/zC3nLlEvin4/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/zC3nLlEvin4/hqdefault.jpg"
  },
  "cable-curls": {
    video: "https://www.youtube.com/watch?v=2bxX2cFHtos",
    img: "https://i.ytimg.com/vi/2bxX2cFHtos/mqdefault.jpg",
    imgFull: "./media/pull/cable-curls.gif"
  },
  "dead-bug": {
    video: "https://www.youtube.com/watch?v=GZD20NNrE0E",
    img: "https://i.ytimg.com/vi/GZD20NNrE0E/mqdefault.jpg",
    imgFull: "./media/pull/dead-bug.gif"
  },
  "bird-dog": {
    video: "https://www.youtube.com/watch?v=vzYZ9hE2XjM",
    img: "https://i.ytimg.com/vi/vzYZ9hE2XjM/mqdefault.jpg",
    imgFull: "./media/pull/Birddog.gif"
  },
  "hollow-body": {
    video: "https://www.youtube.com/watch?v=Kd7gKchqR0g",
    img: "https://i.ytimg.com/vi/Kd7gKchqR0g/mqdefault.jpg",
    imgFull: "./media/pull/lying-body-hold.gif"
  },

  // LEGS
  "goblet-squat": {
    video: "https://www.youtube.com/watch?v=MeIiIdhvXT4",
    img: "https://i.ytimg.com/vi/MeIiIdhvXT4/mqdefault.jpg",
    imgFull: "./media/legs/goblet-squat.gif"
  },
  "back-squat": {
    video: "https://www.youtube.com/watch?v=aclHkVaku9U",
    img: "https://i.ytimg.com/vi/aclHkVaku9U/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/aclHkVaku9U/hqdefault.jpg"
  },
  "leg-press": {
    video: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
    img: "https://i.ytimg.com/vi/IZxyjW7MPJQ/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/IZxyjW7MPJQ/hqdefault.jpg"
  },
  "rdl": {
    video: "https://www.youtube.com/watch?v=2SHsk9AzdjA",
    img: "https://i.ytimg.com/vi/2SHsk9AzdjA/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/2SHsk9AzdjA/hqdefault.jpg"
  },
  "leg-curl": {
    video: "https://www.youtube.com/watch?v=1Tq3QdYUuHs",
    img: "https://i.ytimg.com/vi/1Tq3QdYUuHs/mqdefault.jpg",
    imgFull: "./media/legs/seated-leg-curl.gif"
  },
  "good-mornings": {
    video: "https://www.youtube.com/watch?v=W8PPpF2ZJYc",
    img: "https://i.ytimg.com/vi/W8PPpF2ZJYc/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/W8PPpF2ZJYc/hqdefault.jpg"
  },
  "bulgarian-split-squat": {
    video: "https://www.youtube.com/watch?v=2C-uNgKwPLE",
    img: "https://i.ytimg.com/vi/2C-uNgKwPLE/mqdefault.jpg",
    imgFull: "./media/legs/Bodyweight-Bulgarian-Split-Squat.gif"
  },
  "walking-lunges": {
    video: "https://www.youtube.com/watch?v=QOVaHwm-QHQ",
    img: "https://i.ytimg.com/vi/QOVaHwm-QHQ/mqdefault.jpg",
    imgFull: "./media/legs/Walking-Lunges.gif"
  },
  "step-ups": {
    video: "https://www.youtube.com/watch?v=dQqApCGd5Ss",
    img: "https://i.ytimg.com/vi/dQqApCGd5Ss/mqdefault.jpg",
    imgFull: "./media/legs/step-ups.gif"
  },
  "calf-raises": {
    video: "https://www.youtube.com/watch?v=-M4-G9pK8pE",
    img: "https://i.ytimg.com/vi/-M4-G9pK8pE/mqdefault.jpg",
    imgFull: "./media/legs/standing-calf-raise.gif"
  },
  "seated-calf-raise": {
    video: "https://www.youtube.com/watch?v=YMmgqO8Jo-Y",
    img: "https://i.ytimg.com/vi/YMmgqO8Jo-Y/mqdefault.jpg",
    imgFull: "./media/legs/seated-calf-raise-dumbbell.gif"
  },
  "single-calf": {
    video: "https://www.youtube.com/watch?v=ElcvJ0kjt6c",
    img: "https://i.ytimg.com/vi/ElcvJ0kjt6c/mqdefault.jpg",
    imgFull: "https://img.youtube.com/vi/ElcvJ0kjt6c/hqdefault.jpg"
  },
  "side-plank": {
    video: "https://www.youtube.com/watch?v=K2VljzCC16g",
    img: "https://i.ytimg.com/vi/K2VljzCC16g/mqdefault.jpg",
    imgFull: "./media/legs/side-plank.gif"
  },
  "pallof-press": {
    video: "https://www.youtube.com/watch?v=Ex7kQRyWbEk",
    img: "https://i.ytimg.com/vi/Ex7kQRyWbEk/mqdefault.jpg",
    imgFull: "./media/legs/pallof-press.gif"
  },
  "russian-twists": {
    video: "https://www.youtube.com/watch?v=wkD8rjkodUI",
    img: "https://i.ytimg.com/vi/wkD8rjkodUI/mqdefault.jpg",
    imgFull: "./media/legs/russian-twist.gif"
  }
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      console.log('Service worker registration failed');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'workoutTrackerState';
  const STATE_VERSION = 1;
  const PROGRAM_VERSION = '2026-01-v2.1';

  // In-memory working state (persisted to localStorage)
  let state = loadState();

  enhanceAccessibility();
  assignStableIds();
  applyMediaFromKeys();
  applyStateToUI();

  // ---------- Public API ----------
  window.showDay = function(dayId, tabBtn) {
    const day = document.getElementById(dayId);
    if (!day || !tabBtn) return;
    document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    day.classList.add('active');
    tabBtn.classList.add('active');
  };

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
      const previewSrc = getPreviewImage(media);
      if (imgEl && previewSrc) {
        imgEl.src = previewSrc;
        imgEl.alt = option.dataset.name || imgEl.alt;
        if (visualEl && imgEl.alt) {
          visualEl.setAttribute('aria-label', imgEl.alt);
        }
      }
      if (visualEl && media.imgFull) {
        visualEl.onclick = (e) => expandMedia(e, media.imgFull, imgEl ? imgEl.alt : undefined);
      }
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
      if (!mediaKey || !exerciseMedia[mediaKey]) return;

      const media = exerciseMedia[mediaKey];
      const img = visual.querySelector('img');
      const previewSrc = getPreviewImage(media);
      if (img && previewSrc) img.src = previewSrc;
      if (media.imgFull) {
        visual.onclick = (e) => expandMedia(e, media.imgFull, img ? img.alt : undefined);
      }
    });

    // Initialize all video links from centralized media
    document.querySelectorAll('.video-link').forEach(link => {
      const mediaKey = link.dataset.mediaKey;
      if (!mediaKey || !exerciseMedia[mediaKey] || !exerciseMedia[mediaKey].video) return;
      link.href = exerciseMedia[mediaKey].video;
    });
  }

  function applyStateToUI() {
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

      const option = li.querySelector(`.variant-option[data-media-key="${CSS.escape(selectedKey)}"]`);
      if (option) {
        // Update selection styling + UI media
        window.selectVariant(option);
      }
    });
  }
});
