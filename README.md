# workout-tracker

## Test Parameters

Use the following parameters when validating the workout tracker experience.

### Environments
- **Browsers:** Latest Chrome, Firefox, Safari.
- **Devices:** Desktop (≥1280px), tablet (~768px), mobile (~375px).
- **Connectivity:** Online (full media/video access) and offline (cached assets only).

### Test Data
- **Workout types:** Push, Pull, Legs.
- **Exercises per workout:** 1, 3, and 8 entries.
- **Timers:** 30s, 60s, and 90s intervals.

### Scenarios
- **Add + edit flow:** Create a workout, update an exercise entry, and confirm the saved values persist on refresh.
- **Media validation:** Open an exercise and ensure the GIF loads and the video link opens.
- **Offline fallback:** Load the app online, go offline, and confirm cached UI renders without errors.
