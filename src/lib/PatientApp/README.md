# Patient app mockup screens

These Svelte components reconstruct the four patient-app screens used by the landing-page phone mockup. `DemoScreens.svelte` uses this same component tree for the CSS fallback; `public/screens/*.png` are the matching 945 × 2048 textures used by the Three.js phone.

## Preview

Run `npm run patient-app:dev`, then open:

- `/patient-app-capture.html?screen=assistant`
- `/patient-app-capture.html?screen=records`
- `/patient-app-capture.html?screen=scan`
- `/patient-app-capture.html?screen=medicines`

The scan screen contains a decorative sample QR code only. It is not a real patient check-in credential.
