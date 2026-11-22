<script>
  import { onMount } from 'svelte';

  import {
    createBrewCodeArtworkSurface,
    waitForBrewCodeArtworkFonts
  } from './brewCodeArtwork.js';

  let { animate = true } = $props();

  let canvasElement;
  let surface = $state.raw(null);
  let reducedMotion = $state(false);

  let animationFrame = 0;
  let lastDraw = 0;
  let startTime = 0;

  const FRAME_INTERVAL = 1000 / 30;

  function stopAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }

  function drawFrame(now) {
    if (!surface) {
      animationFrame = 0;
      return;
    }

    if (now - lastDraw >= FRAME_INTERVAL) {
      surface.draw((now - startTime) / 1000, true);
      lastDraw = now;
    }

    animationFrame = requestAnimationFrame(drawFrame);
  }

  function startAnimation() {
    if (
      animationFrame ||
      !surface ||
      reducedMotion ||
      !animate
    ) {
      return;
    }

    startTime = performance.now();
    lastDraw = 0;
    animationFrame = requestAnimationFrame(drawFrame);
  }

  onMount(() => {
    surface = createBrewCodeArtworkSurface(canvasElement);
    surface.draw(0, false);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = motionQuery.matches;

    const handleMotionPreference = (event) => {
      reducedMotion = event.matches;
      surface?.draw(0, false);
    };

    motionQuery.addEventListener?.('change', handleMotionPreference);

    waitForBrewCodeArtworkFonts().then(() => {
      surface?.draw(0, false);
    });

    return () => {
      stopAnimation();
      motionQuery.removeEventListener?.('change', handleMotionPreference);
      surface = null;
    };
  });

  $effect(() => {
    const shouldAnimate = animate && !reducedMotion;

    if (shouldAnimate) {
      startAnimation();
    } else {
      stopAnimation();
      surface?.draw(0, false);
    }
  });
</script>

<div
  class="artwork-screen"
  role="img"
  aria-label="BrewCode Hackathon artwork, organized by Cavite State University Elite League of IT Students"
>
  <div class="landscape">
    <canvas
      bind:this={canvasElement}
      width="2340"
      height="1080"
      aria-hidden="true"
    ></canvas>
  </div>
</div>

<style>
  .artwork-screen {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #faf8ff;
  }

  /* The physical phone screen is portrait; its artwork is landscape. */
  .landscape {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 216.6667%;
    height: 46.1538%;
    transform: translate(-50%, -50%) rotate(-90deg);
    transform-origin: center;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>