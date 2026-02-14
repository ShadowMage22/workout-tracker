// UI controller module: workout data loading + DOM rendering helpers.
(function initWorkoutUiControllerModule() {
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

const getPrepItemDurationSeconds = (instructions = {}, fallbackSeconds = 0, totalItems = 0) => {
  const parsedInstructionDuration = parseInstructionDurationToSeconds(instructions?.time);
  if (Number.isFinite(parsedInstructionDuration) && parsedInstructionDuration > 0) {
    return parsedInstructionDuration;
  }
  if (Number.isFinite(fallbackSeconds) && fallbackSeconds > 0 && Number.isFinite(totalItems) && totalItems > 0) {
    return Math.max(10, Math.round(fallbackSeconds / totalItems));
  }
  return 60;
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
          const parsedRestSeconds = parseRestDurationToSeconds(exercise.instructions?.rest);
          if (Number.isFinite(parsedRestSeconds) && parsedRestSeconds > 0) {
            listItem.dataset.restSeconds = String(parsedRestSeconds);
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
          const baseRestSeconds = parseRestDurationToSeconds(exercise.instructions?.rest);
          if (Number.isFinite(baseRestSeconds) && baseRestSeconds > 0) {
            baseOption.dataset.restSeconds = String(baseRestSeconds);
          }
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
            const variantRestSeconds = parseRestDurationToSeconds(variant.instructions?.rest);
            if (Number.isFinite(variantRestSeconds) && variantRestSeconds > 0) {
              option.dataset.restSeconds = String(variantRestSeconds);
            }
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
        const prepItems = section.items || [];
        const sectionDurationSeconds = parseDurationFromTitle(section.title, section.type);
        prepItems.forEach(item => {
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

          const timerWrap = document.createElement('div');
          timerWrap.className = 'section-timer';
          timerWrap.dataset.sectionType = section.type;
          timerWrap.dataset.exerciseName = itemName || section.title || 'Exercise';
          timerWrap.dataset.duration = String(
            getPrepItemDurationSeconds(itemInstructions, sectionDurationSeconds, prepItems.length)
          );
          timerWrap.innerHTML = `
            <div class="section-timer__summary">
              <div class="section-timer__header">
                <span class="timer-label">${section.type === 'warmup' ? 'Warm-up timer' : 'Cooldown timer'}</span>
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
    getPrepItemDurationSeconds,
    parseRestDurationToSeconds,
    getExerciseRestSeconds,
    renderWorkoutUI,
    loadWorkoutData
  };
})();
