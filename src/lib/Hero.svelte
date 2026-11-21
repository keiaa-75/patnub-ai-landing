<script>
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  import Phone from './Phone.svelte';
  import DemoScreens from './DemoScreens.svelte';
  import TeamProfilesMockup from './TeamProfilesMockup.svelte';
  import Shapes from './Shapes.svelte';

  import { spatial, effects } from './motion.js';

  const BEATS = 6;
  const FIRST_FEATURE_BEAT = 2;
  const DOWNLOAD_BEAT = 6;

  const SNAP = true;
  const SCRUB = 0.4;

  const FLAGS = typeof window === 'undefined'
    ? new URLSearchParams()
    : new URLSearchParams(window.location.search);

  const NO_SHAPES = FLAGS.has('noshapes');
  const NO_3D = FLAGS.has('no3d');

  const settle = (fn) =>
    requestAnimationFrame(() =>
      requestAnimationFrame(fn)
    );

  const whenFontsReady = (timeout) => {
    const loading = document.fonts?.load
      ? Promise.all([
          document.fonts.load('600 64px Fredoka'),
          document.fonts.load('400 16px Roboto')
        ])
      : Promise.resolve();

    return Promise.race([
      loading.catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, timeout))
    ]);
  };

  const T = (beat, fraction = 0) =>
    (beat + fraction) / BEATS;

  const D = (fraction) =>
    fraction / BEATS;

  let scene;
  let stage;

  let bgTeal;
  let bgWhite;

  let problem;
  let tagline;
  let featureCopy;
  let downloadCopy;

  let shapes;
  let scrollHint;

  let phoneSlot;
  let contactShadow;
  let screenFade;

  let phone3d = $state(null);
  let Phone3DLazy = $state(null);

  let screen = $state(0);
  let step = $state(0);

  let reduced = $state(false);
  let use3d = $state(!NO_3D);
  let threeReady = $state(false);

  const getDeviceHeight = () =>
    typeof window === 'undefined'
      ? 420
      : window.innerWidth < 768
        ? Math.min(window.innerHeight * 0.44, 320)
        : Math.min(window.innerHeight * 0.76, 700);

  let deviceHeight = $state(getDeviceHeight());

  /*
    The final entry is a special marker.

    Phone3D creates its texture dynamically using the
    GitHub profile photos, names, and project roles.
  */

  const SCREEN_URLS = [
    '/screens/assistant.png',
    '/screens/records.png',
    '/screens/scan.png',
    '/screens/medicines.png',
    'team-profiles'
  ];

  const features = [
    {
      title: 'Ask in plain language.',
      body: 'Ask about symptoms or medicines. Get clear explanations grounded in trusted health references and your own saved record.'
    },
    {
      title: 'Keep your doctor’s note.',
      body: 'Save clinician-approved instructions on your device, so the details are easier to revisit when you need them.'
    },
    {
      title: 'Save a note with a scan.',
      body: 'Use a secure QR code from your clinic to add approved instructions to your personal records.'
    },
    {
      title: 'Understand your medicines.',
      body: 'Find plain-language information from reviewed references, without losing sight of your clinician’s advice.'
    }
  ];

  const clamp = gsap.utils.clamp;

  function updateDeviceHeight() {
    deviceHeight = getDeviceHeight();
  }

  const startShapes = () =>
    settle(() => shapes?.enter());

  onMount(() => {
    gsap.registerPlugin(ScrollTrigger);

    updateDeviceHeight();

    window.addEventListener(
      'resize',
      updateDeviceHeight,
      { passive: true }
    );

    import('./Phone3D.svelte')
      .then((module) => {
        Phone3DLazy = module.default;
      })
      .catch(() => {
        use3d = false;
        startShapes();
      });

    if (!use3d) {
      startShapes();
    }

    const buildStory = (isDesktop) => {
      reduced = false;

      const restX = isDesktop ? 0.22 : 0;
      const featureX = isDesktop ? -0.22 : 0;

      const restScale = isDesktop ? 1 : 0.88;

      /*
        The landscape phone is enlarged enough to make
        the four profile cards readable.

        Its vertical position is slightly above the
        center of the final viewport.
      */

      const landscapeScale = isDesktop ? 1.15 : 0.95;
      const landscapeY = 0.04;

      const pose = {
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

      const idle = {
        y: 0,
        yaw: 0
      };

      const pointer = {
        x: 0,
        y: 0
      };

      const wobble = {
        value: 0,
        target: 0
      };

      const size = {
        w: 0,
        h: 0
      };

      let active = true;
      let lastBeat = 0;

      let lastClipTeal = '';
      let lastClipWhite = '';

      const measure = () => {
        size.w = stage.clientWidth;
        size.h = stage.clientHeight;
      };

      measure();

      window.addEventListener(
        'resize',
        measure,
        { passive: true }
      );

      gsap.set(
        [tagline, featureCopy, downloadCopy].filter(Boolean),
        { autoAlpha: 0 }
      );

      gsap.set(problem, {
        autoAlpha: 1,
        y: 0
      });

      if (scrollHint) {
        gsap.set(scrollHint, { autoAlpha: 1 });
      }

      screen = 0;
      step = 0;

      const headline = problem.querySelector('h1');

      let cancelled = false;

      gsap.set(headline, { y: 28 });

      whenFontsReady(1500).then(() => {
        if (cancelled) return;

        gsap.to(headline, {
          opacity: 1,
          duration: 0.6,
          ease: effects
        });

        gsap.to(headline, {
          y: 0,
          duration: 0.95,
          ease: spatial
        });
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: 'none'
        },

        scrollTrigger: {
          id: 'patnub-story',

          trigger: scene,

          start: 'top top',
          end: 'bottom bottom',

          scrub: SCRUB,

          invalidateOnRefresh: true,

          snap: SNAP
            ? {
                snapTo: 1 / BEATS,

                duration: {
                  min: 0.2,
                  max: 0.6
                },

                delay: 0.1,
                ease: 'power2.inOut'
              }
            : undefined,

          onUpdate: (self) => {
            wobble.target = clamp(
              -5,
              5,
              self.getVelocity() / 420
            );

            shapes?.setProgress(self.progress);

            const beat = Math.round(
              self.progress * BEATS
            );

            if (beat !== lastBeat) {
              lastBeat = beat;
              shapes?.goTo(beat);
            }
          }
        }
      });

      /*
        Beat 0 -> 1:
        The phone arrives and brings in the teal background.
      */

      timeline.to(
        pose,
        {
          xVw: restX,
          yaw: 0,
          z: 0,
          roll: 0,
          scale: restScale,

          duration: D(0.9),
          ease: 'power2.out'
        },
        T(0, 0.1)
      );

      timeline.to(
        pose,
        {
          reveal1: 1,

          duration: D(0.75),
          ease: 'power2.inOut'
        },
        T(0, 0.2)
      );

      /*
        Beat 1 -> 2:
        The phone moves from right to left.
      */

      timeline.to(
        pose,
        {
          xVw: featureX,
          yaw: -360,

          duration: D(0.9),
          ease: 'power2.inOut'
        },
        T(1, 0.05)
      );

      timeline.to(
        pose,
        {
          reveal2: 1,

          duration: D(0.75),
          ease: 'power2.inOut'
        },
        T(1, 0.15)
      );

      /*
        Beat 5 -> 6:

        The phone travels toward the horizontal center,
        moves upward slightly, and rotates into landscape.

        The profile-screen texture is revealed toward
        the end of the transition.
      */

      timeline.to(
        pose,
        {
          xVw: 0,
          yVh: landscapeY,

          yaw: 0,
          pitch: 0,
          roll: 90,

          scale: landscapeScale,

          duration: D(0.95),
          ease: 'power2.inOut'
        },
        T(5, 0.05)
      );

      timeline.to(
        pose,
        {
          screenF: 4,

          duration: D(0.45),
          ease: 'none'
        },
        T(5, 0.42)
      );

      /*
        Pin the timeline to exactly 1.
      */

      timeline.set({}, { x: 0 }, 1);

      /*
        Time-based content animations.
      */

      const gates = {
        problem: true,
        hint: true,
        tagline: false,
        feature: false,
        download: false
      };

      const nudge = {
        s: 0,
        p: 0
      };

      let featureIndex = 0;

      const partsOf = (block) =>
        block
          ? gsap.utils.toArray(block.children)
          : [];

      const playIn = (parts, dir = 1) => {
        gsap.killTweensOf(parts);

        gsap.set(parts, {
          autoAlpha: 0,
          y: 28 * dir
        });

        gsap.to(parts, {
          autoAlpha: 1,
          duration: 0.45,
          ease: effects,
          stagger: 0.07
        });

        gsap.to(parts, {
          y: 0,
          duration: 0.9,
          ease: spatial,
          stagger: 0.07
        });
      };

      const showBlock = (block) => {
        if (!block) return;

        gsap.set(block, { autoAlpha: 1 });
        playIn(partsOf(block));
      };

      const hideBlock = (block, name) => {
        if (!block) return;

        const parts = partsOf(block);

        gsap.killTweensOf(parts);

        gsap.to(parts, {
          autoAlpha: 0,
          y: -18,

          duration: 0.25,
          ease: effects,

          stagger: 0.03,

          onComplete: () => {
            if (!gates[name]) {
              gsap.set(block, { autoAlpha: 0 });
            }
          }
        });
      };

      const setProblem = (show) => {
        gsap.killTweensOf(problem);

        if (show) {
          gsap.to(problem, {
            autoAlpha: 1,
            duration: 0.4,
            ease: effects
          });

          gsap.to(problem, {
            y: 0,
            duration: 0.9,
            ease: spatial
          });
        } else {
          gsap.to(problem, {
            autoAlpha: 0,
            y: -28,
            duration: 0.3,
            ease: effects
          });
        }
      };

      const setHint = (show) => {
        if (!scrollHint) return;

        gsap.to(scrollHint, {
          autoAlpha: show ? 1 : 0,

          duration: 0.3,
          ease: effects,

          overwrite: 'auto'
        });
      };

      /*
        The feature text changes while invisible,
        then springs into its new position.
      */

      const swapFeature = (index, dir) => {
        const parts = partsOf(featureCopy);

        gsap.killTweensOf(parts);

        gsap.to(parts, {
          autoAlpha: 0,
          y: -16 * dir,

          duration: 0.2,
          ease: effects,

          stagger: 0.02,

          onComplete: async () => {
            step = index;

            await tick();

            if (
              gates.feature &&
              featureIndex === index
            ) {
              playIn(parts, dir);
            }
          }
        });
      };

      const changeFeature = (index, dir) => {
        featureIndex = index;

        gsap.to(pose, {
          screenF: index,

          duration: 0.7,
          ease: effects,

          overwrite: 'auto'
        });

        gsap.fromTo(
          nudge,

          {
            s: 0.03,
            p: -2.5
          },

          {
            s: 0,
            p: 0,

            duration: 0.9,
            ease: spatial,

            overwrite: true
          }
        );

        if (gates.feature) {
          swapFeature(index, dir);
        } else {
          step = index;
        }
      };

      /*
        A small boundary margin prevents flickering
        around snap positions.
      */

      const inWindow = (name, beat, low, high) => {
        const margin = gates[name] ? 0.05 : 0;

        return (
          beat >= low - margin &&
          beat <= high + margin
        );
      };

      const syncStory = () => {
        const beat = timeline.progress() * BEATS;

        const problemOn = inWindow(
          'problem',
          beat,
          -1,
          0.15
        );

        if (problemOn !== gates.problem) {
          gates.problem = problemOn;
          setProblem(problemOn);
        }

        const hintOn = inWindow(
          'hint',
          beat,
          -1,
          0.08
        );

        if (hintOn !== gates.hint) {
          gates.hint = hintOn;
          setHint(hintOn);
        }

        /*
          Hero tagline.
        */

        const taglineOn = inWindow(
          'tagline',
          beat,
          0.85,
          1.25
        );

        if (taglineOn !== gates.tagline) {
          gates.tagline = taglineOn;

          if (taglineOn) {
            showBlock(tagline);
          } else {
            hideBlock(tagline, 'tagline');
          }
        }

        /*
          Features.
        */

        const featureOn = inWindow(
          'feature',
          beat,
          1.85,
          5.3
        );

        if (featureOn !== gates.feature) {
          gates.feature = featureOn;

          if (featureOn) {
            step = featureIndex;
            showBlock(featureCopy);
          } else {
            hideBlock(featureCopy, 'feature');
          }
        }

        /*
          Download section.

          The headline and button appear while the
          phone is approaching its landscape position.
        */

        const downloadOn = inWindow(
          'download',
          beat,
          5.55,
          DOWNLOAD_BEAT + 1
        );

        if (downloadOn !== gates.download) {
          gates.download = downloadOn;

          if (downloadOn) {
            showBlock(downloadCopy);
          } else {
            hideBlock(downloadCopy, 'download');
          }
        }

        /*
          Active feature screen.
        */

        const index = clamp(
          0,
          features.length - 1,
          Math.round(beat) - FIRST_FEATURE_BEAT
        );

        if (index !== featureIndex) {
          changeFeature(
            index,
            index > featureIndex ? 1 : -1
          );
        }
      };

      /*
        Backdrop clipping.
      */

      const clipFor = (amount) => {
        if (amount <= 0.001) {
          return 'circle(0px at 50% 50%)';
        }

        const cx = size.w * (0.5 + pose.xVw);
        const cy = size.h * (0.5 + pose.yVh);

        const reach = Math.hypot(
          Math.max(cx, size.w - cx),
          Math.max(cy, size.h - cy)
        );

        return `circle(${(reach * amount * 1.02).toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`;
      };

      /*
        Main render loop.
      */

      const render = () => {
        if (!active) return;

        syncStory();

        const yaw = pose.yaw + idle.yaw + pointer.y;
        const pitch = pose.pitch + pointer.x + nudge.p;

        const scale = pose.scale + nudge.s;

        wobble.value += (
          wobble.target - wobble.value
        ) * 0.085;

        wobble.target *= 0.88;

        const roll = pose.roll + wobble.value;

        if (use3d && threeReady && phone3d) {
          phone3d.setPose({
            ...pose,
            yaw,
            pitch,
            roll,
            scale
          });
        } else if (phoneSlot) {
          gsap.set(phoneSlot, {
            x: pose.xVw * size.w,

            y: pose.yVh * size.h + idle.y,

            z: pose.z,

            rotationY: yaw,
            rotationX: pitch,
            rotationZ: roll,

            scale
          });
        }

        const clipTeal = clipFor(pose.reveal1);
        const clipWhite = clipFor(pose.reveal2);

        if (
          bgTeal &&
          clipTeal !== lastClipTeal
        ) {
          bgTeal.style.clipPath = clipTeal;
          lastClipTeal = clipTeal;
        }

        if (
          bgWhite &&
          clipWhite !== lastClipWhite
        ) {
          bgWhite.style.clipPath = clipWhite;
          lastClipWhite = clipWhite;
        }

        const radians = yaw * Math.PI / 180;

        if (phoneSlot) {
          phoneSlot.style.setProperty(
            '--sheen',
            `${50 + Math.sin(radians) * 26}%`
          );

          phoneSlot.style.setProperty(
            '--glass-pos',
            `${50 + Math.cos(radians) * 38}%`
          );
        }

        if (contactShadow) {
          const edge = Math.abs(Math.cos(radians));

          gsap.set(contactShadow, {
            x: size.w * (0.5 + pose.xVw),

            y:
              size.h * (0.5 + pose.yVh) +
              deviceHeight * scale * 0.5 +
              6,

            xPercent: -50,

            scaleX: 0.72 + 0.28 * edge,

            opacity: 0.1 + 0.08 * edge
          });
        }

        if (screenFade) {
          const difference = Math.abs(
            pose.screenF - Math.round(pose.screenF)
          );

          screenFade.style.opacity =
            1 - difference * 0.85;
        }

        const nextScreen = clamp(
          0,
          SCREEN_URLS.length - 1,
          Math.round(pose.screenF)
        );

        if (nextScreen !== screen) {
          screen = nextScreen;
        }
      };

      /*
        Pointer interaction.
      */

      const tiltPitch = gsap.quickTo(
        pointer,
        'x',
        {
          duration: 0.65,
          ease: 'power2.out'
        }
      );

      const tiltYaw = gsap.quickTo(
        pointer,
        'y',
        {
          duration: 0.65,
          ease: 'power2.out'
        }
      );

      const onPointer = (event) => {
        if (event.pointerType === 'touch') return;

        const bounds = stage.getBoundingClientRect();

        const x = (
          (event.clientX - bounds.left) /
          bounds.width -
          0.5
        ) * 2;

        const y = (
          (event.clientY - bounds.top) /
          bounds.height -
          0.5
        ) * 2;

        tiltPitch(-y * 2.5);
        tiltYaw(x * 3.5);
      };

      stage.addEventListener(
        'pointermove',
        onPointer,
        { passive: true }
      );

      /*
        Gentle idle movement.
      */

      const idleTween = gsap.to(idle, {
        y: 5,
        yaw: 2.2,

        duration: 3.2,
        ease: 'sine.inOut',

        yoyo: true,
        repeat: -1
      });

      /*
        Pause rendering when the stage is outside
        the viewport.
      */

      const observer = new IntersectionObserver(
        ([entry]) => {
          active = entry.isIntersecting;
        }
      );

      observer.observe(stage);

      gsap.ticker.add(render);

      render();

      /*
        Cleanup.
      */

      return () => {
        cancelled = true;

        const blocks = [
          problem,
          scrollHint,
          tagline,
          featureCopy,
          downloadCopy
        ].filter(Boolean);

        const parts = [
          ...partsOf(tagline),
          ...partsOf(featureCopy),
          ...partsOf(downloadCopy)
        ];

        gsap.killTweensOf([
          headline,
          ...blocks,
          ...parts,
          pose,
          nudge
        ]);

        gsap.set(
          [headline, ...blocks, ...parts],
          { clearProps: 'all' }
        );

        stage.removeEventListener(
          'pointermove',
          onPointer
        );

        window.removeEventListener(
          'resize',
          measure
        );

        observer.disconnect();

        gsap.ticker.remove(render);

        idleTween.kill();

        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    };

    /*
      Reduced-motion mode.
    */

    const buildReducedMotion = () => {
      reduced = true;

      screen = 4;
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

    media.add(
      '(prefers-reduced-motion: reduce)',
      buildReducedMotion
    );

    return () => {
      media.revert();

      window.removeEventListener(
        'resize',
        updateDeviceHeight
      );
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

    {#if !reduced && !NO_SHAPES}
      <Shapes bind:this={shapes} beats={BEATS} />
    {/if}

    <!-- Opening question -->
    <div class="copy problem scheme-peach" bind:this={problem}>
      <h1>Do you ever wish understanding your health was easier?</h1>
    </div>

    <!-- Hero tagline -->
    <div class="copy tagline scheme-teal" bind:this={tagline}>
      <h2>Your doctor’s note, in plain words.</h2>

      <p class="sub">
        patnub.ai keeps your clinician’s instructions on your phone
        and explains them in plain language, even offline.
      </p>
    </div>

    <!-- Feature copy -->
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
      <div
        class="copy feature-copy scheme-white"
        bind:this={featureCopy}
      >
        <h2>{features[step].title}</h2>
        <p class="sub">{features[step].body}</p>
      </div>
    {/if}

    <!-- Download content -->
    <div
      class="copy download-copy scheme-white"
      bind:this={downloadCopy}
    >
      <h2>Take patnub.ai with you.</h2>

      <p class="sub">
        Get the Android app and keep important care information
        within reach, wherever you go.
      </p>

      <a
        class="download-button"
        href="/downloads/patnub-ai.apk"
        download="patnub-ai.apk"
      >
        <span class="material-symbols-rounded" aria-hidden="true">
          download
        </span>
        Download
      </a>
    </div>

    <!-- Phone shadow -->
    <div
      class="contact-shadow"
      bind:this={contactShadow}
      style={`width: ${deviceHeight * 0.5}px`}
      aria-hidden="true"
    ></div>

    <!-- 3D device -->
    {#if use3d && !reduced && Phone3DLazy}
      <Phone3DLazy
        bind:this={phone3d}
        screens={SCREEN_URLS}
        phoneHeight={deviceHeight}
        baseTop={0.5}
        onready={() => {
          threeReady = true;
          startShapes();
        }}
        onfail={() => {
          use3d = false;
          threeReady = false;
          startShapes();
        }}
      />
    {/if}

    <!-- CSS device fallback -->
    <div
      class="phone-slot"
      class:css-fallback={!use3d || reduced}
      bind:this={phoneSlot}
      style={`--phone-w: ${(deviceHeight * 9) / 19.5}px`}
      aria-hidden="true"
    >
      <Phone>
        <div class="screen-fade" bind:this={screenFade}>
          {#if screen === 4}
            <TeamProfilesMockup />
          {:else}
            <DemoScreens index={screen} />
          {/if}
        </div>
      </Phone>
    </div>

    <!-- Scroll hint -->
    <div
      class="scroll-hint scheme-peach"
      bind:this={scrollHint}
    >
      <span class="hint-line"></span>
      SCROLL
      <span class="material-symbols-rounded">south</span>
    </div>
  </div>
</section>

<style>
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

  /* Color schemes */

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

  /* Backdrops */

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

  .bg-peach {
    background: var(--md-tertiary-container);
  }

  .bg-teal {
    background: #0e6257;
    clip-path: circle(0px at 50% 50%);
  }

  .bg-white {
    background: #ffffff;
    clip-path: circle(0px at 50% 50%);
  }

  /* General copy */

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
  .feature-copy,
  .download-copy {
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

    opacity: 0;
  }

  .feature-copy {
    right: 10%;
    left: auto;

    width: min(34%, 480px);
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

  /* Download section */

  .download-copy {
    inset-block: auto;

    top: clamp(25px, 5vh, 52px);

    right: 0;
    left: 0;

    width: min(88%, 760px);

    height: auto;

    margin: 0 auto;

    text-align: center;
  }

  .download-copy h2 {
    max-width: 100%;
    margin: 0 0 9px;

    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1;
  }

  .download-copy .sub {
    max-width: 54ch;
    margin-inline: auto;

    font-size: clamp(0.85rem, 1.1vw, 1rem);
  }

  .download-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    gap: 9px;

    margin-top: 16px;
    padding: 12px 23px;

    border: 0;
    border-radius: 999px;

    background: var(--md-primary-strong);
    color: #ffffff;

    font-size: 14px;
    font-weight: 700;

    text-decoration: none;

    box-shadow: 0 8px 22px rgba(14, 98, 87, 0.16);

    transition:
      transform 180ms ease,
      background 180ms ease,
      box-shadow 180ms ease;
  }

  .download-button:hover {
    transform: translateY(-3px);

    background: #075b50;

    box-shadow: 0 12px 26px rgba(14, 98, 87, 0.22);
  }

  .download-button:active {
    transform: scale(0.97);
  }

  .download-button .material-symbols-rounded {
    font-size: 19px;
  }

  /* Phone */

  .phone-slot {
    position: absolute;

    top: 50%;
    left: 50%;

    z-index: 6;

    width: var(--phone-w);

    height: calc(var(--phone-w) * 19.5 / 9);

    margin-left: calc(var(--phone-w) / -2);

    margin-top: calc(
      var(--phone-w) * 19.5 / 9 / -2
    );

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

  .screen-fade {
    width: 100%;
    height: 100%;
  }

  /* Shadow */

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

  /* Scroll hint */

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

  /* Reduced motion */

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

    min-height: 1450px;

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
    opacity: 1;
  }

  .reduced-motion .static-features {
    top: 34%;
    bottom: auto;

    left: 7%;

    width: 48%;

    translate: none;
  }

  .reduced-motion .download-copy {
    position: absolute;

    top: auto;
    right: 7%;
    bottom: 38px;
    left: 7%;

    width: auto;
    height: auto;

    margin: 0;

    visibility: visible;
    opacity: 1;

    text-align: left;
  }

  .reduced-motion .download-copy h2 {
    max-width: 15ch;

    font-size: clamp(2rem, 4vw, 3.3rem);
  }

  .reduced-motion .download-copy .sub {
    margin: 0;
  }

  .reduced-motion .phone-slot {
    top: 66%;
    left: 50%;

    display: block;

    opacity: 1;
    visibility: visible;

    transform:
      rotateZ(90deg)
      scale(0.85);

    transition: none;
  }

  /* Medium desktop */

  @media (max-width: 1100px) and (min-width: 768px) {
    .tagline {
      left: 6%;
      width: 40%;
    }

    .feature-copy {
      right: 8%;
      width: 38%;
    }

    h1,
    h2 {
      font-size: clamp(2.4rem, 4.5vw, 4rem);
    }

    .download-copy h2 {
      font-size: clamp(2rem, 4.5vw, 3.2rem);
    }
  }

  /* Mobile */

  @media (max-width: 767px) {
    .stage {
      min-height: 600px;
    }

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

    .problem h1 {
      font-size: clamp(2.6rem, 12vw, 3.6rem);
    }

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

    .download-copy {
      top: 25px;
      left: 5%;

      width: 90%;
    }

    .download-copy h2 {
      max-width: 100%;

      font-size: clamp(1.8rem, 7.5vw, 2.5rem);
    }

    .download-copy .sub {
      max-width: 34ch;
      font-size: 11px;
    }

    .download-button {
      margin-top: 11px;
      padding: 10px 19px;
      font-size: 12px;
    }

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

    .static-features h3 {
      font-size: 16px;
    }

    .static-features p {
      font-size: 10px;
    }

    .reduced-motion .stage {
      min-height: 1350px;
    }

    .reduced-motion .copy.problem {
      margin: 0 7% 20px;
    }

    .reduced-motion .static-features {
      top: 30%;
      bottom: auto;

      left: 7%;
      width: 86%;
    }

    .reduced-motion .download-copy {
      right: 7%;
      bottom: 35px;
      left: 7%;
    }

    .reduced-motion .phone-slot {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .phone-slot,
    .download-button {
      transition: none;
    }
  }
</style>