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

## iOS/iPadOS Installation Notes
- **Safari steps:** Open the app in Safari, tap **Share**, then choose **Add to Home Screen**.
- **Install button behavior:** The in-app Install button only works in browsers that support the `beforeinstallprompt` event (for example, Chrome or Edge on desktop Android).
