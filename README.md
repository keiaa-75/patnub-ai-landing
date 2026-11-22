# patnub.ai landing page

![Svelte](https://img.shields.io/badge/svelte-%23f1413d.svg?style=for-the-badge&logo=svelte&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black) ![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

This is a scroll-driven landing page for the **patnub.ai** patient app, with a placeholder page for the clinician platform. On desktop and tablet, a 3D phone walks through the app as you scroll. On phones, the same story plays out as five full-screen scenes.

## Getting Started

These steps will get a copy of the page running on your machine for development.

### Prerequisites

- Node.js 20.19 or higher
- npm

**1. Clone the repository:**

```
git clone https://github.com/keiaa-75/patnub-ai-landing.git
cd patnub-ai-landing
```

**2. Install dependencies:**

```
npm install
```

**3. Start the dev server:**

```
npm run dev
```

Vite will print the local address, usually `http://localhost:5173`.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the landing page in development |
| `npm run build` | Create a production build in `dist` |
| `npm run preview` | Serve the production build locally |
| `npm run patient-app:dev` | Preview the patient app screens on their own |
| `npm run patient-app:build` | Build the standalone screen capture page |

## Design concept

The look follows Material 3 Expressive: confident type, friendly rounded shapes, and motion that feels physical instead of mechanical.

- **Color:** a teal primary (`#0E8F7E`) with warm peach and soft mint surfaces. The page is light only.
- **Type:** Fredoka for headlines, Roboto for body text and the app UI, and Roboto Flex for the variable-width artwork.
- **Shape:** cards use uneven corner radii, and a set of morphing blobs and pills sits behind the opening scene.
- **Motion:** two kinds of spring, borrowed from Material. Position, size and rotation get a slight overshoot, while color and opacity settle with none. Both live in `src/lib/motion.js`.

## Notes for builders

- Desktop and tablet use a GSAP timeline that drives a Three.js phone. Phones use `MobileExperience.svelte`, which has no scroll scrubbing or pinning. It relies on three `IntersectionObserver`s: one plays a scene as it enters, one recolors the backdrop, and one resets a scene when it leaves so the animation can replay.
- Responsive geometry lives in one place. `src/lib/layout.js` returns the phone size and anchor points for desktop, tablet landscape and tablet portrait.
- `src/lib/PatientApp` is a Svelte reconstruction of the app, sized with container query units so it scales cleanly. It serves as the CSS fallback for the phone and as the source for the 3D screen textures (945 by 2048). Run `npm run patient-app:dev` and open `/patient-app-capture.html?screen=assistant`. The other screens are `chat`, `records`, `scan` and `medicines`.
- `public/models/Samsung_s24_ultra.gltf` references `Samsung_s24_ultra.bin` by relative name, so keep them together. The screen overlay attaches to the `GeometryNode_59` mesh in `src/lib/Phone3D.svelte`.

## Credits

Built at the **BrewCode Hackathon**, organized by the **Elite League of IT Students (ELITS)** of **Cavite State University**.

The Samsung Galaxy S24 Ultra 3D model is by Sketcher, from [Sketchfab](https://sketchfab.com/3d-models/samsung-s24-ultra-b05e35cc5fa540cba52e055b378c28bd), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), and modified for this page. Samsung, Galaxy and Samsung Galaxy S24 Ultra are trademarks of Samsung Electronics Co., Ltd. patnub.ai is not affiliated with or endorsed by Samsung.