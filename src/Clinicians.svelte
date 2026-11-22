
<svelte:head>
  <title>Clinician Platform | patnub.ai</title>
  <meta
    name="description"
    content="The patnub.ai clinician workspace for preparing and issuing patient records."
  />
  <meta name="color-scheme" content="light" />
</svelte:head>

<div class="clinicians-page">
  <div class="ambient one" aria-hidden="true"></div>
  <div class="ambient two" aria-hidden="true"></div>

  <header>
    <a class="brand" href="/" aria-label="patnub.ai home">
      patnub<span>.ai</span>
    </a>

    <a class="back-link" href="/" aria-label="Back to the patient app">
      <span class="back-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </span>
      <span>Patient app</span>
    </a>
  </header>

  <main>
    <section class="hero" aria-labelledby="page-title">
      <h1 id="page-title">
        A clearer handoff from <span>clinic to patient.</span>
      </h1>

      <p class="intro">
        Prepare clinician-approved records and issue them to patients
        through a secure QR handoff.
      </p>

      <div class="status">
        <span class="material-symbols-rounded" aria-hidden="true">
          construction
        </span>
        The clinician platform is in development.
      </div>
    </section>
  </main>
</div>

<style>
  .clinicians-page {
    --font-display: 'Fredoka', 'Roboto', sans-serif;
    --font-body: 'Roboto', system-ui, sans-serif;
    --primary: #0e8f7e;
    --primary-strong: #0b796b;
    --surface: #f5faf8;
    --ink: #17231f;
    --muted: #52645e;
    --outline: #d1ddd7;

    position: relative;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);

    width: 100%;
    height: 100vh;
    height: 100svh;
    height: 100dvh;

    min-height: 0;
    overflow: hidden;
    isolation: isolate;

    background: var(--surface);
    color: var(--ink);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .clinicians-page *,
  .clinicians-page *::before,
  .clinicians-page *::after {
    box-sizing: border-box;
  }

  .clinicians-page .material-symbols-rounded {
    display: inline-block;
    font-family: 'Material Symbols Rounded';
    font-size: 22px;
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    white-space: nowrap;
    font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
  }

  /* Background elements */

  .ambient {
    position: absolute;
    z-index: -1;
    pointer-events: none;
    filter: blur(1px);
  }

  .ambient.one {
    top: 12%;
    right: -95px;
    width: 310px;
    aspect-ratio: 1;
    border-radius: 36% 64% 58% 42% / 42% 38% 62% 58%;
    background: #d9eee7;
    transform: rotate(-17deg);
  }

  .ambient.two {
    bottom: -150px;
    left: -95px;
    width: 360px;
    aspect-ratio: 1;
    border-radius: 42% 58% 35% 65% / 61% 42% 58% 39%;
    background: #e7e0f4;
    transform: rotate(21deg);
  }

  /* Header */

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: min(1160px, calc(100% - 48px));
    margin-inline: auto;
    padding-block: clamp(10px, 1.8vh, 18px);
  }

  .brand {
    color: var(--ink);
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.045em;
    text-decoration: none;
  }

  .brand span {
    color: var(--primary);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 10px;

    min-height: 44px;
    padding: 5px 17px 5px 7px;
    border: 1px solid #c4e0da;
    border-radius: 999px;

    color: #246b65;
    background: #e4f1ee;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    text-decoration: none;

    box-shadow: 0 1px 0 rgba(26, 85, 73, 0.06);
    transition:
      background 180ms ease,
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .back-icon {
    display: grid;
    flex: none;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: #fff;
    background: var(--primary);
    transition: transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .back-icon svg {
    display: block;
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .back-link:hover {
    border-color: #a7d1c8;
    color: #185c55;
    background: #d7ebe6;
    box-shadow: 0 3px 12px rgba(22, 97, 82, 0.10);
    transform: translateX(-2px);
  }

  .back-link:hover .back-icon {
    transform: translateX(-2px);
  }

  .back-link:active {
    transform: translateX(-1px) scale(0.98);
  }

  .back-link:focus-visible {
    outline: 3px solid rgba(14, 143, 126, 0.3);
    outline-offset: 3px;
  }

  /* Main content */

  main {
    display: grid;
    min-height: 0;
    place-items: center;

    padding-inline: clamp(20px, 4vw, 48px);
  }

  .hero {
    width: min(760px, 100%);
    text-align: center;
  }

  h1 {
    max-width: 16ch;
    margin: 0 auto 18px;

    font-family: var(--font-display);
    font-size: clamp(2.55rem, min(7.5vw, 10vh), 6.3rem);
    font-weight: 600;
    letter-spacing: -0.055em;
    line-height: 0.98;

    text-wrap: balance;
  }

  h1 span {
    color: var(--primary);
  }

  .intro {
    max-width: 54ch;
    margin: 0 auto;

    color: var(--muted);
    font-size: clamp(0.95rem, 1.6vw, 1.1rem);
    line-height: 1.55;

    text-wrap: pretty;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 9px;

    margin-top: clamp(18px, 3vh, 26px);
    padding: 11px 16px;

    border: 1px solid var(--outline);
    border-radius: 18px;

    background: rgba(255, 255, 255, 0.78);
    color: var(--muted);

    font-size: 13px;
    font-weight: 600;

    box-shadow: 0 10px 28px rgba(27, 58, 49, 0.05);
  }

  .status .material-symbols-rounded {
    color: var(--primary);
    font-size: 19px;
  }

  /* Responsive */

  @media (max-width: 600px) {
    header {
      width: calc(100% - 36px);
    }

    .brand {
      font-size: 23px;
    }

    .back-link {
      min-height: 38px;
      gap: 7px;
      padding: 4px 11px 4px 5px;
      font-size: 12px;
    }

    .back-icon {
      width: 28px;
      height: 28px;
    }

    .back-icon svg {
      width: 16px;
      height: 16px;
    }

    .hero {
      width: 100%;
    }

    h1 {
      max-width: 13ch;
      font-size: clamp(2.5rem, 11vw, 3.8rem);
    }

    .intro {
      font-size: 15px;
    }

    .status {
      max-width: 100%;
      padding: 11px 13px;
      font-size: 12px;
    }
  }

  /* Short viewports */

  @media (max-height: 700px) {
    header {
      padding-block: 10px;
    }

    h1 {
      margin-bottom: 14px;
    }

    .status {
      margin-top: 18px;
    }
  }

  @media (max-height: 520px) {
    h1 {
      font-size: clamp(1.9rem, 6vh, 3.1rem);
      margin-bottom: 10px;
    }

    .intro {
      font-size: 13px;
      line-height: 1.4;
    }

    .status {
      margin-top: 12px;
      padding: 9px 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .clinicians-page *,
    .clinicians-page *::before,
    .clinicians-page *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
