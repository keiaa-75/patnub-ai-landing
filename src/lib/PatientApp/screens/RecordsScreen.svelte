<!--
  Records, with one clinician note saved.

  Reference: the real app's records list. Coordinates are canvas units
  (1u = 1px of the 945px-wide texture) from the top of the screen area.
  The reference was captured in dark mode, so every colour here is the
  light-mode equivalent of the same role (surface, container, on-container).
-->
<div class="records-screen">
  <header class="records-head">
    <h1>Your records</h1>
    <span class="count">1 saved</span>
  </header>

  <article class="record-card">
    <div class="record-main">
      <span class="verified">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>
        From your clinician · Nov 22, 2026
      </span>

      <h2>Stage 1 hypertension</h2>
      <p class="provider">Julian Charles Macato, DR · Demo Rural Health Unit</p>

      <div class="tags">
        <span class="tag medicine">Amlodipine 5 mg</span>
        <span class="tag warning">Warning signs listed</span>
      </div>
    </div>

    <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 4.5 7.5 7.5-7.5 7.5"/></svg>
  </article>
</div>

<style>
  .records-screen { position:absolute; inset:calc(254 * var(--u)) 0 calc(112 * var(--u)); overflow:hidden; color:#111819; font-family:inherit; }

  .records-head { position:absolute; top:calc(43 * var(--u)); left:calc(52 * var(--u)); right:calc(52 * var(--u)); height:calc(60 * var(--u)); display:flex; align-items:center; justify-content:space-between; }
  h1 { margin:0; font-size:calc(49.5 * var(--u)); font-weight:500; line-height:calc(60 * var(--u)); }
  .count { display:inline-flex; align-items:center; height:calc(57 * var(--u)); padding:0 calc(33 * var(--u)); border-radius:99px; background:#dfe9e9; color:#1d2b2b; font-size:calc(27 * var(--u)); font-weight:500; letter-spacing:calc(.2 * var(--u)); }

  .record-card { position:absolute; top:calc(143 * var(--u)); left:calc(52 * var(--u)); right:calc(52 * var(--u)); display:flex; align-items:center; gap:calc(16 * var(--u)); padding:calc(40 * var(--u)) calc(40 * var(--u)) calc(41 * var(--u)); border:1px solid #dde5e6; border-radius:calc(48 * var(--u)); background:#fff; box-shadow:0 calc(1 * var(--u)) calc(3 * var(--u)) rgba(30,50,50,.05); }
  .record-main { flex:1; min-width:0; display:flex; flex-direction:column; align-items:flex-start; }

  .verified { display:inline-flex; align-items:center; gap:calc(10 * var(--u)); height:calc(52 * var(--u)); padding:0 calc(26 * var(--u)) 0 calc(22 * var(--u)); border-radius:99px; background:#e4eaf8; color:#2f4b95; font-size:calc(24.5 * var(--u)); font-weight:500; letter-spacing:calc(.3 * var(--u)); white-space:nowrap; }
  .verified svg { width:calc(24 * var(--u)); height:calc(24 * var(--u)); fill:none; stroke:currentColor; stroke-width:3.2; stroke-linecap:round; stroke-linejoin:round; }

  h2 { margin:calc(22 * var(--u)) 0 0; font-size:calc(35 * var(--u)); font-weight:500; line-height:calc(42 * var(--u)); letter-spacing:calc(.2 * var(--u)); }
  .provider { margin:calc(23 * var(--u)) 0 0; color:#5f6c6c; font-size:calc(28 * var(--u)); font-weight:400; line-height:calc(35 * var(--u)); letter-spacing:calc(.55 * var(--u)); white-space:nowrap; }

  .tags { display:flex; gap:calc(16 * var(--u)); margin-top:calc(18 * var(--u)); }
  .tag { display:inline-flex; align-items:center; height:calc(57 * var(--u)); padding:0 calc(22 * var(--u)); border-radius:calc(14 * var(--u)); font-size:calc(25.5 * var(--u)); font-weight:500; white-space:nowrap; }
  .tag.medicine { background:#d6ecea; color:#0f5f5a; }
  .tag.warning { background:#fbdcd8; color:#8f1d16; }

  .chevron { flex:none; width:calc(26 * var(--u)); height:calc(26 * var(--u)); margin-right:calc(2 * var(--u)); fill:none; stroke:#667272; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; }
</style>
