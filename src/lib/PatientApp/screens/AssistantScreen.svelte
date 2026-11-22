<div class="assistant-screen">
  <div class="welcome-mark"><img src="/screens/nurse-mark.svg" alt="patnub assistant" /></div>
  <h1>How can I help?</h1>
  <p class="disclaimer">Answers use reviewed health guides and your clinician’s records, right on this phone. This is for health information only and cannot diagnose conditions.</p>

  <div class="suggestion-card">
    <span>I’ve had a headache for two days and feel dizzy when I stand up</span>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>
  </div>
  <div class="suggestion-track" aria-hidden="true"></div>

  <div class="live-info">
    <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><path d="M3 16h26M16 3c4 4 6 8 6 13s-2 9-6 13c-4-4-6-8-6-13s2-9 6-13Z"/></svg>
    <span>Live info</span>
    <span class="switch"><i></i></span>
  </div>

  <div class="composer">
    <span class="plus">+</span>
    <span class="placeholder">Ask a health question</span>
    <span class="send"><svg viewBox="0 0 32 32"><path d="M16 26V6M7 15l9-9 9 9"/></svg></span>
  </div>
</div>

<style>
  .assistant-screen { position:absolute; inset:calc(254 * var(--u)) 0 calc(112 * var(--u)); color:#111819; font-family:inherit; }
  .welcome-mark { position:absolute; top:calc(106 * var(--u)); left:50%; width:calc(252 * var(--u)); height:calc(252 * var(--u)); transform:translateX(-50%); display:grid; place-items:center; border-radius:50%; background:#e0eeee; }
  .welcome-mark img { width:calc(184 * var(--u)); height:calc(186 * var(--u)); object-fit:contain; }
  h1 { position:absolute; top:calc(390 * var(--u)); left:0; right:0; margin:0; text-align:center; font-size:calc(67 * var(--u)); font-weight:300; line-height:1.15; letter-spacing:calc(-1.6 * var(--u)); }
  .disclaimer { position:absolute; top:calc(500 * var(--u)); left:calc(104 * var(--u)); right:calc(104 * var(--u)); margin:0; color:#687575; font-size:calc(44 * var(--u)); line-height:1.41; letter-spacing:calc(.25 * var(--u)); font-weight:400; text-align:center; }
  .suggestion-card { position:absolute; top:calc(941 * var(--u)); left:calc(53 * var(--u)); right:calc(53 * var(--u)); height:calc(176 * var(--u)); display:flex; align-items:center; gap:calc(24 * var(--u)); padding:0 calc(40 * var(--u)); border:1px solid #dfe6e7; border-radius:calc(42 * var(--u)); background:#fff; color:#161e20; box-shadow:0 1px 2px rgba(30,50,50,.02); }
  .suggestion-card span { flex:1; font-size:calc(42 * var(--u)); line-height:1.28; letter-spacing:calc(-.35 * var(--u)); }
  .suggestion-card svg { flex:none; width:calc(25 * var(--u)); height:calc(25 * var(--u)); fill:none; stroke:#6b7777; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; }
  .suggestion-track { position:absolute; top:calc(1141 * var(--u)); left:calc(53 * var(--u)); right:calc(53 * var(--u)); height:calc(28 * var(--u)); border:1px solid #e0e7e8; border-radius:99px; background:#fff; }
  .live-info { position:absolute; top:calc(1196 * var(--u)); left:calc(37 * var(--u)); height:calc(75 * var(--u)); min-width:calc(329 * var(--u)); display:flex; align-items:center; gap:calc(20 * var(--u)); padding:0 calc(16 * var(--u)) 0 calc(30 * var(--u)); border:2px solid #b5d5d4; border-radius:99px; color:#1b3535; background:#dcefee; }
  .live-info > svg { width:calc(36 * var(--u)); height:calc(36 * var(--u)); fill:none; stroke:#277f7d; stroke-width:2.4; }
  .live-info > span:nth-child(2) { font-size:calc(31 * var(--u)); font-weight:400; white-space:nowrap; }
  .switch { width:calc(75 * var(--u)); height:calc(43 * var(--u)); margin-left:auto; display:flex; align-items:center; justify-content:flex-end; padding:calc(4 * var(--u)); border-radius:99px; background:#207e7b; }
  .switch i { width:calc(34 * var(--u)); height:calc(34 * var(--u)); border-radius:50%; background:#fff; }
  .composer { position:absolute; top:calc(1289 * var(--u)); left:calc(30 * var(--u)); right:calc(30 * var(--u)); height:calc(154 * var(--u)); display:flex; align-items:center; gap:calc(30 * var(--u)); padding:0 calc(33 * var(--u)) 0 calc(62 * var(--u)); border:1px solid #e1e6e7; border-radius:99px; background:#fff; box-shadow:0 calc(3 * var(--u)) calc(6 * var(--u)) rgba(28,47,47,.20); }
  .plus { color:#207e7b; font-family:Arial,sans-serif; font-size:calc(62 * var(--u)); font-weight:300; line-height:1; }
  .placeholder { flex:1; color:#6b7777; font-size:calc(46 * var(--u)); white-space:nowrap; text-align:center; transform:translateX(calc(-36 * var(--u))); }
  .send { flex:none; display:grid; place-items:center; width:calc(95 * var(--u)); height:calc(95 * var(--u)); border-radius:50%; background:#e4ebeb; }
  .send svg { width:calc(48 * var(--u)); height:calc(48 * var(--u)); fill:none; stroke:#667272; stroke-width:2.6; stroke-linecap:round; stroke-linejoin:round; }
</style>
