<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import Phone from './Phone.svelte';
  import DemoScreens from './DemoScreens.svelte';
  import StepRail from './StepRail.svelte';

  /*
    The story is a row of full-viewport "beats". Scrolling rests on each one:

      0  Problem question   (peach backdrop)
      1  Hero               (teal backdrop, phone lands on the right)
      2  Feature 1          (white backdrop, phone spins to the left)
      3  Feature 2
      4  Feature 3
      5  Feature 4

    BEATS is the index of the last beat. Download and About extend it later.
  */
  const BEATS = 5;
  const FIRST_FEATURE_BEAT = 2;
  const SNAP = true;

  // Timeline position of a beat, plus a fraction of the way to the next one.
  const T = (beat, fraction = 0) => (beat + fraction) / BEATS;
  // A duration expressed as a fraction of one beat.
  const D = (fraction) => fraction / BEATS;

  let scene;
  let stage;
  let bgTeal;
  let bgWhite;
  let problem;
  let tagline;
  let featureCopy = $state(null);
  let railWrap = $state(null);
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

  const getDeviceHeight = () => typeof window === 'undefined'
    ? 420
    : window.innerWidth < 768
      ? Math.min(window.innerHeight * 0.44, 320)
      : Math.min(window.innerHeight * 0.76, 700);

  let deviceHeight = $state(getDeviceHeight());

  // Use PNG textures for reliable WebGL uploads.
  const SCREEN_URLS = [
    '/screens/assistant.png',
    '/screens/records.png',
    '/screens/scan.png',
    '/screens/medicines.png'
  ];

  const features = [
    {
      title: 'Ask in plain language.',
      body: 'Ask about symptoms or medicines. Get clear explanations grounded in trusted health references and your own saved record.',
      short: 'Assistant'
    },
    {
      title: 'Keep your doctor’s note.',
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

  const clamp = gsap.utils.clamp;

  function updateDeviceHeight() {
    deviceHeight = getDeviceHeight();
  }

  function goToStep(index) {
    const trigger = ScrollTrigger.getById('patnub-story');
    if (!trigger) return;

    window.scrollTo({
      top: trigger.start + (trigger.end - trigger.start) * T(FIRST_FEATURE_BEAT + index),
      behavior: 'smooth'
    });
  }

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    updateDeviceHeight();
    window.addEventListener('resize', updateDeviceHeight, { passive: true });

    import('./Phone3D.svelte')
      .then((module) => {
        Phone3DLazy = module.default;
      })
      .catch(() => {
        use3d = false;
      });

    const buildStory = (isDesktop) => {
      reduced = false;

      // Desktop: lands on the right, then crosses to the left for the features.
      // Mobile keeps the phone centered until its own pass.
      const restX = isDesktop ? 0.22 : 0;
      const featureX = isDesktop ? -0.22 : 0;
      const restScale = isDesktop ? 1 : 0.88;

      const pose = {
        // Starts beyond the left edge.
        xVw: isDesktop ? -0.66 : -0.72,
        yVh: isDesktop ? 0 : 0.17,
        z: -35,
        yaw: -450,
        pitch: isDesktop ? 4 : 3,
        roll: -7,
        scale: isDesktop ? 0.9 : 0.74,
        screenF: 0,
        reveal1: 0,
        reveal2: 0,
        persp: 1180
      };

      const idle = { y: 0, yaw: 0 };
      const pointer = { x: 0, y: 0 };
      const wobble = { value: 0, target: 0 };
      const size = { w: 0, h: 0 };

      let active = true;
      let lastClipTeal = '';
      let lastClipWhite = '';

      const measure = () => {
        size.w = stage.clientWidth;
        size.h = stage.clientHeight;
      };

      measure();
      window.addEventListener('resize', measure, { passive: true });

      gsap.set([tagline, featureCopy, railWrap].filter(Boolean), { autoAlpha: 0 });
      gsap.set([tagline, featureCopy].filter(Boolean), { y: 24 });
      gsap.set(problem, { autoAlpha: 1, y: 0 });
      if (scrollHint) gsap.set(scrollHint, { autoAlpha: 1 });

      screen = 0;
      step = 0;

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },

        scrollTrigger: {
          id: 'patnub-story',
          trigger: scene,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.72,
          invalidateOnRefresh: true,
          snap: SNAP
            ? {
                snapTo: 1 / BEATS,
                duration: { min: 0.25, max: 0.7 },
                delay: 0.1,
                ease: 'power2.inOut'
              }
            : undefined,

          onUpdate: (self) => {
            wobble.target = clamp(-5, 5, self.getVelocity() / 420);
          }
        }
      });

      /* Beat 0 -> 1: the phone arrives and carries the teal in with it. */
      timeline.to(problem, {
        autoAlpha: 0,
        y: -28,
        duration: D(0.3),
        ease: 'power2.in'
      }, T(0));

      if (scrollHint) {
        timeline.to(scrollHint, { autoAlpha: 0, duration: D(0.15) }, T(0));
      }

      timeline.to(pose, {
        xVw: restX,
        yaw: 0,
        z: 0,
        roll: 0,
        scale: restScale,
        duration: D(0.9),
        ease: 'power2.out'
      }, T(0, 0.1));

      timeline.to(pose, {
        reveal1: 1,
        duration: D(0.75),
        ease: 'power2.inOut'
      }, T(0, 0.2));

      timeline.to(tagline, {
        autoAlpha: 1,
        y: 0,
        duration: D(0.15),
        ease: 'power2.out'
      }, T(0, 0.85));

      /* Beat 1 -> 2: spin right to left, white takes over, copy lands on the right. */
      timeline.to(tagline, {
        autoAlpha: 0,
        y: -24,
        duration: D(0.25),
        ease: 'power2.in'
      }, T(1));

      timeline.to(pose, {
        xVw: featureX,
        yaw: -360,
        duration: D(0.9),
        ease: 'power2.inOut'
      }, T(1, 0.05));

      timeline.to(pose, {
        reveal2: 1,
        duration: D(0.75),
        ease: 'power2.inOut'
      }, T(1, 0.15));

      timeline.to([featureCopy, railWrap].filter(Boolean), {
        autoAlpha: 1,
        y: 0,
        duration: D(0.15),
        ease: 'power2.out'
      }, T(1, 0.85));

      /* Beats 2 -> 5: no spin. The screen changes and the copy swaps mid-way. */
      for (let i = 1; i < features.length; i += 1) {
        const beat = FIRST_FEATURE_BEAT + i - 1;

        // Linear, so the screen index rounds over at exactly half-way (0.5).
        timeline.to(pose, {
          screenF: i,
          duration: D(0.7),
          ease: 'none'
        }, T(beat, 0.15));

        timeline.to(featureCopy, {
          autoAlpha: 0,
          y: -14,
          duration: D(0.2),
          ease: 'power2.in'
        }, T(beat, 0.25));

        timeline.set(featureCopy, { y: 18 }, T(beat, 0.5));

        timeline.to(featureCopy, {
          autoAlpha: 1,
          y: 0,
          duration: D(0.2),
          ease: 'power2.out'
        }, T(beat, 0.55));
      }

      // Pin the timeline length to exactly 1 so beats land on k / BEATS.
      timeline.set({}, { x: 0 }, 1);

      const clipFor = (amount) => {
        if (amount <= 0.001) return 'circle(0px at 50% 50%)';

        const cx = size.w * (0.5 + pose.xVw);
        const cy = size.h * (0.5 + pose.yVh);
        const reach = Math.hypot(
          Math.max(cx, size.w - cx),
          Math.max(cy, size.h - cy)
        );

        return `circle(${(reach * amount * 1.02).toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`;
      };

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
            x: pose.xVw * size.w,
            y: pose.yVh * size.h + idle.y,
            z: pose.z,
            rotationY: yaw,
            rotationX: pitch,
            rotationZ: roll,
            scale: pose.scale
          });
        }

        // Backdrops grow out of the phone's current position.
        const clipTeal = clipFor(pose.reveal1);
        const clipWhite = clipFor(pose.reveal2);

        if (bgTeal && clipTeal !== lastClipTeal) {
          bgTeal.style.clipPath = clipTeal;
          lastClipTeal = clipTeal;
        }

        if (bgWhite && clipWhite !== lastClipWhite) {
          bgWhite.style.clipPath = clipWhite;
          lastClipWhite = clipWhite;
        }

        const radians = yaw * Math.PI / 180;

        if (phoneSlot) {
          phoneSlot.style.setProperty('--sheen', `${50 + Math.sin(radians) * 26}%`);
          phoneSlot.style.setProperty('--glass-pos', `${50 + Math.cos(radians) * 38}%`);
        }

        if (contactShadow) {
          const edge = Math.abs(Math.cos(radians));

          gsap.set(contactShadow, {
            x: size.w * (0.5 + pose.xVw),
            y: size.h * (0.5 + pose.yVh) + deviceHeight * pose.scale * 0.5 + 6,
            xPercent: -50,
            scaleX: 0.72 + 0.28 * edge,
            opacity: 0.1 + 0.08 * edge
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

      const observer = new IntersectionObserver(([entry]) => {
        active = entry.isIntersecting;
      });

      observer.observe(stage);
      gsap.ticker.add(render);
      render();

      return () => {
        stage.removeEventListener('pointermove', onPointer);
        window.removeEventListener('resize', measure);
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

      return () => {
        reduced = false;
      };
    };

    const media = gsap.matchMedia();

    media.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => buildStory(true)
    );

    media.add(
      '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
      () => buildStory(false)
    );

    media.add('(prefers-reduced-motion: reduce)', buildReducedMotion);

    return () => {
      media.revert();
      window.removeEventListener('resize', updateDeviceHeight);
    };
  });
</script>

<section
  class="scene"
  id="story"
  style={`--beats: ${BEATS}`}
  bind:this={scene}
  class:reduced-motion={reduced}
  aria-label="How patnub.ai helps you understand your health"
>
  <div class="stage" bind:this={stage}>
    <div class="backdrop" aria-hidden="true">
      <div class="bg bg-peach"></div>
      <div class="bg bg-teal" bind:this={bgTeal}></div>
      <div class="bg bg-white" bind:this={bgWhite}></div>
    </div>

    <div class="copy problem scheme-peach" bind:this={problem}>
      <h1>Do you ever wish understanding your health was easier?</h1>
    </div>

    <div class="copy tagline scheme-teal" bind:this={tagline}>
      <h2>Your doctor’s note, in plain words.</h2>
      <p class="sub">
        patnub.ai keeps your clinician’s instructions on your phone
        and explains them in plain language, even offline.
      </p>
    </div>

    {#if reduced}
      <div class="static-features scheme-white">
        {#each features as feature, i}
          <article>
            <span class="static-number">0{i + 1}</span>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        {/each}
      </div>
    {:else}
      <div class="copy feature-copy scheme-white" bind:this={featureCopy}>
        <h2>{features[step].title}</h2>
        <p class="sub">{features[step].body}</p>
      </div>
    {/if}

    <div
      class="contact-shadow"
      bind:this={contactShadow}
      style={`width: ${deviceHeight * 0.5}px`}
      aria-hidden="true"
    ></div>

    {#if use3d && !reduced && Phone3DLazy}
      <Phone3DLazy
        bind:this={phone3d}
        screens={SCREEN_URLS}
        phoneHeight={deviceHeight}
        baseTop={0.5}
        onready={() => (threeReady = true)}
        onfail={() => {
          use3d = false;
          threeReady = false;
        }}
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
      <div class="rail-wrap scheme-white" bind:this={railWrap}>
        <StepRail
          steps={features.map((feature) => feature.short)}
          active={step}
          onselect={goToStep}
        />
      </div>
    {/if}

    <div class="scroll-hint scheme-peach" bind:this={scrollHint}>
      <span class="hint-line"></span>
      SCROLL
      <span class="material-symbols-rounded">south</span>
    </div>
  </div>
</section>

<style>
  /* Each beat is one viewport tall; the stage stays pinned while we scroll. */
  .scene {
    position: relative;
    height: calc((var(--beats) + 1) * 100svh);
  }

  .stage {
    position: sticky;
    top: 0;
    height: 100svh;
    min-height: 620px;
    overflow: hidden;
    perspective: 1180px;
    perspective-origin: 50% 50%;
    isolation: isolate;
  }

  /* Colour schemes: every block of copy keeps the scheme of the backdrop it sits on. */
  .scheme-peach {
    --stage-ink: var(--md-on-tertiary-container);
    --stage-muted: #5e4630;
    --stage-accent: var(--md-tertiary);
    --stage-soft: #ffebd6;
  }

  .scheme-teal {
    --stage-ink: #f5fbf8;
    --stage-muted: #d0e7df;
    --stage-accent: #d2f2e8;
    --stage-soft: #28796d;
  }

  .scheme-white,
  .reduced-motion .scheme-peach,
  .reduced-motion .scheme-teal {
    --stage-ink: #17231f;
    --stage-muted: #52645e;
    --stage-accent: #0e8f7e;
    --stage-soft: #dff3ed;
  }

  /* Backdrops: peach is the base; teal and white grow out of the phone. */
  .backdrop {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .bg {
    position: absolute;
    inset: 0;
  }

  .bg-peach { background: var(--md-tertiary-container); }

  .bg-teal {
    background: #0e6257;
    clip-path: circle(0px at 50% 50%);
  }

  .bg-white {
    background: #ffffff;
    clip-path: circle(0px at 50% 50%);
  }

  /*
    Vertical centering uses inset + auto margins, never transform/translate.
    GSAP animates these blocks, and it turns a CSS translate such as -50%
    into fixed pixels the first time it touches the element. That freezes the
    offset, so the text drifts off-centre after a resize, zoom or font load.
  */
  .copy {
    position: absolute;
    inset-block: 0;
    height: fit-content;
    margin-block: auto;
    left: 8%;
    z-index: 8;
    width: min(39%, 520px);
    color: var(--stage-ink);
  }

  .tagline,
  .feature-copy {
    visibility: hidden;
    opacity: 0;
  }

  .problem {
    right: 0;
    left: 0;
    width: min(88%, 1180px);
    margin-inline: auto;
    text-align: center;
  }

  .problem h1 {
    max-width: 15ch;
    margin: 0 auto;
    font-size: clamp(3rem, 7.2vw, 7.4rem);
    line-height: 0.98;
  }

  .feature-copy {
    right: 14%;
    left: auto;
    width: min(32%, 460px);
  }

  h1,
  h2 {
    margin: 0 0 18px;
    color: var(--stage-ink);
    font-family: var(--font-display);
    font-size: clamp(2.6rem, 4.6vw, 4.6rem);
    font-weight: 600;
    letter-spacing: -0.04em;
    line-height: 0.99;
    text-wrap: balance;
  }

  .sub {
    max-width: 39ch;
    margin: 0;
    color: var(--stage-muted);
    font-size: clamp(1rem, 1.25vw, 1.15rem);
    line-height: 1.65;
  }

  .phone-slot {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 6;
    width: var(--phone-w);
    height: calc(var(--phone-w) * 19.5 / 9);
    margin-left: calc(var(--phone-w) / -2);
    margin-top: calc(var(--phone-w) * 19.5 / 9 / -2);
    display: block;
    opacity: 0;
    visibility: hidden;
    transform-style: preserve-3d;
    pointer-events: none;
    transition:
      opacity 220ms ease,
      visibility 0s linear 220ms;
  }

  .phone-slot.css-fallback {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 220ms ease,
      visibility 0s linear;
  }

  @media (prefers-reduced-motion: reduce) {
    .phone-slot { transition: none; }
  }

  .screen-fade {
    width: 100%;
    height: 100%;
  }

  .contact-shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    height: 40px;
    border-radius: 50%;
    background: rgba(25, 69, 57, 0.14);
    filter: blur(18px);
    opacity: 0;
    pointer-events: none;
  }

  .rail-wrap {
    position: absolute;
    inset-block: 0;
    right: 3%;
    z-index: 10;
    height: fit-content;
    margin-block: auto;
    visibility: hidden;
    opacity: 0;
  }

  .scroll-hint {
    position: absolute;
    right: 0;
    bottom: 28px;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    color: var(--stage-muted);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.15em;
  }

  .hint-line {
    width: 30px;
    height: 1px;
    background: var(--stage-accent);
    opacity: 0.5;
  }

  .scroll-hint .material-symbols-rounded {
    color: var(--stage-accent);
    font-size: 15px;
  }

  /* Reduced motion: one static page, no pinning. */
  .static-features {
    position: absolute;
    top: 52%;
    left: 8%;
    z-index: 8;
    width: min(42%, 550px);
    display: grid;
    gap: 16px;
    translate: 0 -50%;
  }

  .static-features article {
    padding: 14px 16px;
    border: 1px solid var(--md-outline-variant);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.7);
  }

  .static-number {
    color: var(--md-primary);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  .static-features h3 {
    margin: 4px 0;
    color: var(--md-on-surface);
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 500;
  }

  .static-features p {
    margin: 0;
    color: var(--md-on-surface-variant);
    font-size: 12px;
    line-height: 1.5;
  }

  .reduced-motion {
    height: auto;
  }

  .reduced-motion .stage {
    position: relative;
    min-height: 900px;
    padding-top: 100px;
    background: #ffffff;
  }

  .reduced-motion .bg-peach,
  .reduced-motion .bg-teal,
  .reduced-motion .scroll-hint,
  .reduced-motion .contact-shadow {
    display: none;
  }

  .reduced-motion .bg-white {
    clip-path: none;
  }

  .reduced-motion .copy.problem,
  .reduced-motion .copy.tagline {
    position: relative;
    inset: auto;
    width: auto;
    height: auto;
    margin: 0 7% 28px;
    visibility: visible;
    opacity: 1;
    text-align: left;
  }

  .reduced-motion .problem h1 {
    max-width: 18ch;
    margin: 0;
    font-size: clamp(2.4rem, 5vw, 4.4rem);
  }

  .reduced-motion .static-features {
    top: auto;
    bottom: 60px;
    left: 7%;
    width: 48%;
    translate: none;
  }

  .reduced-motion .phone-slot {
    top: 52%;
    left: 76%;
    display: block;
    transform:
      translate(-50%, -50%)
      rotateY(-12deg)
      rotateX(3deg)
      scale(0.86);
  }

  @media (max-width: 1100px) and (min-width: 768px) {
    .tagline {
      left: 6%;
      width: 40%;
    }

    .feature-copy {
      right: 12%;
      width: 34%;
    }

    .rail-wrap { right: 2%; }

    h1,
    h2 { font-size: clamp(2.4rem, 4.5vw, 4rem); }
  }

  /* Mobile is reworked after desktop is finished; this is only a safe fallback. */
  @media (max-width: 767px) {
    .stage { min-height: 600px; }

    .copy {
      inset-block: auto;
      top: clamp(96px, 14svh, 130px);
      margin-block: 0;
      left: 7%;
      width: 86%;
    }

    .copy.problem {
      inset-block: 0;
      right: 0;
      left: 0;
      margin-block: auto;
    }

    .copy.feature-copy {
      right: auto;
      left: 7%;
      width: 86%;
    }

    .problem h1 { font-size: clamp(2.6rem, 12vw, 3.6rem); }

    h1,
    h2 {
      max-width: 12ch;
      margin-bottom: 12px;
      font-size: clamp(2.3rem, 9.5vw, 3.2rem);
    }

    .sub {
      max-width: 35ch;
      font-size: 13px;
      line-height: 1.55;
    }

    .rail-wrap { display: none; }

    .scroll-hint {
      bottom: 17px;
      font-size: 8px;
    }

    .static-features {
      top: 12%;
      left: 7%;
      width: 86%;
      translate: none;
      gap: 8px;
    }

    .static-features article {
      padding: 9px 12px;
      border-radius: 14px;
    }

    .static-features h3 { font-size: 16px; }
    .static-features p { font-size: 10px; }

    .reduced-motion .stage { min-height: 1100px; }

    .reduced-motion .copy.problem { margin: 0 7% 20px; }

    .reduced-motion .static-features {
      bottom: 25px;
      width: 86%;
    }

    .reduced-motion .phone-slot { display: none; }
  }
</style>