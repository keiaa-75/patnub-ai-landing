<script>
  import { onMount } from 'svelte';
  import Shapes from './Shapes.svelte';

  let { features = [] } = $props();

  /*
    Mobile story: five full-viewport scenes.

      0  Opening question
      1  Say hi to patnub.ai
      2  Ask in plain language (animated chat)
      3  The remaining features
      4  Download + BrewCode credit

    Structure
    ---------
    - One fixed backdrop sits behind every scene. The scenes are
      transparent, so the backdrop colour changes as the user scrolls.
    - Animated shapes belong to the opening scene only. They stay on the
      first layout, fade out once the user leaves scene 0, and fade back in
      when they return.
    - Three IntersectionObservers drive everything. There is no scroll
      scrubbing and no pinning.
        enter      a scene's top has risen into view -> play its animation
        active     a scene crosses the middle of the viewport -> recolour
                   the backdrop
        offscreen  a scene is completely out of view -> reset it, so the
                   animation replays the next time it comes back
    - Reduced motion: no slides, no typing. Text is shown in full.
  */

  const MARK_SRC = '/screens/nurse-mark.svg';

  const BACKDROPS = ['#ffddbd', '#0e6257', '#e6f2ee', '#fff1e2', '#dcefe8'];

  const PLACEHOLDER = 'Ask a health question';

  const USER_MESSAGE =
    'I’ve had a headache for two days and feel dizzy when I stand up';

  const REPLY_MESSAGE =
    'It sounds like you are feeling unsteady. This can be caused by many things, like dehydration or low blood pressure. Try to sit down slowly when you stand up. If the dizziness is severe or doesn’t go away, please see a health center right away.';

  const lead = $derived(features[0] ?? { title: '', body: '' });
  const moreFeatures = $derived(features.slice(1));

  let reduced = $state(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  let shapes = $state(null);
  let sceneEls = $state([]);

  let active = $state(0);
  let shown = $state([false, false, false, false, false]);

  // Typing state for scene 1 (composer) and scene 2 (chat).
  let placeholder = $state('');
  let composerCaret = $state(false);

  let userText = $state('');
  let replyText = $state('');
  let userIn = $state(false);
  let replyIn = $state(false);
  let userCaret = $state(false);
  let replyCaret = $state(false);

  /*
    Each scene has a run counter. Bumping it cancels any typing loop that
    started under an older number, which is how resets and teardown stop
    the animation cleanly.
  */
  const sceneRun = [0, 0, 0, 0, 0];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const stale = (scene, run) => sceneRun[scene] !== run;

  async function typeInto(setter, text, delay, scene, run) {
    for (let i = 1; i <= text.length; i += 1) {
      if (stale(scene, run)) return false;

      setter(text.slice(0, i));

      const previous = text[i - 1];
      const pause = '.,'.includes(previous) ? 130 : 0;

      await sleep(delay * (0.7 + Math.random() * 0.7) + pause);
    }

    return !stale(scene, run);
  }

  function showFinalText() {
    placeholder = PLACEHOLDER;
    userText = USER_MESSAGE;
    replyText = REPLY_MESSAGE;
    userIn = true;
    replyIn = true;
    composerCaret = false;
    userCaret = false;
    replyCaret = false;
  }

  async function playComposer(run) {
    placeholder = '';
    composerCaret = true;

    await sleep(800);
    if (stale(1, run)) return;

    await typeInto((value) => { placeholder = value; }, PLACEHOLDER, 52, 1, run);
  }

  async function playChat(run) {
    userText = '';
    replyText = '';
    userIn = false;
    replyIn = false;
    userCaret = false;
    replyCaret = false;

    await sleep(600);
    if (stale(2, run)) return;

    userIn = true;

    await sleep(700);
    if (stale(2, run)) return;

    userCaret = true;

    const userDone = await typeInto(
      (value) => { userText = value; },
      USER_MESSAGE,
      26,
      2,
      run
    );

    if (!userDone) return;

    userCaret = false;

    await sleep(650);
    if (stale(2, run)) return;

    replyIn = true;

    await sleep(600);
    if (stale(2, run)) return;

    replyCaret = true;

    const replyDone = await typeInto(
      (value) => { replyText = value; },
      REPLY_MESSAGE,
      16,
      2,
      run
    );

    if (replyDone) replyCaret = false;
  }

  function enterScene(index) {
    if (shown[index]) return;

    shown[index] = true;
    sceneRun[index] += 1;

    const run = sceneRun[index];

    if (index === 1) {
      if (reduced) showFinalText();
      else playComposer(run);
    }

    if (index === 2) {
      if (reduced) showFinalText();
      else playChat(run);
    }
  }

  function resetScene(index) {
    if (!shown[index]) return;

    shown[index] = false;
    sceneRun[index] += 1;

    // Reduced motion keeps its text; there is nothing to replay.
    if (reduced) return;

    if (index === 1) {
      placeholder = '';
      composerCaret = false;
    }

    if (index === 2) {
      userText = '';
      replyText = '';
      userIn = false;
      replyIn = false;
      userCaret = false;
      replyCaret = false;
    }
  }

  const whenFontsReady = (timeout) => {
    const loading = document.fonts?.load
      ? Promise.all([
          document.fonts.load('600 64px Fredoka'),
          document.fonts.load('300 16px Roboto'),
          document.fonts.load('400 16px Roboto')
        ])
      : Promise.resolve();

    return Promise.race([
      loading.catch(() => {}),
      new Promise((resolve) => setTimeout(resolve, timeout))
    ]);
  };

  onMount(() => {
    let destroyed = false;
    const observers = [];

    // Gentle snapping between scenes. "proximity" never fights the thumb.
    const root = document.documentElement;
    const previousSnap = root.style.scrollSnapType;
    root.style.scrollSnapType = 'y proximity';

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onMotionChange = (event) => {
      reduced = event.matches;
      if (reduced) showFinalText();
    };

    motionQuery.addEventListener?.('change', onMotionChange);

    if (reduced) showFinalText();

    const sceneIndex = (element) => Number(element.dataset.scene);

    const watch = (options, handler) => {
      const observer = new IntersectionObserver(handler, options);

      sceneEls.forEach((element) => {
        if (element) observer.observe(element);
      });

      observers.push(observer);
    };

    // Wait for the display font so the opening headline does not swap mid-entrance.
    whenFontsReady(1200).then(() => {
      if (destroyed) return;

      watch({ rootMargin: '0px 0px -22% 0px' }, (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) enterScene(sceneIndex(entry.target));
        });
      });

      watch({ rootMargin: '-38% 0px -38% 0px' }, (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          active = sceneIndex(entry.target);
        });
      });

      watch({ threshold: 0 }, (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) resetScene(sceneIndex(entry.target));
        });
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => shapes?.enter());
      });
    });

    return () => {
      destroyed = true;

      for (let i = 0; i < sceneRun.length; i += 1) sceneRun[i] += 1;

      observers.forEach((observer) => observer.disconnect());
      motionQuery.removeEventListener?.('change', onMotionChange);

      root.style.scrollSnapType = previousSnap;
    };
  });
</script>

<div class="mobile-experience" id="story">
  <div
    class="backdrop"
    style:background-color={BACKDROPS[active]}
    aria-hidden="true"
  ></div>

  <!-- Shapes live in the opening scene only. -->
  {#if !reduced}
    <div class="shapes-layer" class:away={active !== 0} aria-hidden="true">
      <Shapes bind:this={shapes} mode="mobile" beats={1} />
    </div>
  {/if}

  <!-- Scene 0: opening question -->
  <section
    class="scene scene-hero"
    class:shown={shown[0]}
    data-scene="0"
    bind:this={sceneEls[0]}
    aria-labelledby="mobile-hero-title"
  >
    <header class="brand-row reveal" style="--i: 0">
      <a class="brand" href="#top" aria-label="patnub.ai home">
        <img src={MARK_SRC} alt="" width="34" height="34" />
        <span>patnub.ai</span>
      </a>
    </header>

    <div class="hero-copy">
      <h1 id="mobile-hero-title" class="reveal reveal-rise" style="--i: 1">
        Want to understand your health better?
      </h1>
    </div>

    <a class="scroll-hint reveal" style="--i: 3" href="#mobile-hi">
      <span class="hint-line"></span>
      SCROLL
      <span class="material-symbols-rounded" aria-hidden="true">south</span>
    </a>
  </section>

  <!-- Scene 1: say hi -->
  <section
    class="scene scene-hi"
    id="mobile-hi"
    class:shown={shown[1]}
    data-scene="1"
    bind:this={sceneEls[1]}
    aria-labelledby="mobile-hi-title"
  >
    <div class="app-card reveal reveal-pop" style="--i: 0">
      <div class="app-mark">
        <img src={MARK_SRC} alt="" />
      </div>

      <p class="app-prompt">How can I help?</p>

      <div class="composer" aria-hidden="true">
        <span class="plus">+</span>

        <span class="composer-text">
          {placeholder}{#if composerCaret}<i class="caret"></i>{/if}
        </span>

        <span class="send">
          <svg viewBox="0 0 32 32" focusable="false">
            <path d="M16 26V6M7 15l9-9 9 9" />
          </svg>
        </span>
      </div>

      <span class="sr-only">{PLACEHOLDER}</span>
    </div>

    <div class="hi-copy reveal reveal-rise" style="--i: 2">
      <h2 id="mobile-hi-title">Say hi to patnub.ai!</h2>

      <p>
        Explore health topics, understand medicines, and keep important
        health information close. Use it online or offline.
      </p>
    </div>
  </section>

  <!-- Scene 2: ask in plain language -->
  <section
    class="scene scene-chat"
    class:shown={shown[2]}
    data-scene="2"
    bind:this={sceneEls[2]}
    aria-labelledby="mobile-chat-title"
  >
    <div class="chat-card reveal reveal-pop" style="--i: 0">
      <div class="chat-stream" aria-hidden="true">
        <div class="bubble bubble-user" class:in={userIn}>
          <p>{userText}{#if userCaret}<i class="caret"></i>{/if}</p>
        </div>

        <div class="bubble bubble-reply" class:in={replyIn}>
          <p>{replyText}{#if replyCaret}<i class="caret"></i>{/if}</p>
        </div>
      </div>

      <p class="sr-only">
        Example question: {USER_MESSAGE} Example reply: {REPLY_MESSAGE}
      </p>
    </div>

    <article class="feature-card reveal reveal-rise" style="--i: 2">
      <h2 id="mobile-chat-title">{lead.title}</h2>
      <p>{lead.body}</p>
    </article>
  </section>

  <!-- Scene 3: the other features -->
  <section
    class="scene scene-more"
    class:shown={shown[3]}
    data-scene="3"
    bind:this={sceneEls[3]}
    aria-label="More ways patnub.ai helps"
  >
    {#each moreFeatures as feature, i}
      <article
        class={`more-card more-tone-${i % 3} reveal reveal-pop`}
        style={`--i: ${i}`}
      >
        <h2>{feature.title}</h2>
        <p>{feature.body}</p>
      </article>
    {/each}
  </section>

  <!-- Scene 4: download + credit -->
  <section
    class="scene scene-final"
    class:shown={shown[4]}
    data-scene="4"
    bind:this={sceneEls[4]}
    aria-label="Download patnub.ai"
  >
    <article class="download-card reveal reveal-pop" style="--i: 0">
      <div class="download-body">
        <h2>Take patnub.ai with you.</h2>

        <p>
          Get the Android app and keep important care information within
          reach, wherever you go.
        </p>

        <div class="actions">
          <a
            class="download-button"
            href="/downloads/patnub-ai.apk"
            download="patnub-ai.apk"
          >
            <span class="material-symbols-rounded" aria-hidden="true">download</span>
            Download
          </a>

          <a class="clinician-button" href="/clinicians">
            <span class="material-symbols-rounded" aria-hidden="true">stethoscope</span>
            Clinician Platform
          </a>
        </div>
      </div>
    </article>

    <article class="credit-card reveal reveal-pop" style="--i: 2">
      <h2>Built at the BrewCode Hackathon.</h2>

      <p>
        Organized by the Elite League of IT Students of Cavite State
        University.
      </p>
    </article>
  </section>
</div>

<style>
  .mobile-experience {
    position: relative;
    isolation: isolate;
    min-height: 100vh;
    min-height: 100svh;
    overflow-x: clip;
    font-family: var(--font-body);
  }

  /* Fixed layers: backdrop (0), opening-scene shapes (1), scenes (2). */

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-color: #ffddbd;
    transition: background-color 700ms cubic-bezier(0.2, 0, 0, 1);
  }

  /*
    Fades the shapes out when the user leaves the opening scene.
    Effects (opacity) never overshoot. Visibility switches off after the
    fade so the hidden layer costs nothing to paint.
  */
  .shapes-layer {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 520ms cubic-bezier(0.2, 0, 0, 1),
      visibility 0s linear 0s;
  }

  .shapes-layer.away {
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 520ms cubic-bezier(0.2, 0, 0, 1),
      visibility 0s linear 520ms;
  }

  .scene {
    position: relative;
    z-index: 2;

    display: flex;
    flex-direction: column;
    gap: 14px;

    min-height: 100vh;
    min-height: 100svh;

    /* The bottom padding keeps content clear of the floating control dock. */
    padding:
      max(18px, env(safe-area-inset-top))
      max(18px, env(safe-area-inset-right))
      calc(env(safe-area-inset-bottom) + 86px)
      max(18px, env(safe-area-inset-left));

    scroll-snap-align: start;
  }

  .scene h1,
  .scene h2,
  .scene p {
    margin: 0;
  }

  /* ---------------------------
     Reveal: spatial spring for position, no-overshoot ease for opacity.
  --------------------------- */

  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 420ms cubic-bezier(0.2, 0, 0, 1) calc(var(--i, 0) * 90ms),
      transform 900ms cubic-bezier(0.34, 1.45, 0.64, 1) calc(var(--i, 0) * 90ms);
  }

  .reveal-pop {
    transform: translateY(44px) scale(0.94);
  }

  .shown .reveal {
    opacity: 1;
    transform: none;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }

  .caret {
    display: inline-block;
    width: 2px;
    height: 1.05em;
    margin-left: 2px;
    vertical-align: text-bottom;
    background: currentColor;
    animation: blink 1s steps(1) infinite;
  }

  @keyframes blink {
    50% { opacity: 0; }
  }

  /* ---------------------------
     Scene 0: opening question
  --------------------------- */

  .scene-hero {
    --ink: #2c1600;
    --muted: #5e4630;
    --accent: #8a5b32;

    justify-content: space-between;
    padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
    color: var(--ink);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 9px;

    color: #1b5148;
    font-family: var(--font-display);
    font-size: 21px;
    font-weight: 600;
    letter-spacing: -0.04em;
    text-decoration: none;
  }

  .brand img {
    display: block;
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  .hero-copy {
    flex: 1;
    display: grid;
    place-items: center;
    padding-block: 12px;
  }

  .scene-hero h1 {
    max-width: 11ch;
    color: var(--ink);
    font-family: var(--font-display);
    font-size: clamp(2.9rem, 15vw, 5.4rem);
    font-weight: 600;
    letter-spacing: -0.055em;
    line-height: 0.98;
    text-align: center;
    text-wrap: balance;
  }

  .scroll-hint {
    display: flex;
    align-items: center;
    gap: 9px;
    width: fit-content;

    color: var(--muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-decoration: none;
  }

  .hint-line {
    width: 30px;
    height: 1px;
    background: var(--accent);
    opacity: 0.5;
  }

  .scroll-hint .material-symbols-rounded {
    color: var(--accent);
    font-size: 15px;
    animation: hint-bob 1.8s ease-in-out infinite;
  }

  @keyframes hint-bob {
    50% { transform: translateY(3px); }
  }

  /* ---------------------------
     Scene 1: say hi
  --------------------------- */

  .scene-hi {
    color: #f5fbf8;
  }

  .app-card {
    flex: 1 1 auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 22px;

    min-height: 280px;
    padding: 28px 20px;

    border-radius: 40px 40px 40px 14px;
    background: #eef2f3;
    color: #111819;
    box-shadow: 0 18px 44px rgba(4, 36, 31, 0.22);
  }

  .app-mark {
    display: grid;
    place-items: center;
    width: 112px;
    height: 112px;
    border-radius: 50%;
    background: #e0eeee;
  }

  .app-mark img {
    display: block;
    width: 82px;
    height: 82px;
    object-fit: contain;
  }

  .app-prompt {
    color: #111819;
    font-size: clamp(1.75rem, 8vw, 2.3rem);
    font-weight: 300;
    letter-spacing: -0.035em;
    line-height: 1.15;
    text-align: center;
  }

  .composer {
    display: flex;
    align-items: center;
    gap: 12px;

    width: 100%;
    min-height: 62px;
    padding: 0 9px 0 22px;

    border: 1px solid #e1e6e7;
    border-radius: 999px;
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(28, 47, 47, 0.14);
  }

  .plus {
    color: #207e7b;
    font-family: Arial, sans-serif;
    font-size: 28px;
    font-weight: 300;
    line-height: 1;
  }

  .composer-text {
    flex: 1;
    min-width: 0;
    color: #6b7777;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
  }

  .send {
    flex: none;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #e4ebeb;
  }

  .send svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: #667272;
    stroke-width: 2.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .hi-copy {
    flex: 0 0 auto;
    padding: 22px 12px 6px;
  }

  .hi-copy h2 {
    margin-bottom: 14px;
    color: #ffffff;
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 11vw, 3.5rem);
    font-weight: 600;
    letter-spacing: -0.05em;
    line-height: 0.99;
    text-wrap: balance;
  }

  .hi-copy p {
    max-width: 38ch;
    color: #d0e7df;
    font-size: 1rem;
    line-height: 1.62;
  }

  /* ---------------------------
     Scene 2: ask in plain language
  --------------------------- */

  .scene-chat {
    color: #17231f;
  }

  .chat-card {
    flex: 1 1 auto;
    overflow: hidden;

    min-height: 300px;
    padding: 22px 16px;

    border-radius: 40px 14px 40px 40px;
    background: #eef2f3;
    box-shadow: 0 14px 36px rgba(24, 68, 57, 0.12);
  }

  .chat-stream {
    display: flex;
    flex-direction: column;
  }

  /*
    Hidden bubbles have no vertical padding, so they take no room.
    When a bubble comes in, its padding opens up and its height then keeps
    changing as the text wraps onto new lines.
  */
  .bubble {
    width: fit-content;
    max-width: 88%;
    padding: 0 18px;
    overflow: hidden;

    opacity: 0;
    transition:
      opacity 380ms cubic-bezier(0.2, 0, 0, 1),
      transform 780ms cubic-bezier(0.34, 1.35, 0.64, 1),
      padding 420ms cubic-bezier(0.34, 1.3, 0.64, 1);
  }

  .bubble.in {
    padding: 14px 18px;
    opacity: 1;
    transform: none;
  }

  .bubble p {
    font-size: 15.5px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .bubble-user {
    align-self: flex-end;
    border-radius: 24px 24px 8px 24px;
    background: #0b796b;
    color: #ffffff;
    transform: translateX(80%);
  }

  .bubble-reply {
    align-self: flex-start;
    margin-top: 12px;
    border-radius: 24px 24px 24px 8px;
    background: #ffffff;
    color: #17231f;
    box-shadow: 0 0 0 1px #e1e6e7;
    transform: translateX(-80%);
  }

  .feature-card {
    flex: 0 0 auto;
    padding: 26px 24px 28px;
    border-radius: 36px 36px 14px 36px;
    background: #ffddbd;
    color: #2c1600;
  }

  .feature-card h2 {
    margin-bottom: 10px;
    font-family: var(--font-display);
    font-size: clamp(1.7rem, 8vw, 2.3rem);
    font-weight: 600;
    letter-spacing: -0.045em;
    line-height: 1.03;
    text-wrap: balance;
  }

  .feature-card p {
    color: #5e4630;
    font-size: 15px;
    line-height: 1.6;
  }

  /* ---------------------------
     Scene 3: more features
  --------------------------- */

  .scene-more {
    gap: 12px;
  }

  .more-card {
    flex: 1 1 0;

    display: flex;
    flex-direction: column;
    justify-content: center;

    min-height: 150px;
    padding: 24px 24px 26px;
  }

  .more-card h2 {
    margin-bottom: 10px;
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 8.4vw, 2.5rem);
    font-weight: 600;
    letter-spacing: -0.048em;
    line-height: 1.02;
    text-wrap: balance;
  }

  .more-card p {
    max-width: 36ch;
    font-size: 15px;
    line-height: 1.6;
  }

  .more-tone-0 {
    border-radius: 44px 44px 44px 12px;
    background: #cdeadf;
    color: #0f3b33;
  }

  .more-tone-0 p {
    color: #2c5c52;
  }

  .more-tone-1 {
    border-radius: 12px 44px 44px 44px;
    background: #ffdcb8;
    color: #2c1600;
  }

  .more-tone-1 p {
    color: #5e4630;
  }

  .more-tone-2 {
    border-radius: 44px 12px 44px 44px;
    background: #dfe4f8;
    color: #1c2250;
  }

  .more-tone-2 p {
    color: #434a7a;
  }

  /* ---------------------------
     Scene 4: download + credit
  --------------------------- */

  .download-card {
    position: relative;
    flex: 1.4 1 auto;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    min-height: 300px;
    padding: 30px 24px 28px;

    border-radius: 44px 44px 44px 14px;
    background: #0e6257;
    color: #f5fbf8;
  }

  .download-body {
    position: relative;
  }

  .download-card h2 {
    max-width: 11ch;
    margin-bottom: 12px;
    color: #ffffff;
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 10.5vw, 3.2rem);
    font-weight: 600;
    letter-spacing: -0.05em;
    line-height: 1;
    text-wrap: balance;
  }

  .download-card p {
    max-width: 36ch;
    color: #d6eae3;
    font-size: 15px;
    line-height: 1.6;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 22px;
  }

  .download-button,
  .clinician-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    min-height: 48px;
    padding: 10px 20px;

    border: 1px solid transparent;
    border-radius: 999px;

    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;

    transition:
      transform 180ms ease,
      background-color 180ms ease,
      box-shadow 180ms ease;
  }

  .download-button {
    border-color: #ffffff;
    background: #ffffff;
    color: #145c50;
  }

  .clinician-button {
    border-color: rgba(255, 255, 255, 0.26);
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
  }

  .download-button .material-symbols-rounded,
  .clinician-button .material-symbols-rounded {
    font-size: 19px;
  }

  .download-button:hover,
  .clinician-button:hover {
    transform: translateY(-2px);
  }

  .download-button:active,
  .clinician-button:active {
    transform: scale(0.97);
  }

  .download-button:focus-visible,
  .clinician-button:focus-visible,
  .brand:focus-visible,
  .scroll-hint:focus-visible {
    outline: 3px solid #0e8171;
    outline-offset: 3px;
  }

  .credit-card {
    flex: 0 0 auto;
    padding: 26px 24px 28px;
    border-radius: 14px 40px 40px 40px;
    background: #ffffff;
    color: #17231f;
    box-shadow: 0 10px 28px rgba(24, 68, 57, 0.08);
  }

  .credit-card h2 {
    margin-bottom: 8px;
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 7vw, 2rem);
    font-weight: 600;
    letter-spacing: -0.04em;
    line-height: 1.05;
    text-wrap: balance;
  }

  .credit-card p {
    max-width: 38ch;
    color: #52645e;
    font-size: 15px;
    line-height: 1.6;
  }

  /* ---------------------------
     Small and short screens
  --------------------------- */

  @media (max-width: 380px) {
    .scene {
      gap: 12px;
      padding-inline: 14px;
    }

    .app-card {
      gap: 18px;
      padding: 24px 16px;
    }

    .more-card,
    .feature-card,
    .credit-card,
    .download-card {
      padding-inline: 20px;
    }

    .actions {
      flex-direction: column;
      align-items: stretch;
    }

    .download-button,
    .clinician-button {
      width: 100%;
    }
  }

  @media (max-width: 900px) and (max-height: 480px) and (orientation: landscape) {
    .scene {
      padding-bottom: calc(env(safe-area-inset-bottom) + 76px);
    }

    .scene-hero h1 {
      max-width: 16ch;
      font-size: clamp(2.2rem, 6vw, 3rem);
    }

    .app-card,
    .chat-card,
    .download-card {
      min-height: 240px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .backdrop,
    .shapes-layer,
    .reveal,
    .bubble,
    .download-button,
    .clinician-button {
      transition: none;
    }

    .reveal,
    .reveal-pop {
      opacity: 1;
      transform: none;
    }

    .bubble {
      opacity: 1;
      padding: 14px 18px;
      transform: none;
    }

    .caret,
    .scroll-hint .material-symbols-rounded {
      animation: none;
    }
  }
</style>