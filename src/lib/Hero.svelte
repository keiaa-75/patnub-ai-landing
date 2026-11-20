<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Phone from './Phone.svelte';
  import DemoScreens from './DemoScreens.svelte';
  import StepRail from './StepRail.svelte';

  let scene, stage, problem, tagline, finalCopy, scrollHint;
  let phoneSlot, contactShadow, screenFade;
  let featureCopy = $state(null);

  let screen = $state(0);
  let step = $state(0);
  let reduced = $state(false);

  const features = [
    { title: 'Ask in plain language.', body: 'Ask about symptoms or medicines. Answers come from MedlinePlus, FDA labels, and your own record. Warning signs get an instant response.', short: 'Ask' },
    { title: "Keep the doctor's note.", body: 'Scan a signed QR once. The approved record stays on your phone, encrypted for you alone.', short: 'Records' },
    { title: 'Works without signal.', body: 'Your records and the assistant stay on your phone. Nothing is sent unless you turn it on.', short: 'Offline' }
  ];

  const KEYS = ['c1', 'c2', 'c3', 'glow', 'accent', 'accent-soft', 'accent-ink', 'screen-bg', 'screen-ink'];

  const PAL = [
    { c1: '#FF6B4A', c2: '#FFB199', c3: '#8E2A22', glow: '#FFD9C4', accent: '#FFEDE6', 'accent-soft': '#FFD9CC', 'accent-ink': '#7A2418', 'screen-bg': '#FFF9F6', 'screen-ink': '#241713' },
    { c1: '#0FB79B', c2: '#7FE3D2', c3: '#063F4C', glow: '#A9F5E4', accent: '#CFFFF4', 'accent-soft': '#D9FFF3', 'accent-ink': '#064E45', 'screen-bg': '#F4FFFC', 'screen-ink': '#102B27' },
    { c1: '#0E8FA8', c2: '#6FD0E6', c3: '#052E42', glow: '#A8E9FF', accent: '#CFF2FF', 'accent-soft': '#DFF7FF', 'accent-ink': '#053E50', 'screen-bg': '#F2FBFF', 'screen-ink': '#102632' },
    { c1: '#17C98D', c2: '#A6F2C8', c3: '#064534', glow: '#D6FFE7', accent: '#E0FFEE', 'accent-soft': '#ECFFF4', 'accent-ink': '#0A4A38', 'screen-bg': '#F6FFFA', 'screen-ink': '#102B22' }
  ];

  const interp = [0, 1, 2].map((i) =>
    Object.fromEntries(KEYS.map((k) => [k, gsap.utils.interpolate(PAL[i][k], PAL[i + 1][k])]))
  );

  const clamp = gsap.utils.clamp;

  function goToStep(i) {
    const st = ScrollTrigger.getById('scene');
    if (!st) return;
    const targets = [0.53, 0.7, 0.88];
    window.scrollTo({ top: st.start + (st.end - st.start) * targets[i], behavior: 'smooth' });
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;

    const applyPalette = (p) => {
      const idx = clamp(0, 2, Math.floor(p));
      const f = clamp(0, 1, p - idx);
      for (const k of KEYS) root.style.setProperty(`--${k}`, interp[idx][k](f));
    };

    const build = (isDesktop) => {
      const pose = {
        xVw: isDesktop ? -0.6 : 0,
        yVh: isDesktop ? 0 : 1.1,
        z: isDesktop ? -120 : 0,
        yaw: isDesktop ? -28 : -14,
        pitch: isDesktop ? 8 : 6,
        roll: isDesktop ? -6 : -3,
        scale: isDesktop ? 0.86 : 0.9,
        screenF: 0,
        palette: 0,
        glowX: isDesktop ? 26 : 50,
        glowY: isDesktop ? 50 : 60,
        glowAlpha: 0.45,
        persp: isDesktop ? 1200 : 1000,
        originX: isDesktop ? 20 : 50,
        originY: 50
      };

      const idle = { y: 0, yaw: 0 };
      const pointer = { x: 0, y: 0 };
      const wobble = { v: 0, target: 0 };
      let active = true;
      let lastPalette = -1;
      let lastScene = '';

      gsap.set([problem, tagline, featureCopy, finalCopy].filter(Boolean), { y: 18 });
      gsap.set(problem, { autoAlpha: 1, y: 0 });
      gsap.set([tagline, featureCopy, finalCopy].filter(Boolean), { autoAlpha: 0 });
      if (scrollHint) gsap.set(scrollHint, { opacity: 1 });
      screen = 0;
      step = 0;
      applyPalette(0);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'scene',
          trigger: scene,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => { wobble.target = clamp(-7, 7, self.getVelocity() / 300); }
        }
      });

      if (isDesktop) {
        tl.to(pose, { xVw: -0.08, yaw: -12, pitch: 4, roll: -2, z: 0, scale: 1, duration: 0.16 }, 0);
        tl.to(problem, { autoAlpha: 0, y: -16, duration: 0.08 }, 0.04);
        tl.to(pose, { palette: 1, glowX: 60, glowAlpha: 0.95, duration: 0.12 }, 0.12);
        tl.to(pose, { glowAlpha: 0.58, duration: 0.08 }, 0.24);
        tl.to(tagline, { autoAlpha: 1, y: 0, duration: 0.09 }, 0.16);
        tl.to(pose, { yaw: 352, duration: 0.2, ease: 'power2.inOut' }, 0.22);
        tl.to(pose, { persp: 1000, originX: 65, duration: 0.09 }, 0.24);
        tl.to(pose, { persp: 1200, originX: 50, duration: 0.09 }, 0.33);
        tl.to(pose, { roll: -10, xVw: -0.05, duration: 0.08 }, 0.42);

        tl.to(tagline, { autoAlpha: 0, y: -14, duration: 0.06 }, 0.46);
        tl.to(featureCopy, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.49);
        tl.to(pose, { xVw: 0, yVh: -0.02, scale: 1.06, persp: 900, glowX: 50, glowAlpha: 0.68, duration: 0.09 }, 0.49);
        tl.to(pose, { yaw: 712, palette: 2, glowAlpha: 0.72, duration: 0.13, ease: 'power2.inOut' }, 0.56);
        tl.to(pose, { screenF: 1, duration: 0.05 }, 0.6);
        tl.to(pose, { yaw: 1072, palette: 3, glowAlpha: 0.78, duration: 0.13, ease: 'power2.inOut' }, 0.72);
        tl.to(pose, { screenF: 2, duration: 0.05 }, 0.76);
        tl.to(pose, { persp: 1150, scale: 1, yVh: 0, yaw: 1064, duration: 0.1, ease: 'power2.out' }, 0.9);
        tl.to(featureCopy, { autoAlpha: 0, y: -12, duration: 0.06 }, 0.94);
        tl.to(finalCopy, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.95);
        tl.to(pose, { glowAlpha: 0.6, duration: 0.06 }, 0.94);
      } else {
        tl.to(pose, { yVh: 0, yaw: -8, pitch: 3, roll: 0, scale: 1, duration: 0.18 }, 0);
        tl.to(problem, { autoAlpha: 0, y: -14, duration: 0.08 }, 0.04);
        tl.to(pose, { palette: 1, glowX: 50, glowY: 38, glowAlpha: 0.9, duration: 0.14 }, 0.12);
        tl.to(tagline, { autoAlpha: 1, y: 0, duration: 0.09 }, 0.18);
        tl.to(pose, { yaw: 12, duration: 0.16, ease: 'sine.inOut' }, 0.34);
        tl.to(pose, { yaw: -6, duration: 0.16, ease: 'sine.inOut' }, 0.52);
        tl.to(pose, { screenF: 1, duration: 0.07 }, 0.52);
        tl.to(tagline, { autoAlpha: 0, y: -12, duration: 0.06 }, 0.58);
        tl.to(featureCopy, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.6);
        tl.to(pose, { yaw: 10, palette: 2, duration: 0.14, ease: 'sine.inOut' }, 0.68);
        tl.to(pose, { screenF: 2, duration: 0.07 }, 0.72);
        tl.to(pose, { yaw: -6, palette: 3, duration: 0.14, ease: 'sine.inOut' }, 0.84);
        tl.to(pose, { glowAlpha: 0.6, duration: 0.06 }, 0.94);
        tl.to(featureCopy, { autoAlpha: 0, y: -10, duration: 0.05 }, 0.95);
        tl.to(finalCopy, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.96);
      }

      if (scrollHint) tl.to(scrollHint, { opacity: 0, duration: 0.04 }, 0.04);
      tl.to({}, { duration: 0.001 }, 1);

      const render = () => {
        if (!active) return;

        const yaw = pose.yaw + idle.yaw + pointer.y;
        const pitch = pose.pitch + pointer.x;
        wobble.v += (wobble.target - wobble.v) * 0.09;
        wobble.target *= 0.88;
        const roll = pose.roll + wobble.v;

        gsap.set(phoneSlot, {
          x: pose.xVw * window.innerWidth,
          y: pose.yVh * window.innerHeight + idle.y,
          z: pose.z,
          rotationY: yaw,
          rotationX: pitch,
          rotationZ: roll,
          scale: pose.scale
        });

        if (pose.palette !== lastPalette) {
          applyPalette(pose.palette);
          lastPalette = pose.palette;
        }

        const sceneKey = `${pose.persp}|${pose.originX}|${pose.glowX}|${pose.glowY}|${pose.glowAlpha}`;
        if (sceneKey !== lastScene) {
          stage.style.perspective = `${pose.persp}px`;
          stage.style.perspectiveOrigin = `${pose.originX}% ${pose.originY}%`;
          root.style.setProperty('--glow-x', `${pose.glowX}%`);
          root.style.setProperty('--glow-y', `${pose.glowY}%`);
          root.style.setProperty('--glow-alpha', pose.glowAlpha);
          lastScene = sceneKey;
        }

        const rad = yaw * Math.PI / 180;
        phoneSlot.style.setProperty('--sheen', `${50 + Math.sin(rad) * 38}%`);
        phoneSlot.style.setProperty('--glass-pos', `${50 + Math.cos(rad) * 44}%`);

        const edge = Math.abs(Math.cos(rad));
        gsap.set(contactShadow, {
          scaleX: 0.5 + 0.5 * edge,
          opacity: 0.12 + 0.22 * edge,
          y: pose.yVh * window.innerHeight * 0.4
        });

        if (screenFade) {
          const d = Math.abs(pose.screenF - Math.round(pose.screenF));
          screenFade.style.opacity = 1 - d * 1.7;
        }

        const s = clamp(0, 2, Math.round(pose.screenF));
        if (s !== screen) screen = s;
        const st = clamp(0, 2, Math.round(pose.palette - 1));
        if (st !== step) step = st;
      };

      const tiltPitch = gsap.quickTo(pointer, 'x', { duration: 0.7, ease: 'power2.out' });
      const tiltYaw = gsap.quickTo(pointer, 'y', { duration: 0.7, ease: 'power2.out' });

      const onPointer = (e) => {
        const r = stage.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        tiltPitch(-ny * 5);
        tiltYaw(nx * 6);
      };
      stage.addEventListener('pointermove', onPointer);

      const idleTween = gsap.to(idle, { y: 7, yaw: 3.5, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });

      const io = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; });
      io.observe(stage);
      gsap.ticker.add(render);
      render();

      return () => {
        stage.removeEventListener('pointermove', onPointer);
        io.disconnect();
        gsap.ticker.remove(render);
        idleTween.kill();
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    };

    const buildReduced = () => {
      reduced = true;
      screen = 0;
      step = 0;
      applyPalette(1);
      root.style.setProperty('--glow-x', '50%');
      root.style.setProperty('--glow-y', '42%');
      root.style.setProperty('--glow-alpha', '0.6');
      stage.style.perspective = '1100px';
      stage.style.perspectiveOrigin = '50% 50%';
      gsap.set(phoneSlot, { x: 0, y: 0, z: 0, rotationY: -18, rotationX: 5, rotationZ: -2, scale: 1 });
      phoneSlot.style.setProperty('--sheen', '52%');
      phoneSlot.style.setProperty('--glass-pos', '82%');
      gsap.set(contactShadow, { scaleX: 0.95, opacity: 0.3, y: 0 });
      if (problem) gsap.set(problem, { autoAlpha: 1, y: 0 });
      if (tagline) gsap.set(tagline, { autoAlpha: 1, y: 0 });
      if (scrollHint) gsap.set(scrollHint, { opacity: 0 });
      return () => { reduced = false; };
    };

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => build(true));
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => build(false));
    mm.add('(prefers-reduced-motion: reduce)', buildReduced);

    return () => mm.revert();
  });
</script>

<section class="scene" id="features" bind:this={scene}>
  <div class="stage" bind:this={stage}>
    <div class="bg">
      <div class="glow"></div>
      <div class="vignette"></div>
      <div class="grain"></div>
    </div>

    <div class="copy problem" bind:this={problem}>
      <p class="kicker">01 / THE PROBLEM</p>
      <h1>The doctor explained it once.<br />Then you got home.</h1>
      <p class="sub">You forget the instructions. The paper gets lost. The clinic has no signal.</p>
    </div>

    <div class="copy tagline" bind:this={tagline}>
      <p class="kicker">02 / MEET PATNUB.AI</p>
      <h2>Care that<br />stays with you.</h2>
      <p class="sub">Your doctor's note stays on your phone. The assistant explains it in plain language, even offline.</p>
    </div>

    {#if reduced}
      <div class="static-features">
        {#each features as f, i}
          <article>
            <span>0{i + 1}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </article>
        {/each}
      </div>
    {:else}
      <div class="copy feature-copy" bind:this={featureCopy}>
        <p class="kicker">0{step + 1} / HOW IT WORKS</p>
        <h2>{features[step].title}</h2>
        <p class="sub">{features[step].body}</p>
      </div>
    {/if}

    <div class="final-copy" bind:this={finalCopy}>
      <h2>Care that goes where you go.</h2>
      <a href="#get">See the demo <span>↗</span></a>
    </div>

    <div class="contact-shadow" bind:this={contactShadow}></div>

    <div class="phone-slot" bind:this={phoneSlot}>
      <Phone>
        <div class="screen-fade" bind:this={screenFade}>
          <DemoScreens index={screen} />
        </div>
      </Phone>
    </div>

    {#if !reduced}
      <div class="rail-wrap">
        <StepRail steps={features.map((f) => f.short)} active={step} onselect={goToStep} />
      </div>
    {/if}

    <div class="scroll-hint" bind:this={scrollHint}>SCROLL TO EXPLORE <span>↓</span></div>
  </div>
</section>

<style>
  .scene { position: relative; height: 620vh; }

  .stage {
    position: sticky;
    top: 0;
    height: 100svh;
    overflow: hidden;
    perspective: 1200px;
    perspective-origin: 50% 50%;
    background: linear-gradient(135deg, var(--c1), var(--c2) 52%, var(--c3));
  }

  .bg { position: absolute; inset: 0; pointer-events: none; }

  .glow {
    position: absolute;
    inset: -25%;
    background: radial-gradient(circle at var(--glow-x) var(--glow-y), var(--glow) 0%, transparent 58%);
    opacity: var(--glow-alpha);
    mix-blend-mode: screen;
  }

  .vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 45%, transparent 38%, rgba(0, 0, 0, 0.42) 100%);
  }

  .grain {
    position: absolute;
    inset: 0;
    background-image: var(--grain);
    opacity: 0.05;
    mix-blend-mode: overlay;
  }

  .copy {
    position: absolute;
    left: 7%;
    top: 50%;
    translate: 0 -50%;
    width: min(38%, 490px);
    z-index: 5;
  }

  /* First-paint states match the JS timeline start, so copy never stacks on load. */
  .tagline, .feature-copy, .final-copy { opacity: 0; visibility: hidden; }
  .problem { opacity: 1; visibility: visible; }

  .kicker {
    margin: 0 0 14px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.24em;
    color: var(--accent);
  }

  h1, h2 {
    margin: 0 0 18px;
    font-size: clamp(2.1rem, 4.4vw, 4.4rem);
    line-height: 1.03;
    letter-spacing: -0.055em;
    font-weight: 800;
    text-wrap: balance;
  }

  .sub {
    margin: 0;
    max-width: 33ch;
    font-size: clamp(0.95rem, 1.25vw, 1.15rem);
    line-height: 1.55;
    color: var(--muted);
  }

  .feature-copy h2 { font-size: clamp(2rem, 4vw, 3.9rem); }

  .final-copy {
    position: absolute;
    left: 7%;
    top: 50%;
    translate: 0 -50%;
    z-index: 7;
    width: min(40%, 500px);
    opacity: 0;
  }
  .final-copy h2 { font-size: clamp(2rem, 4vw, 3.8rem); }
  .final-copy a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 14px 24px;
    border-radius: 999px;
    background: var(--accent);
    color: var(--accent-ink);
    font-size: 13px;
    font-weight: 800;
    text-decoration: none;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .final-copy a:hover { transform: translateY(-3px); box-shadow: 0 14px 34px rgba(0, 0, 0, 0.25); }

  .phone-slot {
    position: absolute;
    left: 50%;
    top: 52%;
    width: var(--phone-w);
    height: calc(var(--phone-w) * 19 / 9);
    margin-left: calc(var(--phone-w) / -2);
    margin-top: calc(var(--phone-w) * 19 / 9 / -2);
    transform-style: preserve-3d;
    transform: translate3d(-60vw, 0, -120px) rotateX(8deg) rotateY(-28deg) rotateZ(-6deg) scale(0.86);
    z-index: 6;
    pointer-events: none;
  }

  .screen-fade { width: 100%; height: 100%; }

  .contact-shadow {
    position: absolute;
    left: 50%;
    top: calc(52% + 300px);
    width: 250px;
    height: 46px;
    margin-left: -125px;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.62), transparent 72%);
    filter: blur(14px);
    z-index: 2;
  }

  .rail-wrap { position: absolute; right: 4%; top: 50%; translate: 0 -50%; z-index: 8; }

  .scroll-hint {
    position: absolute;
    bottom: 30px;
    left: 50%;
    translate: -50% 0;
    z-index: 8;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.22em;
    color: var(--muted);
  }
  .scroll-hint span { display: block; text-align: center; font-size: 15px; margin-top: 6px; }

  .static-features {
    position: absolute;
    left: 7%;
    top: 50%;
    translate: 0 -50%;
    z-index: 5;
    width: min(38%, 490px);
    display: grid;
    gap: 18px;
  }
  .static-features article span { font-size: 10px; font-weight: 800; letter-spacing: 0.2em; color: var(--accent); }
  .static-features h3 { margin: 4px 0 4px; font-size: 1.2rem; letter-spacing: -0.03em; }
  .static-features p { margin: 0; font-size: 0.88rem; line-height: 1.5; color: var(--muted); }

  @media (max-width: 767px) {
    .scene { height: 500vh; }
    .copy { left: 7%; right: 7%; top: 7%; translate: none; width: auto; }
    h1, h2 { font-size: clamp(1.9rem, 8vw, 2.8rem); }
    .sub { font-size: 0.92rem; }
    .final-copy { left: 7%; right: 7%; top: auto; bottom: 8%; translate: none; width: auto; }
    .phone-slot {
      top: 57%;
      transform: translate3d(0, 110vh, 0) rotateX(6deg) rotateY(-14deg) rotateZ(-3deg) scale(0.9);
    }
    .contact-shadow { top: calc(57% + 220px); width: 200px; margin-left: -100px; }
    .static-features { left: 7%; right: 7%; top: 6%; translate: none; width: auto; }
  }
</style>
