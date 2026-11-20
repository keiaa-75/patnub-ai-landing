<script>
  import Hero from './lib/Hero.svelte';
</script>

<nav class="topnav">
  <a class="brand" href="#top" aria-label="patnub.ai home">
    <img src="/Patnub.ai_LOGO.webp" alt="patnub.ai" />
  </a>
  <div class="links">
    <a href="#features">Features</a>
    <a class="pill" href="#get">See the demo <span>↗</span></a>
  </div>
</nav>

<main id="top">
  <Hero />

  <section class="closing" id="get">
    <div class="closing-inner">
      <img class="closing-logo" src="/Patnub.ai_LOGOWIDE.webp" alt="patnub.ai" />
      <p class="eyebrow">BUILT FOR THE LAST MILE</p>
      <h2>Care that goes<br />where you go.</h2>
      <p class="lede">A clinician writes the note. Your phone keeps it. The assistant explains it in plain language. No signal needed.</p>
      <a class="cta" href="#features">See the 90-second demo <span>↗</span></a>
    </div>
    <div class="orb"></div>
  </section>
</main>

<footer>
  <p>
    patnub.ai is an information tool. It is <strong>not a diagnostic device</strong>,
    a replacement for your clinician, or an emergency service. Medical content is still under clinical review.
  </p>
  <span>© 2026 patnub.ai</span>
</footer>

<style>
  .topnav {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 5%;
    pointer-events: none;
  }
  .topnav a { pointer-events: auto; }
  .brand img {
    display: block;
    height: 34px;
    width: auto;
    max-width: 170px;
    object-fit: contain;
    object-position: left center;
  }
  .links { display: flex; align-items: center; gap: 26px; }
  .links a { color: #fff; text-decoration: none; font-size: 13px; font-weight: 700; }
  .links .pill {
    padding: 10px 18px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 999px;
    backdrop-filter: blur(8px);
  }

  .closing {
    position: relative;
    min-height: 92svh;
    display: grid;
    place-items: center;
    overflow: hidden;
    padding: 100px 7%;
    background: linear-gradient(160deg, var(--c1), var(--c3));
  }
  .closing-inner { position: relative; z-index: 2; max-width: 720px; text-align: center; }
  .closing-logo {
    display: block;
    height: 54px;
    width: auto;
    max-width: 260px;
    object-fit: contain;
    margin: 0 auto 26px;
  }
  .eyebrow { font-size: 10px; font-weight: 800; letter-spacing: 0.3em; color: var(--accent); }
  .closing h2 {
    margin: 16px 0 20px;
    font-size: clamp(2.6rem, 7vw, 6rem);
    line-height: 1;
    letter-spacing: -0.06em;
    font-weight: 800;
  }
  .lede { margin: 0 auto 34px; max-width: 48ch; font-size: clamp(1rem, 1.6vw, 1.2rem); line-height: 1.6; color: var(--muted); }
  .cta {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    padding: 16px 30px;
    border-radius: 999px;
    background: var(--accent);
    color: var(--accent-ink);
    font-weight: 800;
    font-size: 14px;
    text-decoration: none;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .cta:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28); }
  .orb {
    position: absolute;
    width: 60vw;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, var(--glow), transparent 62%);
    opacity: 0.4;
    filter: blur(20px);
    pointer-events: none;
  }

  footer {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 30px 5%;
    background: var(--c3);
    font-size: 11px;
    line-height: 1.6;
    color: var(--muted);
  }
  footer p { margin: 0; max-width: 90ch; }
  footer strong { color: #fff; }

  @media (max-width: 767px) {
    .brand img { height: 28px; }
    .links { gap: 14px; }
    .links a { font-size: 11px; }
    .links .pill { padding: 8px 12px; }
  }
</style>
