
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
      <div class="eyebrow">
        <span class="material-symbols-rounded" aria-hidden="true">
          stethoscope
        </span>
        Clinician workspace
      </div>

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

  <footer>patnub.ai · Care that stays with you.</footer>
</div>

<style>
  .clinicians-page {
    --font-display: 'Fredoka', 'Roboto', sans-serif;
    --font-body: 'Roboto', system-ui, sans-serif;
    --primary: #0e8f7e;
    --primary-strong: #0b796b;
    --primary-container: #c9eee5;
    --on-primary-container: #073d35;
    --surface: #f5faf8;
    --ink: #17231f;
    --muted: #52645e;
    --outline: #d1ddd7;

    position: relative;
    display: flex;
    min-height: 100vh;
    min-height: 100svh;
    flex-direction: column;
    isolation: isolate;
    overflow: hidden;
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

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: min(1160px, calc(100% - 56px));
    margin: 0 auto;
    padding: 28px 0;
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
    transition: color 160ms ease, transform 160ms ease;
  }

  .back-link:hover {
    color: var(--primary-strong);
    transform: translateX(-2px);
  }

  main {
    display: grid;
    flex: 1;
    place-items: center;
    padding: 54px 28px 104px;
  }

  .hero {
    width: min(760px, 100%);
    text-align: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 15px;
    border: 1px solid rgba(14, 143, 126, 0.12);
    border-radius: 999px;
    background: var(--primary-container);
    color: var(--on-primary-container);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .eyebrow .material-symbols-rounded {
    font-size: 17px;
  }

  h1 {
    max-width: 15ch;
    margin: 28px auto 18px;
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 6.3rem);
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
    font-size: clamp(1rem, 2vw, 1.13rem);
    line-height: 1.7;
    text-wrap: pretty;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    margin-top: 34px;
    padding: 13px 18px;
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

  footer {
    padding: 0 24px 28px;
    color: #71817b;
    font-size: 12px;
    text-align: center;
  }

  @media (max-width: 600px) {
    header {
      width: calc(100% - 36px);
      padding: 20px 0;
    }

    .brand {
      font-size: 23px;
    }

    .back-link {
      font-size: 12px;
    }

    main {
      padding: 45px 20px 76px;
    }

    h1 {
      margin-top: 24px;
    }

    .intro {
      font-size: 15px;
    }

    .status {
      margin-top: 28px;
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
