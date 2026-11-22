<div class="status-bar" aria-hidden="true">
  <span class="clock">1:07</span>
  <div class="status-icons">
    <svg class="moon" viewBox="0 0 28 28"><path d="M18.8 3.7a10.2 10.2 0 1 0 5.5 17.9A11.2 11.2 0 0 1 18.8 3.7Z"/></svg>
    <svg class="alarm" viewBox="0 0 28 28"><circle cx="14" cy="15" r="9.3"/><path d="M14 9.5v5.8l3.7 2.2M6.2 3.8 3.8 6.2M21.8 3.8l2.4 2.4"/></svg>
    <span class="network">2.00<small>KB/S</small></span>
    <svg class="wifi" viewBox="0 0 32 28"><path d="M2.8 9.4a20.3 20.3 0 0 1 26.4 0M7.2 14a13.6 13.6 0 0 1 17.6 0M11.8 18.7a6.6 6.6 0 0 1 8.4 0"/><circle cx="16" cy="23" r="1.4" class="solid"/></svg>
    <span class="volte">Vo<br/>LTE</span>
    <svg class="signal" viewBox="0 0 30 28"><path d="M3 24V19M10 24V14M17 24V9M24 24V3"/></svg>
    <span class="battery"><span>24</span></span>
  </div>
</div>

<style>
  .status-bar { position:absolute; z-index:5; inset:0 0 auto; height:calc(92 * var(--u)); display:flex; align-items:center; justify-content:space-between; padding:calc(17 * var(--u)) calc(62 * var(--u)) 0; color:#101718; }
  .clock { font-family:Arial,sans-serif; font-size:calc(30 * var(--u)); line-height:1; font-weight:400; letter-spacing:-.03em; }
  .status-icons { display:flex; align-items:center; gap:calc(9 * var(--u)); height:calc(32 * var(--u)); }
  .status-icons svg { display:block; width:calc(27 * var(--u)); height:calc(27 * var(--u)); fill:none; stroke:#080d0e; stroke-width:2.4; stroke-linecap:round; stroke-linejoin:round; }
  .status-icons .moon { width:calc(25 * var(--u)); fill:#080d0e; stroke:none; }
  .status-icons .alarm { width:calc(28 * var(--u)); }
  .status-icons .network { font:600 calc(21 * var(--u))/0.78 Arial,sans-serif; text-align:center; letter-spacing:-.04em; margin-left:calc(1 * var(--u)); }
  .network small { display:block; font-size:calc(12 * var(--u)); line-height:1.1; font-weight:600; letter-spacing:0; }
  .status-icons .wifi { width:calc(35 * var(--u)); }
  .status-icons .wifi .solid { fill:#080d0e; stroke:none; }
  .status-icons .volte { font:bold calc(12 * var(--u))/0.82 Arial,sans-serif; text-align:center; letter-spacing:-.04em; }
  .status-icons .signal { width:calc(30 * var(--u)); height:calc(28 * var(--u)); stroke-width:4; }
  .battery { display:flex; align-items:center; justify-content:center; width:calc(48 * var(--u)); height:calc(27 * var(--u)); border:calc(2.5 * var(--u)) solid #0b1112; border-radius:calc(7 * var(--u)); margin-left:calc(2 * var(--u)); position:relative; font:400 calc(16 * var(--u))/1 Arial,sans-serif; }
  .battery:after { content:""; position:absolute; right:calc(-6 * var(--u)); top:calc(6 * var(--u)); width:calc(3 * var(--u)); height:calc(12 * var(--u)); border-radius:0 calc(2 * var(--u)) calc(2 * var(--u)) 0; background:#0b1112; }
  .battery:before { content:""; position:absolute; left:calc(2 * var(--u)); top:calc(2 * var(--u)); bottom:calc(2 * var(--u)); width:24%; background:#f2d98a; border-radius:calc(2 * var(--u)); }
  .battery span { position:relative; z-index:1; }
</style>
