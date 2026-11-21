# patnub.ai landing page

A Svelte 5 + Vite landing page using Material 3 Expressive-inspired styling, GSAP scroll storytelling, and a Samsung Galaxy S24 Ultra glTF model.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## 3D phone model

The 3D phone is loaded from:

- `public/models/Samsung_s24_ultra.gltf`
- `public/models/Samsung_s24_ultra.bin`

The GLTF references the companion binary by relative filename, so keep both files together. The screen overlay is attached to the `GeometryNode_59` display mesh in `src/lib/Phone3D.svelte`.

The provided model archive did not include a license file or attribution details. Verify the model's usage rights with its original source before publishing the site.

## Screen textures

The four vector textures in `public/screens/` are used on the 3D phone display. The CSS phone fallback renders the matching Svelte interface from `src/lib/DemoScreens.svelte`.

## Design system

- Brand primary: `#0E8F7E`
- Display font: Fredoka
- Body and application UI: Roboto
- Visual direction: light Material 3 Expressive-inspired surfaces and balanced rounded shapes
- Motion: GSAP + ScrollTrigger, with a reduced-motion fallback
