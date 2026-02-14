// UI controller module: workout data loading + DOM rendering helpers.
(function initWorkoutUiControllerModule() {
const WORKOUT_DATA_URL = './data/workouts.json';
let hasWarnedMissingMediaMap = false;

const getExerciseMediaMap = () => window.WorkoutMedia?.exerciseMedia || window.exerciseMedia || {};

const warnIfMediaMapUnavailable = () => {
  if (hasWarnedMissingMediaMap) return;
  const hasMediaMap = Boolean(window.WorkoutMedia?.exerciseMedia || window.exerciseMedia);
  if (!hasMediaMap) {
    console.warn('[WorkoutUIController] No exercise media map found. Media links will be disabled.');
    hasWarnedMissingMediaMap = true;
  }
};

warnIfMediaMapUnavailable();

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

const parseInstructionDurationToSeconds = (durationText = '') => {
  const normalized = String(durationText || '').trim().toLowerCase();
  if (!normalized) return null;

  const isMinuteUnit = /\bmin(?:ute)?s?\b/.test(normalized);
  const unitMultiplier = isMinuteUnit ? 60 : 1;
  const rangeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(\d+(?:\.\d+)?)/i);
  if (rangeMatch) {
    const lowerBound = Number.parseFloat(rangeMatch[1]);
    if (!Number.isFinite(lowerBound) || lowerBound <= 0) return null;
    return Math.round(lowerBound * unitMultiplier);
  }

  const singleMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!singleMatch) return null;
  const parsed = Number.parseFloat(singleMatch[1]) * unitMultiplier;
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed);
};

const getInstructionDurationSeconds = (instructions = {}) => {
  const single = Number(instructions?.durationSeconds);
  if (Number.isFinite(single) && single > 0) return Math.round(single);

  const min = Number(instructions?.durationSecondsMin);
  if (Number.isFinite(min) && min > 0) return Math.round(min);

  const max = Number(instructions?.durationSecondsMax);
  if (Number.isFinite(max) && max > 0) return Math.round(max);

  return null;
};

const getPrepItemDurationSeconds = (instructions = {}, fallbackSeconds = 0, totalItems = 0) => {
  const numericDuration = getInstructionDurationSeconds(instructions);
  if (Number.isFinite(numericDuration) && numericDuration > 0) {
    return numericDuration;
  }

  const parsedInstructionDuration = parseInstructionDurationToSeconds(instructions?.time);
  if (Number.isFinite(parsedInstructionDuration) && parsedInstructionDuration > 0) {
    return parsedInstructionDuration;
  }
  if (Number.isFinite(fallbackSeconds) && fallbackSeconds > 0 && Number.isFinite(totalItems) && totalItems > 0) {
    return Math.max(10, Math.round(fallbackSeconds / totalItems));
  }
  return 60;
};

const getInstructionRestSeconds = (instructions = {}) => {
  const min = Number(instructions?.restSecondsMin);
  if (Number.isFinite(min) && min > 0) return Math.round(min);

  const max = Number(instructions?.restSecondsMax);
  if (Number.isFinite(max) && max > 0) return Math.round(max);

  return null;
};

const parseRestDurationToSeconds = (restText = '') => {
  const normalized = String(restText || '').trim().toLowerCase();
  if (!normalized) return null;

  const unitMultiplier = /\bmin(?:ute)?s?\b/.test(normalized) ? 60 : 1;
  const rangeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(\d+(?:\.\d+)?)/i);
  if (rangeMatch) {
    const lowerBound = Number.parseFloat(rangeMatch[1]);
    if (!Number.isFinite(lowerBound) || lowerBound <= 0) return null;
    return Math.round(lowerBound * unitMultiplier);
  }

  const singleMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  if (!singleMatch) return null;
  const seconds = Number.parseFloat(singleMatch[1]) * unitMultiplier;
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  return Math.round(seconds);
};

const getExerciseRestSeconds = (exerciseItem) => {
  const parsed = Number.parseInt(exerciseItem?.dataset?.restSeconds || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const EXERCISE_ITEM_SELECTOR = '.exercise-item[data-exercise-id]';
const EXERCISE_CONTAINER_SELECTOR = '.exercise-item, .exercise-card';

const getCanonicalExerciseTitle = (item = {}, isVariant = false) => {
  return (isVariant ? item.label : item.name) || '';
};

const buildExerciseDisplayLabel = (item = {}, isVariant = false) => {
  const canonicalTitle = getCanonicalExerciseTitle(item, isVariant);
  const sets = String(item?.instructions?.sets || '').trim();
  const computedLabel = sets ? `${canonicalTitle} — ${sets}` : canonicalTitle;
  const shortName = String(item.shortName || '').trim();
  if (shortName && shortName !== canonicalTitle && shortName !== computedLabel) {
    return shortName;
  }
  return computedLabel;
};

const renderWorkoutUI = (data = {}) => {
  if (!data || !Array.isArray(data.days)) return;
  const mediaMap = getExerciseMediaMap();
  warnIfMediaMapUnavailable();
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

      const list = document.createElement('div');
      list.className = 'exercise-card-list';
      const sectionItems = section.items || [];
      const prepItems = sectionItems.filter((item) => (item?.itemType || section.type) !== 'strength');
      const sectionDurationSeconds = parseDurationFromTitle(section.title, section.type);

      sectionItems.forEach((item) => {
        if (!item || typeof item !== 'object') return;
        const itemType = item.itemType || section.type;
        const isStrength = itemType === 'strength';
        const itemName = buildExerciseDisplayLabel(item);

        const listItem = document.createElement('div');
        listItem.className = isStrength
          ? 'exercise-card exercise-item workout-item'
          : 'exercise-card workout-item prep-item';
        if (item.id) listItem.dataset.exerciseId = item.id;
        const bodyId = `${day.id || 'day'}-exercise-card-body-${cardBodyCounter++}`;

        const header = document.createElement('div');
        header.className = 'exercise-card__header';
        const titleEl = document.createElement('span');
        titleEl.className = 'exercise-card__title';
        titleEl.textContent = itemName;
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

        if (item.instructions && item.instructions.sets) {
          listItem.dataset.recommendedSets = item.instructions.sets;
        }

        const numericRestSeconds = getInstructionRestSeconds(item.instructions);
        const parsedRestSeconds = Number.isFinite(numericRestSeconds)
          ? numericRestSeconds
          : parseRestDurationToSeconds(item.instructions?.rest);
        if (Number.isFinite(parsedRestSeconds) && parsedRestSeconds > 0) {
          listItem.dataset.restSeconds = String(parsedRestSeconds);
        }

        if (isStrength) {
          const exerciseWrap = document.createElement('div');
          exerciseWrap.className = 'exercise';

          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          label.appendChild(checkbox);
          exerciseWrap.appendChild(label);

          const visual = document.createElement('div');
          visual.className = 'exercise-visual';
          if (item.mediaKey) visual.dataset.mediaKey = item.mediaKey;

          const img = document.createElement('img');
          img.src = '';
          img.alt = getCanonicalExerciseTitle(item) || 'Exercise demonstration';
          visual.appendChild(img);

          const expandHint = document.createElement('div');
          expandHint.className = 'expand-hint';
          expandHint.textContent = '🔍';
          visual.appendChild(expandHint);
          exerciseWrap.appendChild(visual);

          body.appendChild(exerciseWrap);
        } else {
          const card = document.createElement('div');
          card.className = 'prep-card';
          const label = document.createElement('label');
          label.className = 'prep-label';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          label.appendChild(checkbox);
          card.appendChild(label);
          body.appendChild(card);
        }

        const instructionsEl = document.createElement('div');
        instructionsEl.className = 'instructions';
        instructionsEl.innerHTML = buildInstructionHtml(item.instructions || {});
        body.appendChild(instructionsEl);

        listItem.dataset.coaching = item.instructions?.notes || '';
        const coachTip = document.createElement('div');
        coachTip.className = 'coach-tip';
        setCoachTip(coachTip, item.instructions?.notes);
        body.appendChild(coachTip);

        if (isStrength) {
          const progressionHint = document.createElement('div');
          progressionHint.className = 'progression-hint';
          progressionHint.textContent = 'Log a session to get progression tips.';
          body.appendChild(progressionHint);

          const videoLink = document.createElement('a');
          const media = item.mediaKey ? mediaMap[item.mediaKey] : null;
          const hasVideo = Boolean(media?.video);
          videoLink.href = hasVideo ? media.video : '#';
          if (item.mediaKey) videoLink.dataset.mediaKey = item.mediaKey;
          if (hasVideo) {
            videoLink.target = '_blank';
            videoLink.rel = 'noopener noreferrer';
          } else {
            videoLink.setAttribute('aria-disabled', 'true');
            videoLink.style.opacity = '0.55';
            videoLink.style.pointerEvents = 'none';
            videoLink.style.cursor = 'not-allowed';
          }
          videoLink.className = 'video-link';
          videoLink.textContent = hasVideo ? 'Watch Form Tutorial' : 'Form Tutorial Unavailable';
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
          if (item.id) baseOption.dataset.variantId = item.id;
          baseOption.dataset.name = itemName;
          baseOption.dataset.instructions = buildInstructionString(item.instructions);
          const baseNumericRestSeconds = getInstructionRestSeconds(item.instructions);
          const baseRestSeconds = Number.isFinite(baseNumericRestSeconds)
            ? baseNumericRestSeconds
            : parseRestDurationToSeconds(item.instructions?.rest);
          if (Number.isFinite(baseRestSeconds) && baseRestSeconds > 0) {
            baseOption.dataset.restSeconds = String(baseRestSeconds);
          }
          if (item.instructions && item.instructions.sets) {
            baseOption.dataset.recommendedSets = item.instructions.sets;
          }
          baseOption.dataset.coaching = item.instructions?.notes || '';
          if (item.mediaKey) baseOption.dataset.mediaKey = item.mediaKey;

          const baseLabelText = itemName ? `Original: ${itemName}` : 'Original exercise';
          const baseLabel = document.createTextNode(baseLabelText);
          baseOption.appendChild(baseLabel);
          variantsList.appendChild(baseOption);

          (item.variants || []).forEach((variant) => {
            const option = document.createElement('div');
            option.className = 'variant-option';
            if (variant.id) option.dataset.variantId = variant.id;
            option.dataset.name = buildExerciseDisplayLabel(variant, true);
            option.dataset.instructions = buildInstructionString(variant.instructions);
            const variantNumericRestSeconds = getInstructionRestSeconds(variant.instructions);
            const variantRestSeconds = Number.isFinite(variantNumericRestSeconds)
              ? variantNumericRestSeconds
              : parseRestDurationToSeconds(variant.instructions?.rest);
            if (Number.isFinite(variantRestSeconds) && variantRestSeconds > 0) {
              option.dataset.restSeconds = String(variantRestSeconds);
            }
            if (variant.instructions && variant.instructions.sets) {
              option.dataset.recommendedSets = variant.instructions.sets;
            }
            option.dataset.coaching = variant.instructions?.notes || '';
            if (variant.mediaKey) option.dataset.mediaKey = variant.mediaKey;

            const labelText = document.createTextNode(buildExerciseDisplayLabel(variant, true));
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
        } else {
          const timerWrap = document.createElement('div');
          timerWrap.className = 'section-timer';
          timerWrap.dataset.sectionType = itemType;
          timerWrap.dataset.exerciseName = itemName || section.title || 'Exercise';
          timerWrap.dataset.duration = String(
            getPrepItemDurationSeconds(item.instructions, sectionDurationSeconds, prepItems.length)
          );
          timerWrap.innerHTML = `
            <div class="section-timer__summary">
              <div class="section-timer__header">
                <span class="timer-label">${itemType === 'warmup' ? 'Warm-up timer' : 'Cooldown timer'}</span>
                <span class="section-timer-pill" role="status" aria-live="polite" data-state="ready">Ready</span>
              </div>
              <span class="timer-display">00:00</span>
            </div>
            <div class="timer-actions">
              <button type="button" class="ghost-button start-timer">Start</button>
              <button type="button" class="ghost-button stop-timer" disabled>Stop</button>
            </div>
          `;
          body.appendChild(timerWrap);
        }

        listItem.appendChild(body);
        list.appendChild(listItem);
      });

      sectionEl.appendChild(list);
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


  window.WorkoutUIController = {
    WORKOUT_DATA_URL,
    EXERCISE_ITEM_SELECTOR,
    EXERCISE_CONTAINER_SELECTOR,
    escapeHtml,
    buildInstructionString,
    buildInstructionHtml,
    setCoachTip,
    parseDurationFromTitle,
    parseInstructionDurationToSeconds,
    getInstructionDurationSeconds,
    getPrepItemDurationSeconds,
    getInstructionRestSeconds,
    parseRestDurationToSeconds,
    getExerciseRestSeconds,
    renderWorkoutUI,
    loadWorkoutData
  };
})();
