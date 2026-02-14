// Media module: media map + visual rendering/lazy loading helpers.
(function initWorkoutMediaModule() {
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


  window.exerciseMedia = exerciseMedia;

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
    container.textContent = '';

    if (isVideoSource(url)) {
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      container.appendChild(video);
    } else {
      const image = document.createElement('img');
      image.src = url;
      image.alt = safeAlt;
      container.appendChild(image);
    }
    overlay.classList.add('active');
  };

  window.closeOverlay = function() {
    const overlay = document.getElementById('svgOverlay');
    if (overlay) overlay.classList.remove('active');
  };



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


  window.WorkoutMedia = {
    exerciseMedia,
    applyMediaToVisual,
    applyMediaFromKeys,
    initLazyMedia
  };
})();
