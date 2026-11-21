
<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Phone from './Phone.svelte';
  import DemoScreens from './DemoScreens.svelte';
  import StepRail from './StepRail.svelte';

  let scene;
  let stage;
  let problem;
  let tagline;
  let featureCopy;
  let finalCopy;
  let scrollHint;
  let phoneSlot;
  let contactShadow;
  let screenFade;

  let phone3d = $state(null);
  let screen = $state(0);
  let step = $state(0);
  let reduced = $state(false);
  let use3d = $state(true);
  let threeReady = $state(false);
  let Phone3DLazy = $state(null);
  let layoutDesktop = $state(true);
  const getDeviceHeight = () => typeof window === 'undefined'
    ? 420
    : window.innerWidth < 768
      ? Math.min(window.innerHeight * 0.44, 320)
      : Math.min(window.innerHeight * 0.58, 520);
  let deviceHeight = $state(getDeviceHeight());

  const SCREEN_URLS = [
    '/screens/assistant.svg',
    '/screens/records.svg',
    '/screens/scan.svg',
    '/screens/medicines.svg'
  ];

  const features = [
    {
      title: 'Ask in plain language.',
      body: 'Ask about symptoms or medicines. Get clear explanations grounded in trusted health references and your own saved record.',
      short: 'Assistant'
    },
    {
      title: "Keep your doctor's note.",
      body: 'Save clinician-approved instructions on your device, so the details are easier to revisit when you need them.',
      short: 'Records'
    },
    {
      title: 'Save a note with a scan.',
      body: 'Use a secure QR code from your clinic to add approved instructions to your personal records.',
      short: 'Scan'
    },
    {
      title: 'Understand your medicines.',
      body: 'Find plain-language information from reviewed references, without losing sight of your clinician’s advice.',
      short: 'Medicines'
    }
  ];

  const KEYS = ['stage-bg', 'stage-ink', 'stage-muted', 'stage-accent', 'stage-soft'];
  const PALETTE = [
    { 'stage-bg': '#F5FAF8', 'stage-ink': '#17231F', 'stage-muted': '#52645E', 'stage-accent': '#0E8F7E', 'stage-soft': '#DFF3ED' },
    { 'stage-bg': '#E5F3EE', 'stage-ink': '#17372F', 'stage-muted': '#4F6D63', 'stage-accent': '#0B796B', 'stage-soft': '#C8EADF' },
    { 'stage-bg': '#F5F6F0', 'stage-ink': '#24372F', 'stage-muted': '#65746B', 'stage-accent': '#0E8F7E', 'stage-soft': '#E7EBDD' },
    { 'stage-bg': '#0E6257', 'stage-ink': '#F5FBF8', 'stage-muted': '#D0E7DF', 'stage-accent': '#D2F2E8', 'stage-soft': '#28796D' }
  ];
  const interpolatePalette = [0, 1, 2].map((i) =>
    Object.fromEntries(KEYS.map((key) => [key, gsap.utils.interpolate(PALETTE[i][key], PALETTE[i + 1][key])]))
  );
  const clamp = gsap.utils.clamp;

  function updateDeviceHeight() {
    // Keep the product visible without letting it overwhelm the first view.
    deviceHeight = getDeviceHeight();
  }

  function applyPalette(value) {
    const index = clamp(0, 2, Math.floor(value));
    const fraction = clamp(0, 1, value - index);
    for (const key of KEYS) {
      document.documentElement.style.setProperty(`--${key}`, interpolatePalette[index][key](fraction));
    }
  }

  function goToStep(index) {
    const trigger = ScrollTrigger.getById('patnub-story');
    if (!trigger) return;
    const targets = [0.60, 0.73, 0.87, 0.985];
    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * targets[index],
      behavior: 'smooth'
    });
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);
    updateDeviceHeight();
    window.addEventListener('resize', updateDeviceHeight, { passive: true });

    import('./Phone3D.svelte')
      .then((module) => { Phone3DLazy = module.default; })
      .catch(() => { use3d = false; });

    const buildStory = (isDesktop) => {
      layoutDesktop = isDesktop;
      reduced = false;

      const pose = {
        // Begin beyond the left edge, then travel across the hero and settle.
        xVw: isDesktop ? -0.66 : -0.72,
        yVh: isDesktop ? 0 : 0.17,
        z: -35,
        // A side-on start plus one full turn and a quarter-turn into the
        // front-facing pose gives the entrance a visible, purposeful spin.
        yaw: -450,
        pitch: isDesktop ? 4 : 3,
        roll: isDesktop ? -7 : -5,
        scale: isDesktop ? 0.76 : 0.74,
        screenF: 0,
        palette: 0,
        persp: isDesktop ? 1180 : 1050,
        originX: 52,
        originY: 50
      };

      const idle = { y: 0, yaw: 0 };
      const pointer = { x: 0, y: 0 };
      const wobble = { value: 0, target: 0 };
      let active = true;
      let lastPalette = -1;
      let lastPerspective = '';

      gsap.set([problem, tagline, featureCopy, finalCopy].filter(Boolean), { y: 18 });
      gsap.set(problem, { autoAlpha: 1, y: 0 });
      gsap.set([tagline, featureCopy, finalCopy].filter(Boolean), { autoAlpha: 0 });
      if (scrollHint) gsap.set(scrollHint, { autoAlpha: 1 });
      screen = 0;
      step = 0;
      applyPalette(0);

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'patnub-story',
          trigger: scene,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.72,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            wobble.target = clamp(-5, 5, self.getVelocity() / 420);
          }
        }
      });

      if (isDesktop) {
        // Entrance: glide from completely off-canvas left to the right-hand
        // product position while completing a 450-degree spin. The final
        // front-facing angle then holds for the rest of the story beats.
        timeline.to(pose, {
          xVw: 0.22, yaw: 0, z: 0, scale: 0.96, roll: 0,
          duration: 0.30, ease: 'power3.out'
        }, 0);
        timeline.to(pose, { scale: 0.91, duration: 0.07, ease: 'power2.out' }, 0.30);
        timeline.to(problem, { autoAlpha: 0, y: -18, duration: 0.08, ease: 'power2.in' }, 0.08);
        timeline.to(tagline, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'back.out(1.45)' }, 0.34);
        timeline.to(pose, { palette: 1, yaw: 170, pitch: 7, duration: 0.15, ease: 'power2.inOut' }, 0.42);
        timeline.to(tagline, { autoAlpha: 0, y: -14, duration: 0.07 }, 0.53);
        timeline.to(featureCopy, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'back.out(1.35)' }, 0.58);
        timeline.to(pose, { yaw: 360, screenF: 1, palette: 1.35, duration: 0.16, ease: 'power2.inOut' }, 0.55);
        timeline.to(pose, { yaw: 540, screenF: 2, palette: 2, duration: 0.17, ease: 'power2.inOut' }, 0.72);
        timeline.to(pose, { yaw: 720, screenF: 3, palette: 2.55, duration: 0.17, ease: 'power2.inOut' }, 0.89);
        timeline.to(featureCopy, { autoAlpha: 0, y: -15, duration: 0.06 }, 0.91);
        timeline.to(finalCopy, { autoAlpha: 1, y: 0, duration: 0.09, ease: 'back.out(1.4)' }, 0.93);
        timeline.to(pose, { yaw: 706, scale: 0.9, xVw: 0.22, palette: 3, duration: 0.08, ease: 'power2.out' }, 0.92);
      } else {
        // On narrow screens the phone still enters from the left, but settles
        // centrally beneath the copy instead of occupying the right column.
        timeline.to(pose, {
          xVw: 0, yaw: 0, z: 0, scale: 0.9, roll: 0,
          duration: 0.30, ease: 'power3.out'
        }, 0);
        timeline.to(pose, { scale: 0.85, duration: 0.07, ease: 'power2.out' }, 0.30);
        timeline.to(problem, { autoAlpha: 0, y: -15, duration: 0.07 }, 0.08);
        timeline.to(tagline, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'back.out(1.35)' }, 0.34);
        timeline.to(pose, { yaw: 170, palette: 1, duration: 0.15, ease: 'power2.inOut' }, 0.42);
        timeline.to(tagline, { autoAlpha: 0, y: -12, duration: 0.07 }, 0.53);
        timeline.to(featureCopy, { autoAlpha: 1, y: 0, duration: 0.1, ease: 'back.out(1.3)' }, 0.58);
        timeline.to(pose, { yaw: 360, screenF: 1, palette: 1.3, duration: 0.16, ease: 'power2.inOut' }, 0.55);
        timeline.to(pose, { yaw: 540, screenF: 2, palette: 2, duration: 0.17, ease: 'power2.inOut' }, 0.72);
        timeline.to(pose, { yaw: 720, screenF: 3, palette: 2.5, duration: 0.17, ease: 'power2.inOut' }, 0.89);
        timeline.to(featureCopy, { autoAlpha: 0, y: -12, duration: 0.06 }, 0.91);
        timeline.to(finalCopy, { autoAlpha: 1, y: 0, duration: 0.09, ease: 'back.out(1.3)' }, 0.93);
        timeline.to(pose, { yaw: 706, palette: 3, scale: 0.84, xVw: 0, duration: 0.08, ease: 'power2.out' }, 0.92);
      }

      if (scrollHint) timeline.to(scrollHint, { autoAlpha: 0, duration: 0.04 }, 0.06);
      timeline.to({}, { duration: 0.001 }, 1);

      const render = () => {
        if (!active) return;

        const yaw = pose.yaw + idle.yaw + pointer.y;
        const pitch = pose.pitch + pointer.x;
        wobble.value += (wobble.target - wobble.value) * 0.085;
        wobble.target *= 0.88;
        const roll = pose.roll + wobble.value;

        if (use3d && threeReady && phone3d) {
          phone3d.setPose({ ...pose, yaw, pitch, roll });
        } else if (phoneSlot) {
          gsap.set(phoneSlot, {
            x: pose.xVw * window.innerWidth,
            y: pose.yVh * window.innerHeight + idle.y,
            z: pose.z,
            rotationY: yaw,
            rotationX: pitch,
            rotationZ: roll,
            scale: pose.scale
          });
        }

        if (pose.palette !== lastPalette) {
          applyPalette(pose.palette);
          lastPalette = pose.palette;
        }

        const perspectiveKey = `${pose.persp}|${pose.originX}`;
        if (perspectiveKey !== lastPerspective && stage) {
          stage.style.perspective = `${pose.persp}px`;
          stage.style.perspectiveOrigin = `${pose.originX}% ${pose.originY}%`;
          lastPerspective = perspectiveKey;
        }

        const radians = yaw * Math.PI / 180;
        if (phoneSlot) {
          phoneSlot.style.setProperty('--sheen', `${50 + Math.sin(radians) * 26}%`);
          phoneSlot.style.setProperty('--glass-pos', `${50 + Math.cos(radians) * 38}%`);
        }

        if (contactShadow) {
          const edge = Math.abs(Math.cos(radians));
          gsap.set(contactShadow, {
            scaleX: 0.72 + 0.28 * edge,
            opacity: 0.1 + 0.08 * edge,
            y: pose.yVh * window.innerHeight * 0.25
          });
        }

        if (screenFade) {
          const difference = Math.abs(pose.screenF - Math.round(pose.screenF));
          screenFade.style.opacity = 1 - difference * 0.85;
        }

        const nextScreen = clamp(0, features.length - 1, Math.round(pose.screenF));
        if (nextScreen !== screen) screen = nextScreen;
        if (nextScreen !== step) step = nextScreen;
      };

      const tiltPitch = gsap.quickTo(pointer, 'x', { duration: 0.65, ease: 'power2.out' });
      const tiltYaw = gsap.quickTo(pointer, 'y', { duration: 0.65, ease: 'power2.out' });
      const onPointer = (event) => {
        if (event.pointerType === 'touch') return;
        const bounds = stage.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        tiltPitch(-y * 2.5);
        tiltYaw(x * 3.5);
      };
      stage.addEventListener('pointermove', onPointer, { passive: true });

      const idleTween = gsap.to(idle, {
        y: 5,
        yaw: 2.2,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      });
      const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; });
      observer.observe(stage);
      gsap.ticker.add(render);
      render();

      return () => {
        stage.removeEventListener('pointermove', onPointer);
        observer.disconnect();
        gsap.ticker.remove(render);
        idleTween.kill();
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    };

    const buildReducedMotion = () => {
      reduced = true;
      screen = 0;
      step = 0;
      applyPalette(0);
      if (problem) gsap.set(problem, { autoAlpha: 1, y: 0 });
      if (tagline) gsap.set(tagline, { autoAlpha: 1, y: 0 });
      if (featureCopy) gsap.set(featureCopy, { autoAlpha: 1, y: 0 });
      if (finalCopy) gsap.set(finalCopy, { autoAlpha: 1, y: 0 });
      if (scrollHint) gsap.set(scrollHint, { autoAlpha: 0 });
      return () => { reduced = false; };
    };

    const media = gsap.matchMedia();
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => buildStory(true));
    media.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => buildStory(false));
    media.add('(prefers-reduced-motion: reduce)', buildReducedMotion);

    return () => {
      media.revert();
      window.removeEventListener('resize', updateDeviceHeight);
    };
  });
</script>

<section class="scene" id="story" bind:this={scene} class:reduced-motion={reduced} aria-label="How patnub.ai helps you keep up with your care">
  <div class="stage" bind:this={stage}>
    <div class="stage-decoration decor-orbit" aria-hidden="true"></div>
    <div class="stage-decoration decor-dot" aria-hidden="true"></div>
    <div class="stage-decoration decor-pill" aria-hidden="true"></div>

    <div class="copy problem" bind:this={problem}>
      <p class="kicker"><span></span> CARE SHOULD NOT END AT THE CLINIC</p>
      <h1>The doctor explained it once.<br />Then you got home.</h1>
      <p class="sub">The paper gets misplaced. The details get fuzzy. And the clinic may be out of reach.</p>
      <a class="text-link" href="#features">See what you can keep <span aria-hidden="true">↓</span></a>
    </div>

    <div class="copy tagline" bind:this={tagline}>
      <p class="kicker"><span></span> MEET PATNUB.AI</p>
      <h2>Care that<br />stays with you.</h2>
      <p class="sub">Your doctor's note stays on your phone. The assistant helps explain it in plain language, even offline.</p>
    </div>

    {#if reduced}
      <div class="static-features">
        {#each features as feature, i}
          <article>
            <span class="static-number">0{i + 1}</span>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        {/each}
      </div>
    {:else}
      <div class="copy feature-copy" bind:this={featureCopy}>
        <p class="kicker"><span></span> 0{step + 1} / HOW IT WORKS</p>
        <h2>{features[step].title}</h2>
        <p class="sub">{features[step].body}</p>
        <p class="micro-note">A little more clarity, right in your pocket.</p>
      </div>
    {/if}

    <div class="final-copy" bind:this={finalCopy}>
      <p class="kicker"><span></span> YOUR CARE, CLOSE AT HAND</p>
      <h2>Keep the details.<br />Feel more prepared.</h2>
      <a href="#features">Explore the features <span aria-hidden="true">↗</span></a>
    </div>

    <div class="contact-shadow" bind:this={contactShadow} aria-hidden="true"></div>

    {#if use3d && !reduced && Phone3DLazy}
      <Phone3DLazy
        bind:this={phone3d}
        screens={SCREEN_URLS}
        phoneHeight={deviceHeight}
        baseTop={0.5}
        onready={() => (threeReady = true)}
        onfail={() => { use3d = false; threeReady = false; }}
      />
    {/if}

    <div
      class="phone-slot"
      class:css-fallback={!use3d || reduced}
      bind:this={phoneSlot}
      style={`--phone-w: ${(deviceHeight * 9) / 19.5}px`}
      aria-hidden="true"
    >
      <Phone>
        <div class="screen-fade" bind:this={screenFade}>
          <DemoScreens index={screen} />
        </div>
      </Phone>
    </div>

    {#if !reduced}
      <div class="rail-wrap">
        <StepRail steps={features.map((feature) => feature.short)} active={step} onselect={goToStep} />
      </div>
    {/if}

    <div class="scroll-hint" bind:this={scrollHint}><span class="hint-line"></span> SCROLL TO EXPLORE <span class="material-symbols-rounded">south</span></div>
  </div>
</section>

<style>
  .scene { position: relative; height: 440vh; }
  .stage {
    position: sticky;
    top: 0;
    height: 100svh;
    min-height: 620px;
    overflow: hidden;
    perspective: 1180px;
    perspective-origin: 52% 50%;
    isolation: isolate;
    background: var(--stage-bg);
    color: var(--stage-ink);
    transition: background-color 180ms linear;
  }
  .stage::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    background-image: radial-gradient(rgba(24, 76, 64, .055) .7px, transparent .7px);
    background-size: 18px 18px;
    opacity: .32;
    content: '';
    pointer-events: none;
  }
  .stage-decoration { position: absolute; z-index: 1; pointer-events: none; }
  .decor-orbit {
    top: 14%; right: 12%; width: min(40vw, 520px); aspect-ratio: 1;
    border: 1px solid rgba(14,143,126,.13); border-radius: 50%;
  }
  .decor-orbit::before, .decor-orbit::after { position: absolute; border: 1px solid rgba(14,143,126,.1); border-radius: 50%; content: ''; }
  .decor-orbit::before { inset: 13%; }
  .decor-orbit::after { inset: 27%; }
  .decor-dot { top: 23%; right: 15%; width: 15px; height: 15px; border-radius: 50%; background: #efbd8d; box-shadow: 0 0 0 9px rgba(239,189,141,.18); }
  .decor-pill { right: 10%; bottom: 18%; width: 16px; height: 56px; border-radius: 99px; background: var(--stage-accent); opacity: .22; transform: rotate(35deg); }

  .copy {
    position: absolute;
    top: clamp(168px, 39svh, 410px); left: 8%; z-index: 8;
    width: min(39%, 520px);
    translate: 0 -50%;
  }
  .tagline, .feature-copy, .final-copy { visibility: hidden; opacity: 0; }
  .problem { visibility: visible; opacity: 1; }
  .kicker {
    display: flex; align-items: center; gap: 9px;
    margin: 0 0 16px;
    color: var(--stage-accent);
    font-size: 10px; font-weight: 700; letter-spacing: .15em;
  }
  .kicker > span { width: 8px; height: 8px; flex: none; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 4px rgba(14,143,126,.11); }
  h1, h2 {
    margin: 0 0 18px;
    color: var(--stage-ink);
    font-family: var(--font-display);
    font-size: clamp(2.8rem, 5vw, 5rem);
    font-weight: 500;
    letter-spacing: -.04em;
    line-height: .99;
    text-wrap: balance;
  }
  .sub { max-width: 39ch; margin: 0; color: var(--stage-muted); font-size: clamp(1rem, 1.25vw, 1.15rem); line-height: 1.65; }
  .text-link { display: inline-flex; align-items: center; gap: 9px; margin-top: 26px; color: var(--stage-accent); font-size: 13px; font-weight: 700; text-decoration: none; }
  .text-link span { transition: transform 180ms ease; }
  .text-link:hover span { transform: translateY(4px); }
  .feature-copy h2 { font-size: clamp(2.65rem, 4.6vw, 4.5rem); }
  .micro-note { display: inline-flex; margin: 23px 0 0; padding: 9px 13px; border-radius: 99px; color: var(--stage-ink); background: var(--stage-soft); font-size: 11px; font-weight: 600; }

  .final-copy {
    position: absolute; top: clamp(168px, 39svh, 410px); left: 8%; z-index: 9;
    width: min(42%, 560px); translate: 0 -50%;
  }
  .final-copy h2 { font-size: clamp(2.8rem, 4.7vw, 4.7rem); }
  .final-copy a {
    display: inline-flex; align-items: center; gap: 11px;
    padding: 14px 21px; border-radius: var(--shape-full);
    color: var(--md-on-primary-container); background: var(--md-primary-container);
    font-size: 13px; font-weight: 700; text-decoration: none;
    transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease;
  }
  .final-copy a:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 9px 25px rgba(14,143,126,.2); }

  .phone-slot {
    position: absolute; top: 50%; left: 50%; z-index: 6;
    width: var(--phone-w); height: calc(var(--phone-w) * 19.5 / 9);
    margin-left: calc(var(--phone-w) / -2); margin-top: calc(var(--phone-w) * 19.5 / 9 / -2);
    display: block; opacity: 0; visibility: hidden;
    transform-style: preserve-3d; pointer-events: none;
    transition: opacity 220ms ease, visibility 0s linear 220ms;
  }
  .phone-slot.css-fallback {
    opacity: 1; visibility: visible;
    transition: opacity 220ms ease, visibility 0s linear;
  }
  @media (prefers-reduced-motion: reduce) {
    .phone-slot { transition: none; }
  }
  .screen-fade { width: 100%; height: 100%; }
  .contact-shadow {
    position: absolute; top: calc(50% + 28svh); left: calc(50% + 19vw); z-index: 2;
    width: 240px; height: 40px; margin-left: -120px;
    border-radius: 50%; background: rgba(25, 69, 57, .12); filter: blur(18px);
  }
  .rail-wrap { position: absolute; top: 50%; right: 4%; z-index: 10; translate: 0 -50%; }
  .scroll-hint {
    position: absolute; right: 0; bottom: 28px; left: 0; z-index: 10;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    color: var(--stage-muted); font-size: 9px; font-weight: 700; letter-spacing: .15em;
  }
  .hint-line { width: 30px; height: 1px; background: var(--stage-accent); opacity: .5; }
  .scroll-hint .material-symbols-rounded { color: var(--stage-accent); font-size: 15px; }

  .static-features { position: absolute; top: 52%; left: 8%; z-index: 8; width: min(42%, 550px); display: grid; gap: 16px; translate: 0 -50%; }
  .static-features article { padding: 14px 16px; border: 1px solid var(--md-outline-variant); border-radius: 18px; background: rgba(255,255,255,.7); }
  .static-number { color: var(--md-primary); font-size: 10px; font-weight: 700; letter-spacing: .1em; }
  .static-features h3 { margin: 4px 0; color: var(--md-on-surface); font-family: var(--font-display); font-size: 20px; font-weight: 500; }
  .static-features p { margin: 0; color: var(--md-on-surface-variant); font-size: 12px; line-height: 1.5; }
  .reduced-motion { height: auto; }
  .reduced-motion .stage { position: relative; min-height: 900px; padding-top: 100px; }
  .reduced-motion .copy.problem, .reduced-motion .copy.tagline { position: relative; top: auto; left: auto; width: auto; margin: 0 7% 28px; translate: none; }
  .reduced-motion .copy.tagline { display: none; }
  .reduced-motion .static-features { top: auto; bottom: 60px; left: 7%; width: 48%; translate: none; }
  .reduced-motion .phone-slot { top: 52%; left: 76%; display: block; transform: translate(-50%,-50%) rotateY(-12deg) rotateX(3deg) scale(.86); }
  .reduced-motion .contact-shadow { display: none; }

  @media (max-width: 1100px) and (min-width: 768px) {
    .copy { left: 6%; width: 37%; }
    .rail-wrap { right: 2%; }
    .contact-shadow { left: calc(50% + 18vw); }
    h1, h2 { font-size: clamp(2.5rem, 4.5vw, 4rem); }
  }

  @media (max-width: 767px) {
    .scene { height: 380vh; }
    .stage { min-height: 600px; }
    .stage::before { background-size: 22px 22px; opacity: .2; }
    .decor-orbit { top: 42%; right: -20%; width: 74vw; }
    .decor-dot { top: 47%; right: 16%; width: 11px; height: 11px; }
    .decor-pill { right: 8%; bottom: 12%; width: 12px; height: 42px; }
    .copy { top: clamp(104px, 15svh, 132px); left: 7%; width: 86%; translate: none; }
    .kicker { margin-bottom: 12px; font-size: 8px; letter-spacing: .12em; }
    h1, h2 { max-width: 12ch; margin-bottom: 12px; font-size: clamp(2.45rem, 10vw, 3.4rem); }
    .sub { max-width: 35ch; font-size: 13px; line-height: 1.55; }
    .text-link { margin-top: 15px; font-size: 12px; }
    .feature-copy h2 { font-size: clamp(2.3rem, 9vw, 3rem); }
    .micro-note { margin-top: 13px; padding: 7px 10px; font-size: 9px; }
    .final-copy { top: clamp(104px, 15svh, 132px); left: 7%; width: 86%; translate: none; }
    .final-copy h2 { font-size: clamp(2.45rem, 10vw, 3.3rem); }
    .final-copy a { padding: 12px 17px; font-size: 12px; }
    .contact-shadow { top: calc(67% + 125px); left: 50%; width: 170px; margin-left: -85px; }
    .scroll-hint { bottom: 17px; font-size: 8px; }
    .scroll-hint .hint-line { width: 20px; }
    .static-features { top: 12%; left: 7%; width: 86%; translate: none; gap: 8px; }
    .static-features article { padding: 9px 12px; border-radius: 14px; }
    .static-features h3 { font-size: 16px; }
    .static-features p { font-size: 10px; }
    .reduced-motion .stage { min-height: 1100px; }
    .reduced-motion .copy.problem { margin: 0 7% 20px; }
    .reduced-motion .static-features { bottom: 25px; width: 86%; }
    .reduced-motion .phone-slot { display: none; }
  }
</style>
