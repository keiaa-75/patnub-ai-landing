<script>
  let { children, depth = 20, radius = 42 } = $props();

  // --ry / --sheen / --glass-pos are written by Hero's render loop.
</script>

<div class="phone" style="--d:{depth}px; --rr:{radius}px">
  <!-- Metal rail: four real side faces, not stacked copies of the silhouette -->
  <div class="side left"></div>
  <div class="side right">
    <span class="side-btn vol-up"></span>
    <span class="side-btn vol-down"></span>
    <span class="side-btn power"></span>
  </div>
  <div class="side top"></div>
  <div class="side bottom"><span class="port"></span></div>

  <div class="face back">
    <div class="camera-plate">
      <span class="lens"></span>
      <span class="lens"></span>
      <span class="lens"></span>
      <span class="flash"></span>
    </div>
    <div class="back-mark">PATNUB</div>
  </div>

  <div class="face front">
    <div class="bezel">
      <div class="screen">{@render children?.()}</div>
    </div>
    <div class="island"><span class="lens-dot"></span></div>
    <div class="glass"></div>
  </div>
</div>

<style>
  .phone {
    position: relative;
    width: var(--phone-w);
    aspect-ratio: 9 / 19;
    transform-style: preserve-3d;
    /* deliberately no filter / overflow / will-change here */
  }

  .face,
  .side {
    position: absolute;
    top: 50%;
    left: 50%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .face {
    width: 100%;
    height: 100%;
    margin-left: calc(var(--phone-w) / -2);
    margin-top: calc(var(--phone-w) * 19 / 9 / -2);
    border-radius: var(--rr);
    overflow: hidden;
  }

  /* ---------- front ---------- */
  .front {
    background: #07090a;
    transform: translateZ(calc(var(--d) / 2));
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.16),
      inset 0 1px 1px rgba(255, 255, 255, 0.32),
      inset 0 -1px 2px rgba(0, 0, 0, 0.75);
  }

  .bezel {
    position: absolute;
    inset: 6px;
    border-radius: calc(var(--rr) - 6px);
    overflow: hidden;
    background: var(--screen-bg);
  }

  .screen {
    width: 100%;
    height: 100%;
    color: var(--screen-ink);
  }

  /* Punch-hole front camera, matching the Galaxy-style 3D model. */
  .island {
    position: absolute;
    top: 11px;
    left: 50%;
    translate: -50% 0;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #040505;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 0 3px rgba(0, 0, 0, 0.9);
    display: grid;
    place-items: center;
    z-index: 3;
  }

  .lens-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #47545a, #0a0f11 60%);
    box-shadow: 0 0 0 1px #161c1e;
  }

  .glass {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 4;
    border-radius: var(--rr);
    mix-blend-mode: screen;
    background: linear-gradient(
      112deg,
      transparent 30%,
      rgba(255, 255, 255, 0.2) 44%,
      rgba(255, 255, 255, 0.06) 51%,
      transparent 64%
    );
    background-size: 260% 100%;
    background-position: var(--glass-pos, 100%) 0;
  }

  /* ---------- back ---------- */
  .back {
    background: linear-gradient(150deg, #373d3f 0%, #171a1b 52%, #24292a 100%);
    transform: rotateY(180deg) translateZ(calc(var(--d) / 2));
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.09),
      inset 0 1px 1px rgba(255, 255, 255, 0.14);
    padding: 17px;
  }

  .camera-plate {
    position: relative;
    width: 92px;
    height: 134px;
    border-radius: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 11px;
    background: linear-gradient(145deg, #454b4d, #101314);
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.22),
      0 2px 6px rgba(0, 0, 0, 0.55);
  }

  .lens {
    width: 36px;
    height: 36px;
    flex: none;
    border-radius: 50%;
    background: radial-gradient(circle at 34% 28%, #7d8a90 0 7%, #293236 20%, #050809 56%, #121719 100%);
    box-shadow:
      0 0 0 3px #2b3133,
      inset 0 0 5px rgba(0, 0, 0, 0.95),
      0 1px 2px rgba(255, 255, 255, 0.14);
  }

  .flash {
    position: absolute;
    top: 16px;
    right: 14px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 35%, #fff8dc, #c9b98a 70%);
    box-shadow: 0 0 0 2px #2b3133;
  }

  .back-mark {
    position: absolute;
    bottom: 42px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 9px;
    letter-spacing: 0.32em;
    color: rgba(255, 255, 255, 0.24);
  }

  /* ---------- rail ---------- */
  .side {
    background: linear-gradient(
      90deg,
      #3c4245 0%,
      #8d9599 calc(var(--sheen, 50%) - 26%),
      #f2f5f6 var(--sheen, 50%),
      #8d9599 calc(var(--sheen, 50%) + 26%),
      #3c4245 100%
    );
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }

  .left,
  .right {
    width: var(--d);
    height: calc(100% - var(--rr) * 2);
    margin-left: calc(var(--d) / -2);
    margin-top: calc((100% - var(--rr) * 2) / -2);
    border-radius: 6px;
  }

  .left { transform: rotateY(-90deg) translateZ(calc(var(--phone-w) / 2)); }
  .right { transform: rotateY(90deg) translateZ(calc(var(--phone-w) / 2)); }

  .top,
  .bottom {
    width: var(--phone-w);
    height: var(--d);
    margin-left: calc(var(--phone-w) / -2);
    margin-top: calc(var(--d) / -2);
    border-radius: 6px;
  }

  .top { transform: rotateX(90deg) translateZ(calc(var(--phone-w) * 19 / 9 / 2)); }
  .bottom { transform: rotateX(-90deg) translateZ(calc(var(--phone-w) * 19 / 9 / 2)); }

  .side-btn {
    position: absolute;
    left: 50%;
    translate: -50% 0;
    width: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, #5c6468, #d5dcde, #5c6468);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
  }

  .vol-up { top: 19%; height: 34px; }
  .vol-down { top: 26%; height: 34px; }
  .power { top: 36%; height: 52px; }

  .port {
    position: absolute;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    width: 30px;
    height: 5px;
    border-radius: 3px;
    background: #050708;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.09);
  }
</style>
