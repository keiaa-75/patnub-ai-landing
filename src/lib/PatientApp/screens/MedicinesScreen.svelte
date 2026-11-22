<div class="medicines-screen">
  <div class="search-field">
    <span>Search a medicine</span>
  </div>
  <div class="scan-packaging">Scan medicine packaging</div>

  <div class="live-drug-card">
    <span class="globe-badge">
      <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="16"/><path d="M4 20h32M20 4c5 5 7 10 7 16s-2 11-7 16c-5-5-7-10-7-16s2-11 7-16Z"/></svg>
    </span>
    <span class="live-copy"><b>Live drug &amp; health info</b><small>U.S. FDA &amp; health sites · On</small></span>
    <span class="large-switch"><i></i></span>
  </div>

  <h2>Built-in medicines</h2>
  <div class="medicine-list">
    <article class="medicine-card"><div><b>Amlodipine</b><small>calcium channel blocker</small></div><span>›</span></article>
    <article class="medicine-card"><div><b>Amoxicillin</b><small>penicillin class drug product</small></div><span>›</span></article>
    <article class="medicine-card"><div><b>Cetirizine</b><small>Antihistamine</small></div><span>›</span></article>
    <article class="medicine-card long"><div><b>Cotrimoxazole (Sulfamethoxazole and trimethoprim)</b><small>Antibacterial combination</small></div><span>›</span></article>
  </div>
</div>

<style>
  .medicines-screen { position:absolute; inset:calc(254 * var(--u)) 0 calc(112 * var(--u)); overflow:hidden; font-family:inherit; color:#111819; }
  .search-field { position:absolute; top:calc(43 * var(--u)); left:calc(42 * var(--u)); right:calc(42 * var(--u)); height:calc(145 * var(--u)); display:flex; align-items:center; gap:0; padding:0 calc(40 * var(--u)); border:2px solid #c8d3d3; border-radius:calc(37 * var(--u)); color:#687575; background:transparent; font-size:calc(43 * var(--u)); }
  .scan-packaging { position:absolute; top:calc(216 * var(--u)); left:calc(42 * var(--u)); right:calc(42 * var(--u)); height:calc(127 * var(--u)); display:grid; place-items:center; border-radius:calc(35 * var(--u)); background:#1e7d7a; color:#fff; font-size:calc(40 * var(--u)); font-weight:400; }
  .live-drug-card { position:absolute; top:calc(370 * var(--u)); left:calc(42 * var(--u)); right:calc(42 * var(--u)); height:calc(160 * var(--u)); display:flex; align-items:center; gap:calc(30 * var(--u)); padding:0 calc(35 * var(--u)); border:1px solid #cbdada; border-radius:calc(40 * var(--u)); background:#fff; }
  .globe-badge { flex:none; display:grid; place-items:center; width:calc(96 * var(--u)); height:calc(96 * var(--u)); border-radius:50%; background:#d8efed; }
  .globe-badge svg { width:calc(47 * var(--u)); height:calc(47 * var(--u)); fill:none; stroke:#257d7b; stroke-width:2.5; }
  .live-copy { min-width:0; flex:1; display:flex; flex-direction:column; gap:calc(9 * var(--u)); white-space:nowrap; }
  .live-copy b { font-size:calc(40 * var(--u)); font-weight:300; }
  .live-copy small { color:#357d7b; font-size:calc(33 * var(--u)); }
  .large-switch { flex:none; width:calc(136 * var(--u)); height:calc(84 * var(--u)); display:flex; align-items:center; justify-content:flex-end; padding:calc(7 * var(--u)); border-radius:99px; background:#207e7b; }
  .large-switch i { width:calc(65 * var(--u)); height:calc(65 * var(--u)); border-radius:50%; background:#fff; }
  h2 { position:absolute; top:calc(568 * var(--u)); left:calc(42 * var(--u)); margin:0; font-size:calc(37 * var(--u)); font-weight:300; color:#697676; }
  .medicine-list { position:absolute; top:calc(644 * var(--u)); left:calc(42 * var(--u)); right:calc(42 * var(--u)); display:flex; flex-direction:column; gap:calc(28 * var(--u)); }
  .medicine-card { min-height:calc(190 * var(--u)); display:flex; align-items:center; justify-content:space-between; gap:calc(16 * var(--u)); padding:calc(26 * var(--u)) calc(41 * var(--u)); border:1px solid #dfe6e7; border-radius:calc(42 * var(--u)); background:#fff; }
  .medicine-card div { flex:1; min-width:0; display:flex; flex-direction:column; gap:calc(13 * var(--u)); }
  .medicine-card b { font-size:calc(42 * var(--u)); line-height:1.3; font-weight:300; letter-spacing:calc(-.4 * var(--u)); }
  .medicine-card small { color:#687575; font-size:calc(29 * var(--u)); line-height:1.25; }
  .medicine-card > span { color:#677575; font-size:calc(58 * var(--u)); line-height:1; }
  .medicine-card.long { min-height:calc(230 * var(--u)); }
</style>
