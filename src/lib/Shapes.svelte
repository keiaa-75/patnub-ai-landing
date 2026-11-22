<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { spatial, effects } from './motion.js';

  let { beats = 5, mode = 'desktop' } = $props();

  /*
    A small family of Material Expressive shapes that lives behind the phone.
    The same shapes move between layouts on every beat (they are never
    recreated), so the background reads as one system.

    Blobs are drawn from polar radii, so any two of them can morph into each
    other. Pills are plain rounded rectangles.

    Modes
    -----
    desktop  Original behaviour. Sized from the stage height, hidden below
             641px, with scroll parallax.
    mobile   Used by MobileExperience for the opening scene only. The layer
             is fixed to the viewport, sized from the shorter viewport side,
             and holds a single layout. There is no parallax, and goTo() does
             nothing, because the shapes never change layout.

    Performance notes:
      - Continuous spinning and swaying run as CSS animations on promoted
        layers, so they cost no JavaScript per frame.
      - Each shape's element is only as big as the largest size it ever uses.
      - Only one blob morphs at a time, and never during a beat change.
      - Nothing appears until enter() is called, so the entrance does not
        compete with other work on load.
  */

  const mobile = $derived(mode === 'mobile');

  const N = 72;
  const TAU = Math.PI * 2;

  const normalized = (fn) => {
    const raw = Array.from({ length: N }, (_, i) => fn((i / N) * TAU));
    const max = Math.max(...raw);
    return Float32Array.from(raw, (value) => (value / max) * 0.97);
  };

  // n rounded lobes with pinched valleys.
  const lobes = (n, base, amp, power) => (t) =>
    base + amp * Math.pow(Math.abs(Math.cos((n * t) / 2)), power);

  const PRESETS = {
    cookie9: normalized(lobes(9, 0.8, 0.2, 0.8)),
    clover4: normalized(lobes(4, 0.52, 0.48, 0.75)),
    flower5: normalized(lobes(5, 0.62, 0.38, 0.9)),
    burst10: normalized((t) => 0.74 + 0.26 * Math.pow((1 + Math.cos(10 * t)) / 2, 1.5)),
    pebble3: normalized((t) => 0.86 + 0.14 * Math.cos(3 * t)),
    squircle: normalized((t) =>
      1 / Math.pow(Math.pow(Math.abs(Math.cos(t)), 4) + Math.pow(Math.abs(Math.sin(t)), 4), 0.25)
    )
  };

  // Closed Catmull-Rom curve through the radii, written as cubic beziers.
  const toPath = (radii) => {
    const points = Array.from(radii, (r, i) => {
      const angle = (i / N) * TAU;
      return [r * Math.cos(angle), r * Math.sin(angle)];
    });

    const at = (i) => points[(i + N) % N];
    const f = (value) => value.toFixed(3);

    let d = `M${f(points[0][0])} ${f(points[0][1])}`;

    for (let i = 0; i < N; i += 1) {
      const p0 = at(i - 1);
      const p1 = at(i);
      const p2 = at(i + 1);
      const p3 = at(i + 2);

      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ` +
        `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ` +
        `${f(p2[0])} ${f(p2[1])}`;
    }

    return `${d}Z`;
  };

  /*
    Index order matters: it matches every row of the layout tables below.
    spin is the seconds per turn; a negative value turns the other way.
  */
  const SHAPES = [
    { id: 'halo', kind: 'blob', cycle: ['cookie9', 'flower5', 'burst10'], depth: 0.4, spin: 80 },
    { id: 'burst', kind: 'blob', cycle: ['burst10', 'cookie9', 'clover4'], depth: 0.8, spin: -65 },
    { id: 'clover', kind: 'blob', cycle: ['clover4', 'pebble3', 'cookie9'], depth: 1.1, spin: 55 },
    { id: 'squircle', kind: 'blob', cycle: ['squircle', 'pebble3', 'flower5'], depth: 0.6, spin: -90 },
    { id: 'flower', kind: 'blob', cycle: ['flower5', 'clover4', 'burst10'], depth: 0.9, spin: 70 },
    { id: 'pebble', kind: 'blob', cycle: ['pebble3', 'squircle', 'cookie9'], depth: 1.3, spin: -50 },
    { id: 'pill-a', kind: 'pill', depth: 1.2, spin: 3.6 },
    { id: 'pill-b', kind: 'pill', depth: 0.7, spin: 4.4 }
  ];

  // x, y: centre as a fraction of the stage. k: size in units (0 hides it).
  // r: rotation in degrees. c: fill.
  // Desktop units are stage heights; mobile units are the shorter viewport side.
  const L = (x, y, k, r, c) => ({ x, y, k, r, c });
  const OFF = (x, y, c) => ({ x, y, k: 0, r: 0, c });

  const PEACH = [
    L(0.88, 0.12, 0.62, 15, '#f6c898'),
    L(0.1, 0.88, 0.55, -10, '#ffe9d2'),
    L(0.93, 0.9, 0.36, 20, '#e9b07a'),
    L(0.05, 0.14, 0.24, -20, '#f9d3ae'),
    OFF(0.5, 1.15, '#ffe9d2'),
    OFF(0.7, 0.5, '#f9d3ae'),
    L(0.2, 0.8, 1, 35, '#d99a62'),
    L(0.8, 0.25, 1, -25, '#d99a62')
  ];

  const TEAL = [
    L(0.72, 0.5, 1.0, 0, '#17796c'),
    L(0.06, 0.92, 0.52, 10, '#0b5148'),
    L(0.95, 0.08, 0.4, -15, '#2f8f82'),
    L(0.44, 0.1, 0.2, 25, '#ffddbd'),
    L(0.55, 0.94, 0.3, 0, '#1f8173'),
    L(0.62, 0.78, 0.16, 40, '#9adbcb'),
    L(0.12, 0.2, 1, 30, '#ffddbd'),
    L(0.56, 0.32, 0.9, -20, '#9adbcb')
  ];

  const WHITE = [
    L(0.28, 0.5, 1.0, 0, '#e3f4ef'),
    L(0.97, 0.94, 0.55, -8, '#ffe8d1'),
    L(0.5, 0.06, 0.3, 18, '#c9eee5'),
    L(0.04, 0.1, 0.22, -18, '#ffddbd'),
    L(0.46, 0.92, 0.26, 0, '#d5e8e1'),
    L(0.92, 0.1, 0.2, 30, '#c9eee5'),
    L(0.47, 0.3, 1, 40, '#ffddbd'),
    L(0.1, 0.84, 1, -30, '#c9eee5')
  ];

  /*
    Mobile: the single layout used behind the opening scene (peach).

    Shapes hug the edges and corners so they frame the headline instead of
    sitting under it. Sizes are fractions of the shorter viewport side.
  */
  const MOBILE_LAYOUT = [
    L(0.92, 0.14, 0.9, 15, '#f6c898'),
    L(0.04, 0.88, 0.8, -10, '#ffe9d2'),
    L(0.98, 0.74, 0.5, 20, '#e9b07a'),
    L(0.08, 0.2, 0.34, -20, '#f9d3ae'),
    OFF(0.5, 1.15, '#ffe9d2'),
    OFF(0.7, 0.5, '#f9d3ae'),
    L(0.2, 0.62, 1, 35, '#d99a62'),
    L(0.82, 0.36, 1, -25, '#d99a62')
  ];

  // Each element is as big as the largest size its shape ever uses, and is
  // only scaled down from there. Small shapes therefore stay small layers.
  const DESKTOP_SIZE = SHAPES.map((_, i) =>
    Math.max(PEACH[i].k, TEAL[i].k, WHITE[i].k)
  );

  const MOBILE_SIZE = SHAPES.map((_, i) => MOBILE_LAYOUT[i].k);

  const SIZE = $derived(mobile ? MOBILE_SIZE : DESKTOP_SIZE);

  // Each feature beat nudges and turns the white layout a little further.
  const DRIFT = [
    [0, 0], [-0.02, -0.015], [0.05, 0.01], [0.03, 0.05],
    [-0.04, -0.01], [-0.03, 0.04], [0, 0.05], [0.03, -0.04]
  ];

  const layoutFor = (beat) => {
    if (mobile) return MOBILE_LAYOUT;

    if (beat <= 0) return PEACH;
    if (beat === 1) return TEAL;

    const n = beat - 2;

    return WHITE.map((shape, i) => ({
      ...shape,
      x: shape.x + DRIFT[i][0] * n,
      y: shape.y + DRIFT[i][1] * n,
      r: shape.r + n * 35
    }));
  };

  const api = { goTo: () => {}, setProgress: () => {}, enter: () => {} };

  let host;
  const shapeEls = [];
  const parEls = [];
  const innerEls = [];
  const pathEls = [];

  onMount(() => {
    // Desktop mode keeps its original rule: tablets and up only.
    // Mobile mode is the one place these shapes are meant for small screens.
    if (!mobile && !window.matchMedia('(min-width: 641px)').matches) return;

    const size = { w: 1, h: 1 };
    const blobIndexes = SHAPES.flatMap((shape, i) => (shape.kind === 'blob' ? [i] : []));
    const radii = SHAPES.map((shape) =>
      shape.kind === 'blob' ? Float32Array.from(PRESETS[shape.cycle[0]]) : null
    );
    const cycleIndex = SHAPES.map(() => 0);

    let current = 0;
    let entered = false;
    let lastTransition = 0;
    let cursor = 0;
    let morphTimer = null;
    let fallbackTimer = null;

    const measure = () => {
      size.w = host.clientWidth;
      size.h = host.clientHeight;

      // Phones are tall and narrow, so the shorter side is the sensible unit.
      const unit = mobile ? Math.min(size.w, size.h) : size.h;
      host.style.setProperty('--u', `${unit}px`);
    };

    const draw = (i) => {
      pathEls[i]?.setAttribute('d', toPath(radii[i]));
    };

    const fillProps = (i, color) =>
      SHAPES[i].kind === 'blob' ? { fill: color } : { backgroundColor: color };

    const fillTarget = (i) => (SHAPES[i].kind === 'blob' ? pathEls[i] : innerEls[i]);

    const apply = (beat, { instant = false, enter = false } = {}) => {
      current = beat;
      const layout = layoutFor(beat);

      if (!instant) lastTransition = performance.now();

      SHAPES.forEach((shape, i) => {
        const l = layout[i];

        const pose = {
          x: l.x * size.w,
          y: l.y * size.h,
          // A shape that is never shown has a size of 0; keep it collapsed.
          scale: SIZE[i] ? l.k / SIZE[i] : 0,
          rotation: l.r
        };

        if (instant) {
          gsap.killTweensOf([shapeEls[i], fillTarget(i)]);
          gsap.set(shapeEls[i], pose);
          gsap.set(fillTarget(i), fillProps(i, l.c));
          return;
        }

        const delay = i * 0.04 + (enter ? 0.1 : 0);

        gsap.to(shapeEls[i], {
          ...pose,
          duration: enter ? 1.25 : 1.05,
          ease: spatial,
          delay,
          overwrite: 'auto'
        });

        gsap.to(fillTarget(i), {
          ...fillProps(i, l.c),
          duration: 0.6,
          ease: effects,
          delay,
          overwrite: 'auto'
        });
      });
    };

    const morph = (i, key) => {
      const from = Float32Array.from(radii[i]);
      const to = PRESETS[key];
      const t = { v: 0 };

      gsap.to(t, {
        v: 1,
        duration: 1.3,
        ease: spatial,
        onUpdate: () => {
          for (let k = 0; k < N; k += 1) {
            radii[i][k] = Math.max(0.2, from[k] + (to[k] - from[k]) * t.v);
          }

          draw(i);
        }
      });
    };

    // One blob at a time, round-robin, and never right after a beat change.
    const nextMorph = () => {
      if (performance.now() - lastTransition > 1800) {
        const i = blobIndexes[cursor % blobIndexes.length];
        cursor += 1;

        const cycle = SHAPES[i].cycle;
        cycleIndex[i] = (cycleIndex[i] + 1) % cycle.length;
        morph(i, cycle[cycleIndex[i]]);
      }

      morphTimer = gsap.delayedCall(gsap.utils.random(2.4, 4), nextMorph);
    };

    const enter = () => {
      if (entered) return;

      entered = true;
      clearTimeout(fallbackTimer);

      apply(current, { enter: true });
      morphTimer = gsap.delayedCall(3, nextMorph);
    };

    measure();

    gsap.set(shapeEls, { xPercent: -50, yPercent: -50 });
    apply(current, { instant: true });
    gsap.set(shapeEls, { scale: 0 });
    blobIndexes.forEach(draw);

    // Safety net: if nobody calls enter(), start anyway.
    fallbackTimer = setTimeout(enter, 3500);

    let firstObservation = true;

    const resizeObserver = new ResizeObserver(() => {
      // The observer reports once on observe(); that must not cancel anything.
      if (firstObservation) {
        firstObservation = false;
        return;
      }

      measure();

      // Before the entrance the shapes must stay hidden.
      if (entered) apply(current, { instant: true });
    });

    resizeObserver.observe(host);

    const parallax = parEls.map((el) => gsap.quickSetter(el, 'y', 'px'));

    api.enter = enter;

    api.goTo = (beat) => {
      // Mobile keeps one layout, so there is nothing to move between.
      if (mobile) return;

      if (!entered) {
        current = beat;
        return;
      }

      if (beat !== current) apply(beat);
    };

    api.setProgress = (progress) => {
      // Mobile scenes are not scrubbed, so there is nothing to parallax.
      if (mobile) return;

      parallax.forEach((set, i) => set(-progress * beats * SHAPES[i].depth * 30));
    };

    return () => {
      resizeObserver.disconnect();
      clearTimeout(fallbackTimer);
      morphTimer?.kill();
      gsap.killTweensOf([...shapeEls, ...pathEls, ...innerEls]);
      api.enter = () => {};
      api.goTo = () => {};
      api.setProgress = () => {};
    };
  });

  export function enter() {
    api.enter();
  }

  export function goTo(beat) {
    api.goTo(beat);
  }

  export function setProgress(progress) {
    api.setProgress(progress);
  }
</script>

<div class="shapes" class:mobile bind:this={host} aria-hidden="true">
  {#each SHAPES as shape, i (shape.id)}
    <div class="shape" class:pill={shape.kind === 'pill'} style={`--s: ${SIZE[i]}`} bind:this={shapeEls[i]}>
      <div class="par" bind:this={parEls[i]}>
        {#if shape.kind === 'blob'}
          <svg
            class="inner blob"
            viewBox="-1 -1 2 2"
            style={`--dur: ${Math.abs(shape.spin)}s; --dir: ${shape.spin < 0 ? 'reverse' : 'normal'}; --phase: -${(i * 17) % 60}s`}
            bind:this={innerEls[i]}
          >
            <path bind:this={pathEls[i]} d="" />
          </svg>
        {:else}
          <div
            class="inner pill-body"
            style={`--dur: ${shape.spin}s; --phase: -${i}s`}
            bind:this={innerEls[i]}
          ></div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
  .shapes {
    position: absolute;
    inset: 0;
    z-index: 3;
    overflow: hidden;
    pointer-events: none;
  }

  /*
    Mobile: one fixed layer behind the opening scene. The scenes are
    transparent, so the shapes frame the headline.
  */
  .shapes.mobile {
    position: fixed;
    z-index: 1;
  }

  .shape {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(var(--u, 100svh) * var(--s));
    height: calc(var(--u, 100svh) * var(--s));
    will-change: transform;
  }

  .shape.pill {
    width: calc(var(--u, 100svh) * 0.06);
    height: calc(var(--u, 100svh) * 0.22);
  }

  .par,
  .inner {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* Promoted layers: spinning and swaying never touch the main thread. */
  .inner {
    will-change: transform;
  }

  .blob {
    animation: spin var(--dur) linear infinite;
    animation-direction: var(--dir);
    animation-delay: var(--phase);
  }

  .pill-body {
    border-radius: 999px;
    animation: sway var(--dur) ease-in-out infinite alternate;
    animation-delay: var(--phase);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes sway {
    from { transform: rotate(-8deg); }
    to { transform: rotate(8deg); }
  }

  /* Desktop mode only: matches Hero.svelte, where tablet starts at 641px. */
  @media (max-width: 640px) {
    .shapes:not(.mobile) { display: none; }
  }
</style>