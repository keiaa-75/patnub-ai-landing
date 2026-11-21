<script>
  import Hero from './lib/Hero.svelte';

  const capabilities = [
    {
      icon: 'chat',
      title: 'Ask in plain language',
      body: 'Get clear explanations about symptoms, medicines, and the instructions in your own record.'
    },
    {
      icon: 'folder_open',
      title: "Keep your doctor's note",
      body: 'Save a clinician-approved record on your device, ready when you need to check it.'
    },
    {
      icon: 'qr_code_scanner',
      title: 'Save with a scan',
      body: 'Use a signed QR code to add your clinician’s instructions to your personal records.'
    },
    {
      icon: 'wifi_off',
      title: 'Works without signal',
      body: 'Your saved information remains available even when the connection drops.'
    }
  ];

  const steps = [
    { number: '01', title: 'Your clinician prepares a note', body: 'A clinician creates and approves the instructions you need to keep.' },
    { number: '02', title: 'Scan to save it', body: 'Scan the provided QR code to add the approved note to your device.' },
    { number: '03', title: 'Understand it anywhere', body: 'Review your saved information or ask the assistant to explain it in plain language.' }
  ];
</script>

<svelte:head>
  <meta name="color-scheme" content="light" />
</svelte:head>

<header class="topnav">
  <a class="brand" href="#top" aria-label="patnub.ai home">
    <span class="brand-mark" aria-hidden="true"><span class="material-symbols-rounded">health_and_safety</span></span>
    <span class="brand-word">patnub<span>.ai</span></span>
  </a>

  <nav class="nav-links" aria-label="Main navigation">
    <a href="#features">Features</a>
    <a href="#how-it-works">How it works</a>
    <a class="nav-cta" href="#get">Explore patnub.ai <span aria-hidden="true">↗</span></a>
  </nav>
</header>

<main id="top">
  <Hero />

  <section class="features-section section-pad" id="features" aria-labelledby="features-title">
    <div class="section-heading">
      <p class="eyebrow">MADE FOR EVERYDAY CARE</p>
      <h2 id="features-title">The information you need,<br class="desktop-break" /> close when you need it.</h2>
      <p class="section-lede">patnub.ai helps you keep, understand, and revisit your doctor's instructions—even when you're away from the clinic.</p>
    </div>

    <div class="capability-grid">
      {#each capabilities as item, i}
        <article class="capability-card" class:featured={i === 0}>
          <div class="icon-wrap"><span class="material-symbols-rounded" aria-hidden="true">{item.icon}</span></div>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
          <span class="card-index">0{i + 1}</span>
        </article>
      {/each}
    </div>
  </section>

  <section class="how-section section-pad" id="how-it-works" aria-labelledby="how-title">
    <div class="how-intro">
      <p class="eyebrow">SIMPLE BY DESIGN</p>
      <h2 id="how-title">From clinic to your pocket.</h2>
      <p class="section-lede">A straightforward way to take your clinician's instructions home and keep them within reach.</p>
    </div>

    <div class="steps-grid">
      {#each steps as item, i}
        <article class="step-card">
          <div class="step-number">{item.number}</div>
          <div class="step-copy">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
          {#if i < steps.length - 1}
            <span class="step-arrow material-symbols-rounded" aria-hidden="true">arrow_forward</span>
          {/if}
        </article>
      {/each}
    </div>
  </section>

  <section class="closing-section" id="get">
    <div class="closing-decoration decoration-one" aria-hidden="true"></div>
    <div class="closing-decoration decoration-two" aria-hidden="true"></div>
    <div class="closing-content">
      <span class="closing-icon material-symbols-rounded" aria-hidden="true">favorite</span>
      <p class="eyebrow">CARE THAT GOES WHERE YOU GO</p>
      <h2>Keep your care<br />close at hand.</h2>
      <p>A clinician writes the note. Your phone keeps it. patnub.ai helps explain it in plain language, even offline.</p>
      <a class="closing-cta" href="#story">Explore the experience <span aria-hidden="true">↗</span></a>
    </div>
  </section>
</main>

<footer class="site-footer">
  <a class="footer-brand" href="#top">patnub.ai</a>
  <p>patnub.ai is an information tool. It is <strong>not a diagnostic device</strong>, a replacement for your clinician, or an emergency service. Medical content is still under clinical review.</p>
  <span class="copyright">© 2026 patnub.ai</span>
</footer>

<style>
  .topnav {
    position: fixed;
    inset: 0 0 auto;
    z-index: 50;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 clamp(22px, 6vw, 88px);
    background: rgba(245, 250, 248, 0.88);
    border-bottom: 1px solid rgba(209, 221, 215, 0.68);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .brand, .footer-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--md-on-surface);
    text-decoration: none;
  }

  .brand-mark {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    color: var(--md-on-primary);
    background: var(--md-primary);
  }
  .brand-mark :global(.material-symbols-rounded) { font-size: 21px; }
  .brand-word, .footer-brand {
    font-family: var(--font-display);
    font-size: 25px;
    font-weight: 600;
    letter-spacing: -0.04em;
  }
  .brand-word span { color: var(--md-primary); }

  .nav-links { display: flex; align-items: center; gap: clamp(18px, 3vw, 38px); }
  .nav-links a {
    color: var(--md-on-surface-variant);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: color 180ms ease, transform 180ms ease, background 180ms ease;
  }
  .nav-links a:hover { color: var(--md-primary); }
  .nav-links .nav-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 19px;
    border-radius: var(--shape-full);
    color: var(--md-on-primary);
    background: var(--md-primary-strong);
    box-shadow: 0 3px 10px rgba(14, 143, 126, 0.16);
  }
  .nav-links .nav-cta:hover { color: #fff; transform: translateY(-2px); background: #0b796b; }

  .section-pad { padding: clamp(82px, 10vw, 144px) clamp(22px, 8vw, 120px); }
  .features-section { background: #fff; }
  .section-heading, .how-intro { max-width: 720px; margin: 0 auto 48px; text-align: center; }
  .eyebrow {
    margin: 0 0 15px;
    color: var(--md-primary);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
  }
  .section-heading h2, .how-intro h2 {
    margin: 0;
    color: var(--md-on-surface);
    font-family: var(--font-display);
    font-size: clamp(2.1rem, 4.5vw, 3.8rem);
    font-weight: 500;
    line-height: 1.08;
    letter-spacing: -0.035em;
  }
  .section-lede {
    max-width: 58ch;
    margin: 17px auto 0;
    color: var(--md-on-surface-variant);
    font-size: 16px;
    line-height: 1.7;
  }

  .capability-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
    max-width: 1240px;
    margin: 0 auto;
  }
  .capability-card {
    position: relative;
    min-height: 270px;
    padding: 27px 24px 32px;
    overflow: hidden;
    border: 1px solid var(--md-outline-variant);
    border-radius: 22px;
    background: var(--md-surface-container-low);
    transition: transform 260ms cubic-bezier(.2,.8,.2,1), box-shadow 260ms ease, border-color 260ms ease;
  }
  .capability-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-card); border-color: #a9cfc4; }
  .capability-card.featured { background: var(--md-primary-container); border-color: transparent; }
  .icon-wrap {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    color: var(--md-primary);
    background: #fff;
  }
  .featured .icon-wrap { color: var(--md-on-primary-container); background: rgba(255,255,255,.68); }
  .icon-wrap :global(.material-symbols-rounded) { font-size: 25px; }
  .capability-card h3 {
    margin: 24px 0 10px;
    color: var(--md-on-surface);
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 500;
    line-height: 1.12;
  }
  .capability-card p { margin: 0; max-width: 32ch; color: var(--md-on-surface-variant); font-size: 14px; line-height: 1.65; }
  .card-index { position: absolute; right: 22px; bottom: 17px; color: rgba(23, 35, 31, 0.28); font-size: 10px; font-weight: 700; letter-spacing: .12em; }

  .how-section { background: var(--md-background); }
  .how-intro { margin-bottom: 54px; }
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    max-width: 1120px;
    margin: 0 auto;
  }
  .step-card {
    position: relative;
    display: flex;
    gap: 18px;
    min-height: 170px;
    padding: 26px 24px;
    border: 1px solid var(--md-outline-variant);
    border-radius: 22px;
    background: #fff;
  }
  .step-number {
    flex: 0 0 42px;
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    color: var(--md-on-primary-container);
    background: var(--md-primary-container);
    font-size: 12px;
    font-weight: 700;
  }
  .step-copy h3 { margin: 2px 0 9px; color: var(--md-on-surface); font-family: var(--font-display); font-size: 21px; font-weight: 500; line-height: 1.15; }
  .step-copy p { margin: 0; color: var(--md-on-surface-variant); font-size: 14px; line-height: 1.6; }
  .step-arrow { position: absolute; top: 50%; right: -23px; z-index: 2; transform: translateY(-50%); color: var(--md-primary); font-size: 24px; }

  .closing-section {
    position: relative;
    min-height: 590px;
    display: grid;
    place-items: center;
    overflow: hidden;
    padding: 100px 24px;
    color: #fff;
    background: #0e6257;
  }
  .closing-content { position: relative; z-index: 2; max-width: 650px; text-align: center; }
  .closing-icon {
    width: 54px;
    height: 54px;
    display: grid;
    place-items: center;
    margin: 0 auto 23px;
    border-radius: 18px;
    color: #0e6257;
    background: #c9eee5;
    font-size: 27px;
  }
  .closing-content .eyebrow { color: #bce8dc; }
  .closing-content h2 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(3rem, 7vw, 5.7rem);
    font-weight: 500;
    line-height: .98;
    letter-spacing: -.045em;
  }
  .closing-content > p:not(.eyebrow) { max-width: 50ch; margin: 22px auto 30px; color: #d9eee8; font-size: 16px; line-height: 1.7; }
  .closing-cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 15px 23px;
    border-radius: var(--shape-full);
    color: var(--md-on-primary-container);
    background: #d5f2e9;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease;
  }
  .closing-cta:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 9px 24px rgba(0,0,0,.16); }
  .closing-decoration { position: absolute; border-radius: 50%; pointer-events: none; }
  .decoration-one { width: 300px; height: 300px; top: -130px; right: 8%; background: rgba(180, 231, 216, .12); }
  .decoration-two { width: 180px; height: 180px; bottom: -75px; left: 9%; background: rgba(255, 221, 189, .14); }

  .site-footer {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 30px;
    padding: 28px clamp(22px, 6vw, 88px);
    color: var(--md-on-surface-variant);
    background: #edf4f1;
  }
  .footer-brand { color: var(--md-primary); font-size: 21px; }
  .site-footer p { max-width: 88ch; margin: 0; font-size: 11px; line-height: 1.6; }
  .site-footer strong { color: var(--md-on-surface); }
  .copyright { white-space: nowrap; font-size: 11px; }

  @media (max-width: 1000px) {
    .capability-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .steps-grid { grid-template-columns: 1fr; max-width: 700px; }
    .step-card { min-height: auto; }
    .step-arrow { top: auto; right: 26px; bottom: -22px; transform: rotate(90deg); }
    .step-card:last-child .step-arrow { display: none; }
    .site-footer { grid-template-columns: 1fr auto; }
    .site-footer p { grid-column: 1 / -1; grid-row: 2; }
  }

  @media (max-width: 767px) {
    .topnav { height: 68px; padding: 0 18px; }
    .brand-mark { width: 32px; height: 32px; border-radius: 11px; }
    .brand-word { font-size: 22px; }
    .nav-links { gap: 13px; }
    .nav-links a { font-size: 12px; }
    .nav-links a:nth-child(2) { display: none; }
    .nav-links .nav-cta { padding: 10px 14px; }
    .section-pad { padding: 78px 20px; }
    .section-heading, .how-intro { margin-bottom: 34px; }
    .section-heading h2, .how-intro h2 { font-size: clamp(2rem, 9vw, 3rem); }
    .section-lede { font-size: 14px; }
    .desktop-break { display: none; }
    .capability-grid { grid-template-columns: 1fr; gap: 12px; }
    .capability-card { min-height: 218px; padding: 22px; }
    .capability-card h3 { margin-top: 18px; font-size: 21px; }
    .step-card { padding: 22px 19px; }
    .closing-section { min-height: 540px; padding: 80px 24px; }
    .closing-content h2 { font-size: clamp(3rem, 13vw, 4.3rem); }
    .closing-content > p:not(.eyebrow) { font-size: 14px; }
    .site-footer { grid-template-columns: 1fr; gap: 12px; padding: 25px 22px; }
    .site-footer p { grid-column: auto; grid-row: auto; }
    .copyright { white-space: normal; }
  }
</style>
