<script>
  let { features = [] } = $props();

  const featureIcons = ['forum', 'description', 'qr_code_2', 'medication'];
</script>

<div class="mobile-experience" id="story">
  <section class="mobile-hero" aria-labelledby="mobile-hero-title">
    <header class="mobile-brand-row">
      <a class="mobile-brand" href="#top" aria-label="patnub.ai home">
        <img src="/screens/nurse-mark.svg" alt="" width="34" height="34" />
        <span>patnub.ai</span>
      </a>
      <span class="mobile-brand-note">Care that stays with you.</span>
    </header>

    <div class="mobile-hero-copy">
      <p class="mobile-eyebrow">YOUR HEALTH, MADE CLEARER</p>
      <h1 id="mobile-hero-title">Want to understand your health better?</h1>
      <h2>Say hi to patnub.ai!</h2>
      <p class="mobile-intro">
        Explore health topics, understand medicines, and keep important
        health information close. Use it online or offline.
      </p>

      <div class="mobile-actions">
        <a class="mobile-download-button" href="/downloads/patnub-ai.apk" download="patnub-ai.apk">
          <span class="material-symbols-rounded" aria-hidden="true">download</span>
          Download
        </a>
        <a class="mobile-clinician-button" href="/clinicians">
          <span class="material-symbols-rounded" aria-hidden="true">stethoscope</span>
          Clinician Platform
        </a>
      </div>
    </div>

    <div class="mobile-hero-shape mobile-hero-shape-one" aria-hidden="true"></div>
    <div class="mobile-hero-shape mobile-hero-shape-two" aria-hidden="true"></div>

    <a class="mobile-explore-link" href="#mobile-features">
      Explore features
      <span class="material-symbols-rounded" aria-hidden="true">south</span>
    </a>
  </section>

  <section class="mobile-feature-section" id="mobile-features" aria-labelledby="mobile-features-title">
    <header class="mobile-section-heading">
      <p class="mobile-eyebrow">A LITTLE MORE CLARITY</p>
      <h2 id="mobile-features-title">Useful care information, right when you need it.</h2>
    </header>

    <div class="mobile-feature-list">
      {#each features as feature, i}
        <article class={`mobile-feature-card tone-${i + 1}`}>
          <span class="mobile-feature-index">0{i + 1}</span>
          <div class="mobile-feature-copy">
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </div>
          <span class="mobile-feature-arrow material-symbols-rounded" aria-hidden="true">
            {featureIcons[i]}
          </span>
        </article>
      {/each}
    </div>
  </section>

  <section class="mobile-bottom-cta" aria-labelledby="mobile-bottom-title">
    <p class="mobile-eyebrow">KEEP CARE CLOSE</p>
    <h2 id="mobile-bottom-title">Take patnub.ai with you.</h2>
    <p>Get the Android app and keep important care information within reach, wherever you go.</p>
    <div class="mobile-actions">
      <a class="mobile-download-button" href="/downloads/patnub-ai.apk" download="patnub-ai.apk">
        <span class="material-symbols-rounded" aria-hidden="true">download</span>
        Download
      </a>
      <a class="mobile-clinician-button" href="/clinicians">
        <span class="material-symbols-rounded" aria-hidden="true">stethoscope</span>
        Clinician Platform
      </a>
    </div>
  </section>
</div>

<style>
  .mobile-experience {
    --mobile-ink: #19332d;
    min-height: 100svh;
    padding-bottom: max(112px, calc(env(safe-area-inset-bottom) + 104px));
    overflow: hidden;
    background: #ffffff;
    color: var(--mobile-ink);
  }

  .mobile-hero {
    position: relative;
    isolation: isolate;
    min-height: min(780px, 100svh);
    padding:
      max(20px, env(safe-area-inset-top))
      max(22px, env(safe-area-inset-right))
      72px
      max(22px, env(safe-area-inset-left));
    overflow: hidden;
    background: #f6e1ca;
  }

  .mobile-brand-row,
  .mobile-brand {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
  }

  .mobile-brand-row {
    justify-content: space-between;
    gap: 12px;
  }

  .mobile-brand {
    gap: 9px;
    color: #1b5148;
    font-family: var(--font-display);
    font-size: 21px;
    font-weight: 600;
    letter-spacing: -0.04em;
    text-decoration: none;
  }

  .mobile-brand img {
    display: block;
    width: 34px;
    height: 34px;
    object-fit: contain;
  }

  .mobile-brand-note {
    color: #68513c;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-align: right;
  }

  .mobile-hero-copy {
    position: relative;
    z-index: 2;
    width: min(100%, 540px);
    margin: clamp(74px, 13svh, 126px) auto 0;
  }

  .mobile-eyebrow {
    margin: 0 0 14px;
    color: #6d593f;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
  }

  .mobile-hero h1 {
    max-width: 13ch;
    margin: 0;
    color: #253c34;
    font-family: var(--font-display);
    font-size: clamp(2.65rem, 12.5vw, 4.7rem);
    font-weight: 600;
    letter-spacing: -0.055em;
    line-height: 0.98;
    text-wrap: balance;
  }

  .mobile-hero h2 {
    margin: 25px 0 8px;
    color: #16685b;
    font-family: var(--font-display);
    font-size: clamp(1.55rem, 7vw, 2.1rem);
    font-weight: 600;
    letter-spacing: -0.045em;
    line-height: 1.05;
  }

  .mobile-intro {
    max-width: 39ch;
    margin: 0;
    color: #5d665d;
    font-size: 14px;
    line-height: 1.65;
  }

  .mobile-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 24px;
  }

  .mobile-download-button,
  .mobile-clinician-button {
    display: inline-flex;
    min-height: 46px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 17px;
    border: 1px solid transparent;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
  }

  .mobile-download-button {
    background: #0e6257;
    color: #ffffff;
    box-shadow: 0 8px 22px rgba(14, 98, 87, 0.15);
  }

  .mobile-clinician-button {
    border-color: rgba(82, 105, 99, 0.12);
    background: #dcebe4;
    color: #214b40;
  }

  .mobile-download-button .material-symbols-rounded,
  .mobile-clinician-button .material-symbols-rounded {
    font-size: 18px;
  }

  .mobile-download-button:hover,
  .mobile-clinician-button:hover {
    transform: translateY(-2px);
  }

  .mobile-download-button:focus-visible,
  .mobile-clinician-button:focus-visible,
  .mobile-brand:focus-visible,
  .mobile-explore-link:focus-visible {
    outline: 3px solid #0e8171;
    outline-offset: 3px;
  }

  .mobile-hero-shape {
    position: absolute;
    z-index: 0;
    pointer-events: none;
  }

  .mobile-hero-shape-one {
    top: 20%;
    right: -150px;
    width: 270px;
    aspect-ratio: 1;
    border-radius: 43% 57% 55% 45% / 48% 42% 58% 52%;
    background: #edc49e;
    transform: rotate(-18deg);
  }

  .mobile-hero-shape-two {
    right: -23px;
    bottom: 6%;
    width: 72px;
    height: 150px;
    border-radius: 999px;
    background: #d2e9df;
    transform: rotate(37deg);
  }

  .mobile-explore-link {
    position: absolute;
    z-index: 2;
    right: max(24px, env(safe-area-inset-right));
    bottom: 25px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #596e63;
    font-size: 11px;
    font-weight: 700;
    text-decoration: none;
  }

  .mobile-explore-link .material-symbols-rounded {
    font-size: 17px;
  }

  .mobile-feature-section {
    width: min(100% - 44px, 680px);
    margin: 0 auto;
    padding: 76px 0 82px;
    scroll-margin-top: 20px;
  }

  .mobile-section-heading {
    max-width: 480px;
    margin-bottom: 27px;
  }

  .mobile-section-heading .mobile-eyebrow,
  .mobile-bottom-cta .mobile-eyebrow {
    color: #148171;
  }

  .mobile-section-heading h2,
  .mobile-bottom-cta h2 {
    margin: 0;
    color: #213c34;
    font-family: var(--font-display);
    font-size: clamp(2rem, 8.5vw, 3.1rem);
    font-weight: 600;
    letter-spacing: -0.05em;
    line-height: 1;
    text-wrap: balance;
  }

  .mobile-feature-list {
    display: grid;
    gap: 13px;
  }

  .mobile-feature-card {
    position: relative;
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr) 36px;
    align-items: start;
    gap: 12px;
    min-width: 0;
    padding: 21px 18px 22px;
    border: 1px solid rgba(46, 77, 66, 0.09);
    border-radius: 22px 22px 22px 9px;
  }

  .mobile-feature-card.tone-1 { background: #edf6f1; }
  .mobile-feature-card.tone-2 { background: #f3f0e9; }
  .mobile-feature-card.tone-3 { background: #eaf3f5; }
  .mobile-feature-card.tone-4 { background: #f8eee2; }

  .mobile-feature-index {
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.72);
    color: #176d60;
    font-size: 11px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }

  .mobile-feature-copy {
    min-width: 0;
  }

  .mobile-feature-copy h3 {
    margin: 0 0 7px;
    color: #203c33;
    font-family: var(--font-display);
    font-size: clamp(1.12rem, 4.7vw, 1.38rem);
    font-weight: 600;
    letter-spacing: -0.035em;
    line-height: 1.1;
  }

  .mobile-feature-copy p {
    margin: 0;
    color: #53685f;
    font-size: 12px;
    line-height: 1.55;
  }

  .mobile-feature-arrow {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.65);
    color: #176d60;
    font-size: 19px;
  }

  .mobile-bottom-cta {
    width: min(100% - 44px, 680px);
    margin: 0 auto;
    padding: 28px 23px 30px;
    border-radius: 26px 26px 26px 9px;
    background: #0e6257;
    color: #f5fbf8;
  }

  .mobile-bottom-cta .mobile-eyebrow {
    color: #b9e3d7;
  }

  .mobile-bottom-cta h2 {
    max-width: 13ch;
    color: #ffffff;
    font-size: clamp(1.85rem, 7.8vw, 2.7rem);
  }

  .mobile-bottom-cta > p:not(.mobile-eyebrow) {
    max-width: 40ch;
    margin: 12px 0 0;
    color: #d6eae3;
    font-size: 13px;
    line-height: 1.6;
  }

  .mobile-bottom-cta .mobile-download-button {
    border-color: #ffffff;
    background: #ffffff;
    color: #145c50;
    box-shadow: none;
  }

  .mobile-bottom-cta .mobile-clinician-button {
    border-color: rgba(255, 255, 255, 0.24);
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
  }

  @media (max-width: 380px) {
    .mobile-hero {
      padding-inline: 19px;
    }

    .mobile-brand-note {
      max-width: 104px;
      font-size: 9px;
    }

    .mobile-hero-copy {
      margin-top: 78px;
    }

    .mobile-hero h1 {
      font-size: clamp(2.45rem, 12vw, 3rem);
    }

    .mobile-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .mobile-actions .mobile-download-button,
    .mobile-actions .mobile-clinician-button {
      width: 100%;
    }

    .mobile-feature-section,
    .mobile-bottom-cta {
      width: calc(100% - 36px);
    }

    .mobile-feature-card {
      grid-template-columns: 30px minmax(0, 1fr) 30px;
      gap: 9px;
      padding-inline: 13px;
    }
  }

  @media (max-width: 900px) and (max-height: 480px) and (orientation: landscape) {
    .mobile-hero {
      min-height: auto;
      padding-bottom: 58px;
    }

    .mobile-hero-copy {
      margin-top: 38px;
    }

    .mobile-hero h1 {
      max-width: 16ch;
      font-size: clamp(2.2rem, 6vw, 3rem);
    }

    .mobile-hero h2 {
      margin-top: 14px;
    }

    .mobile-explore-link {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mobile-download-button,
    .mobile-clinician-button {
      transition: none;
    }
  }
</style>
