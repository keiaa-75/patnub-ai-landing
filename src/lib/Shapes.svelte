<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { spatial, effects } from './motion.js';

  let { beats = 5 } = $props();

  /*
    A small family of Material Expressive shapes that lives behind the phone.
    The same shapes move between layouts on every beat (they are never
    recreated), so the background reads as one system.

    Blobs are drawn from polar radii, so any two of them can morph into each
    other. Pills are plain rounded rectangles.
  */

  const N = 96;
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

  /* Index order matters: it matches every row of the layout tables below. */
  const SHAPES = [
    { id: 'halo', kind: 'blob', cycle: ['cookie9', 'flower5', 'burst10'], depth: 0.4, spin: 80 },
    { id: 'burst', kind: 'blob', cycle: ['burst10', 'cookie9', 'clover4'], depth: 0.8, spin: -65 },
    { id: 'clover', kind: 'blob', cycle: ['clover4', 'pebble3', 'cookie9'], depth: 1.1, spin: 55 },
    { id: 'squircle', kind: 'blob', cycle: ['squircle', 'pebble3', 'flower5'], depth: 0.6, spin: -90 },
    { id: 'flower', kind: 'blob', cycle: ['flower5', 'clover4', 'burst10'], depth: 0.9, spin: 70 },
    { id: 'pebble', kind: 'blob', cycle: ['pebble3', 'squircle', 'cookie9'], depth: 1.3, spin: -50 },
    { id: 'pill-a', kind: 'pill', depth: 1.2 },
    { id: 'pill-b', kind: 'pill', depth: 0.7 }
  ];

  // x, y: centre as a fraction of the stage. k: size in stage-height units
  // (0 hides it). r: rotation in degrees. c: fill.
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

  // Each feature beat nudges and turns the white layout a little further.
  const DRIFT = [
    [0, 0], [-0.02, -0.015], [0.05, 0.01], [0.03, 0.05],
    [-0.04, -0.01], [-0.03, 0.04], [0, 0.05], [0.03, -0.04]
  ];

  const layoutFor = (beat) => {
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

  const api = { goTo: () => {}, setProgress: () => {} };

  let host;
  const shapeEls = [];
  const parEls = [];
  const innerEls = [];
  const pathEls = [];

  onMount(() => {
    // Mobile gets its own treatment later.
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    const size = { w: 1, h: 1 };
    const radii = SHAPES.map((shape) =>
      shape.kind === 'blob' ? Float32Array.from(PRESETS[shape.cycle[0]]) : null
    );
    const timers = [];
    let current = 0;

    const measure = () => {
      size.w = host.clientWidth;
      size.h = host.clientHeight;
      host.style.setProperty('--u', `${size.h}px`);
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

      SHAPES.forEach((shape, i) => {
        const l = layout[i];
        const pose = { x: l.x * size.w, y: l.y * size.h, scale: l.k, rotation: l.r };

        if (instant) {
          gsap.killTweensOf([shapeEls[i], fillTarget(i)]);
          gsap.set(shapeEls[i], pose);
          gsap.set(fillTarget(i), fillProps(i, l.c));
          return;
        }

        const delay = i * 0.04 + (enter ? 0.15 : 0);

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

    measure();

    gsap.set(shapeEls, { xPercent: -50, yPercent: -50, scale: 0 });
    apply(0, { instant: true });
    gsap.set(shapeEls, { scale: 0 });
    SHAPES.forEach((shape, i) => shape.kind === 'blob' && draw(i));

    // Entrance: pop in with the spatial spring.
    apply(0, { enter: true });

    // Idle: slow spin for blobs, a gentle sway for pills, and an occasional morph.
    SHAPES.forEach((shape, i) => {
      if (shape.kind === 'blob') {
        gsap.to(innerEls[i], {
          rotation: shape.spin > 0 ? '+=360' : '-=360',
          duration: Math.abs(shape.spin),
          ease: 'none',
          repeat: -1
        });

        let index = 0;

        const loop = () => {
          index = (index + 1) % shape.cycle.length;
          morph(i, shape.cycle[index]);
          timers.push(gsap.delayedCall(gsap.utils.random(5, 9), loop));
        };

        timers.push(gsap.delayedCall(gsap.utils.random(2, 6), loop));
      } else {
        gsap.to(innerEls[i], {
          rotation: 8,
          duration: 3.2 + i * 0.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      }
    });

    let firstObservation = true;

    const resizeObserver = new ResizeObserver(() => {
      // The observer reports once on observe(); that must not cancel the entrance.
      if (firstObservation) {
        firstObservation = false;
        return;
      }

      measure();
      apply(current, { instant: true });
    });

    resizeObserver.observe(host);

    const parallax = parEls.map((el) => gsap.quickSetter(el, 'y', 'px'));

    api.goTo = (beat) => {
      if (beat !== current) apply(beat);
    };

    api.setProgress = (progress) => {
      parallax.forEach((set, i) => set(-progress * beats * SHAPES[i].depth * 30));
    };

    return () => {
      resizeObserver.disconnect();
      timers.forEach((timer) => timer.kill());
      gsap.killTweensOf([...shapeEls, ...innerEls, ...pathEls]);
      api.goTo = () => {};
      api.setProgress = () => {};
    };
  });

  export function goTo(beat) {
    api.goTo(beat);
  }

  export function setProgress(progress) {
    api.setProgress(progress);
  }
</script>

<div class="shapes" bind:this={host} aria-hidden="true">
  {#each SHAPES as shape, i (shape.id)}
    <div class="shape" class:pill={shape.kind === 'pill'} bind:this={shapeEls[i]}>
      <div class="par" bind:this={parEls[i]}>
        {#if shape.kind === 'blob'}
          <svg class="inner" viewBox="-1 -1 2 2" bind:this={innerEls[i]}>
            <path bind:this={pathEls[i]} d="" />
          </svg>
        {:else}
          <div class="inner pill-body" bind:this={innerEls[i]}></div>
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

  .shape {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--u, 100svh);
    height: var(--u, 100svh);
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

  .pill-body {
    border-radius: 999px;
  }

  @media (max-width: 767px) {
    .shapes { display: none; }
  }
</style>