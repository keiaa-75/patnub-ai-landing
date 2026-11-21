<script>
  let { children, depth = 18, radius = 34 } = $props();
</script>

<div class="phone" style="--d:{depth}px; --rr:{radius}px">
  <div class="side left"></div>
  <div class="side right">
    <span class="side-btn volume-up"></span>
    <span class="side-btn volume-down"></span>
    <span class="side-btn power"></span>
  </div>
  <div class="side top"></div>
  <div class="side bottom"><span class="port"></span></div>

  <div class="face back">
    <div class="camera-stack" aria-hidden="true">
      <span class="rear-lens lens-one"></span>
      <span class="rear-lens lens-two"></span>
      <span class="rear-lens lens-three"></span>
      <span class="rear-lens lens-four"></span>
      <span class="flash"></span>
      <span class="sensor"></span>
    </div>
    <div class="back-mark">PATNUB.AI</div>
  </div>

  <div class="face front">
    <div class="bezel">
      <div class="screen">{@render children?.()}</div>
    </div>
    <div class="punch-hole"><span></span></div>
    <div class="glass"></div>
  </div>
</div>

<style>
  .phone { position: relative; width: var(--phone-w); aspect-ratio: 9 / 19.5; transform-style: preserve-3d; }
  .face, .side { position: absolute; top: 50%; left: 50%; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .face {
    width: 100%; height: 100%;
    margin-left: calc(var(--phone-w) / -2);
    margin-top: calc(var(--phone-w) * 19.5 / 9 / -2);
    overflow: hidden;
    border-radius: var(--rr);
  }
  .front {
    background: #1a2020;
    transform: translateZ(calc(var(--d) / 2));
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.58), inset 0 1px 1px rgba(255,255,255,.5), 0 0 0 1px rgba(17,38,33,.12);
  }
  .bezel { position: absolute; inset: 4px; overflow: hidden; border-radius: calc(var(--rr) - 4px); background: var(--screen-bg); }
  .screen { width: 100%; height: 100%; color: var(--screen-ink); }
  .punch-hole {
    position: absolute; z-index: 5; top: 9px; left: 50%; translate: -50% 0;
    width: 13px; height: 13px; display: grid; place-items: center;
    border: 1px solid rgba(255,255,255,.16); border-radius: 50%; background: #050707;
  }
  .punch-hole span { width: 6px; height: 6px; border-radius: 50%; background: #152a31; box-shadow: 0 0 0 1px #263e43; }
  .glass {
    position: absolute; inset: 0; z-index: 6; pointer-events: none; border-radius: var(--rr);
    background: linear-gradient(112deg, transparent 32%, rgba(255,255,255,.16) 46%, rgba(255,255,255,.035) 53%, transparent 66%);
    background-size: 260% 100%; background-position: var(--glass-pos, 100%) 0; mix-blend-mode: screen;
  }
  .back {
    padding: 20px 17px;
    background: #aeb9b5;
    transform: rotateY(180deg) translateZ(calc(var(--d) / 2));
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.62), inset 0 1px 1px rgba(255,255,255,.6);
  }
  .camera-stack { position: relative; width: 44px; height: 190px; }
  .rear-lens {
    position: absolute; left: 0; width: 33px; height: 33px; border: 3px solid #7e8985; border-radius: 50%;
    background: radial-gradient(circle at 34% 28%, #82959b 0 6%, #26383c 18%, #070d10 57%, #202d30 100%);
    box-shadow: inset 0 0 0 2px #253134, 0 1px 2px rgba(0,0,0,.3);
  }
  .lens-one { top: 0; }
  .lens-two { top: 43px; }
  .lens-three { top: 86px; }
  .lens-four { top: 129px; }
  .flash { position: absolute; top: 48px; left: 38px; width: 9px; height: 9px; border-radius: 50%; background: #f7f0d8; box-shadow: 0 0 0 2px rgba(71,80,76,.35); }
  .sensor { position: absolute; top: 91px; left: 39px; width: 7px; height: 7px; border-radius: 50%; background: #5e6866; }
  .back-mark { position: absolute; right: 20px; bottom: 45px; color: rgba(30,49,43,.24); font-size: 8px; font-weight: 700; letter-spacing: .23em; }
  .side {
    background: linear-gradient(90deg, #65716e, #d4ded9 48%, #88938e);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.28);
  }
  .left, .right {
    width: var(--d); height: calc(100% - var(--rr) * 2);
    margin-left: calc(var(--d) / -2); margin-top: calc((100% - var(--rr) * 2) / -2); border-radius: 5px;
  }
  .left { transform: rotateY(-90deg) translateZ(calc(var(--phone-w) / 2)); }
  .right { transform: rotateY(90deg) translateZ(calc(var(--phone-w) / 2)); }
  .top, .bottom {
    width: var(--phone-w); height: var(--d); margin-left: calc(var(--phone-w) / -2); margin-top: calc(var(--d) / -2); border-radius: 5px;
  }
  .top { transform: rotateX(90deg) translateZ(calc(var(--phone-w) * 19.5 / 9 / 2)); }
  .bottom { transform: rotateX(-90deg) translateZ(calc(var(--phone-w) * 19.5 / 9 / 2)); }
  .side-btn { position: absolute; left: 50%; translate: -50% 0; width: 2px; border-radius: 3px; background: #d8e0dd; box-shadow: 0 0 2px rgba(0,0,0,.35); }
  .volume-up { top: 18%; height: 31px; }
  .volume-down { top: 25%; height: 31px; }
  .power { top: 36%; height: 45px; }
  .port { position: absolute; top: 50%; left: 50%; translate: -50% -50%; width: 28px; height: 5px; border-radius: 4px; background: #1b2421; box-shadow: 0 0 0 1px rgba(255,255,255,.24); }
</style>
