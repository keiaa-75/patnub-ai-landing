
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

    <a class="back-link" href="/">
      <span class="material-symbols-rounded" aria-hidden="true">
        arrow_back
      </span>
      Patient app
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
    gap: 8px;

    color: var(--muted);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;

    transition:
      color 160ms ease,
      transform 160ms ease;
  }

  .back-link:hover {
    color: var(--primary-strong);
    transform: translateX(-2px);
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
      gap: 5px;
      font-size: 12px;
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
