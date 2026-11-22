<script>
  let { children, depth = 18, radius = 18 } = $props();

  /*
    Build each rounded corner from short tangent facets.
    The facets follow the rounded-rectangle perimeter and meet the
    straight rails at exact tangent points, avoiding open corner gaps.
  */
  function createCornerFacets(startAngle) {
    const segmentCount = 6;
    const segmentAngle = 90 / segmentCount;
    const halfAngle = (segmentAngle / 2) * Math.PI / 180;
    const radialScale = Math.cos(halfAngle);

    return Array.from({ length: segmentCount }, (_, index) => {
      const angle = startAngle + (index + 0.5) * segmentAngle;
      const radians = angle * Math.PI / 180;

      return {
        index,
        x: Number((Math.cos(radians) * radialScale).toFixed(6)),
        y: Number((Math.sin(radians) * radialScale).toFixed(6)),
        tangent: `${angle + 90}deg`
      };
    });
  }

  const CORNER_ARCS = [
    {
      key: 'top-left',
      left: 'var(--corner)',
      top: 'var(--corner)',
      facets: createCornerFacets(180)
    },
    {
      key: 'top-right',
      left: 'calc(100% - var(--corner))',
      top: 'var(--corner)',
      facets: createCornerFacets(-90)
    },
    {
      key: 'bottom-right',
      left: 'calc(100% - var(--corner))',
      top: 'calc(100% - var(--corner))',
      facets: createCornerFacets(0)
    },
    {
      key: 'bottom-left',
      left: 'var(--corner)',
      top: 'calc(100% - var(--corner))',
      facets: createCornerFacets(90)
    }
  ];
</script>

<div
  class="phone"
  style={`--d:${depth}px; --rr:${radius}px`}
>
  <!-- Rear glass / titanium cover -->
  <div class="face back">
    <div class="back-brush" aria-hidden="true"></div>

    <div class="camera-island" aria-hidden="true">
      <span class="rear-lens lens-one"></span>
      <span class="rear-lens lens-two"></span>
      <span class="rear-lens lens-three"></span>
      <span class="flash"></span>
      <span class="sensor"></span>
      <span class="focus-sensor"></span>
    </div>

    <div class="back-brand" aria-hidden="true">
      <span class="brand-name">PATNUB.AI</span>
      <span class="brand-caption">HEALTH, MADE CLEARER</span>
    </div>

    <div class="back-seam" aria-hidden="true"></div>
  </div>

  <!-- Left and right side rails. These sit between the two glass faces. -->
  <div class="edge edge-left" aria-hidden="true">
    <span class="antenna antenna-top"></span>
    <span class="antenna antenna-bottom"></span>
    <span class="sim-outline"></span>
  </div>

  <div class="edge edge-right" aria-hidden="true">
    <span class="side-button volume-up"></span>
    <span class="side-button volume-down"></span>
    <span class="side-button power"></span>
    <span class="antenna antenna-top"></span>
    <span class="antenna antenna-bottom"></span>
  </div>

  <!-- Top and bottom rails complete the metal perimeter. -->
  <div class="edge edge-top" aria-hidden="true">
    <span class="antenna antenna-left"></span>
    <span class="antenna antenna-right"></span>
    <span class="top-mic mic-one"></span>
    <span class="top-mic mic-two"></span>
  </div>

  <div class="edge edge-bottom" aria-hidden="true">
    <span class="antenna antenna-left"></span>
    <span class="antenna antenna-right"></span>
    <span class="usb-port"></span>
    <span class="speaker-grille grille-left"></span>
    <span class="speaker-grille grille-right"></span>
    <span class="bottom-mic"></span>
  </div>

  <!-- Rounded corner bridges connect the four straight metal rails. -->
  {#each CORNER_ARCS as corner (corner.key)}
    <div
      class="corner-arc"
      style={`left:${corner.left};top:${corner.top}`}
      aria-hidden="true"
    >
      {#each corner.facets as facet (facet.index)}
        <span
          class="corner-facet"
          style={`--facet-x:${facet.x};--facet-y:${facet.y};--facet-angle:${facet.tangent}`}
        ></span>
      {/each}
    </div>
  {/each}

  <!-- Front glass and display. No camera punch-hole overlay. -->
  <div class="face front">
    <div class="bezel">
      <div class="screen">{@render children?.()}</div>
    </div>

    <div class="glass" aria-hidden="true"></div>
    <div class="front-rim" aria-hidden="true"></div>
  </div>
</div>

<style>
  .phone {
    --metal-light: #edf1ee;
    --metal-mid: #aeb8b2;
    --metal-dark: #505b55;
    --corner: var(--rr);
    --phone-height: calc(var(--phone-w) * 2.1666667);

    position: relative;
    width: var(--phone-w);
    height: var(--phone-height);

    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;

    /*
      Do not put filter, opacity, isolation, or overflow here.
      Those grouping properties can flatten the 3D descendants
      and make the back and side rails disappear.
    */
  }

  .face,
  .edge {
    position: absolute;
    box-sizing: border-box;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .face {
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    margin-left: calc(var(--phone-w) / -2);
    margin-top: calc(var(--phone-height) / -2);
    border-radius: var(--corner);
    overflow: hidden;
  }

  /* ---------------------------
     Rear panel
  --------------------------- */

  .back {
    transform: rotateY(180deg) translateZ(calc(var(--d) / 2));
    border: 1px solid rgba(64, 75, 68, 0.72);
    background:
      linear-gradient(118deg,
        rgba(255,255,255,.56) 0%,
        rgba(255,255,255,.12) 21%,
        transparent 43% 69%,
        rgba(38,52,44,.14) 100%),
      linear-gradient(145deg,
        #e0e6e1 0%,
        #c0c9c3 28%,
        #aab5ae 57%,
        #d5dcd7 100%);
    box-shadow:
      inset 0 0 0 1px rgba(255,255,255,.72),
      inset 0 2px 4px rgba(255,255,255,.5),
      inset 0 -2px 5px rgba(35,47,40,.2);
  }

  .back-brush {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .24;
    background:
      repeating-linear-gradient(
        92deg,
        rgba(255,255,255,.1) 0 1px,
        rgba(40,52,45,.035) 1px 2px,
        transparent 2px 5px
      );
  }

  .camera-island {
    position: absolute;
    top: clamp(14px, calc(var(--phone-w) * .055), 22px);
    left: clamp(12px, calc(var(--phone-w) * .05), 20px);
    width: clamp(45px, calc(var(--phone-w) * .18), 60px);
    height: clamp(142px, calc(var(--phone-w) * .52), 178px);
    border: 1px solid rgba(68, 79, 72, .42);
    border-radius: 19px;
    background:
      linear-gradient(145deg,
        rgba(255,255,255,.72),
        rgba(255,255,255,.08) 34%,
        rgba(56,68,60,.16) 100%),
      linear-gradient(145deg, #c8d1cb, #8e9a93);
    box-shadow:
      inset 0 1px 1px rgba(255,255,255,.76),
      inset 0 -1px 2px rgba(46,57,50,.25),
      0 2px 5px rgba(35,48,41,.19),
      0 0 0 1px rgba(255,255,255,.18);
  }

  .camera-island::before {
    position: absolute;
    inset: 4px;
    content: '';
    border: 1px solid rgba(255,255,255,.24);
    border-radius: 15px;
    pointer-events: none;
  }

  .rear-lens {
    position: absolute;
    left: 50%;
    width: clamp(28px, calc(var(--phone-w) * .112), 36px);
    height: clamp(28px, calc(var(--phone-w) * .112), 36px);
    transform: translateX(-50%);
    border: 2px solid #65716a;
    border-radius: 50%;
    background:
      radial-gradient(circle at 31% 24%,
        rgba(178,211,211,.96) 0 4%,
        #5e7b7e 9%,
        #203a40 22%,
        #071216 47%,
        #263338 66%,
        #030708 100%);
    box-shadow:
      inset 0 0 0 2px #29383a,
      inset 0 0 7px 2px rgba(0,0,0,.82),
      0 0 0 2px rgba(225,233,227,.72),
      0 1px 3px rgba(0,0,0,.4);
  }

  .rear-lens::before {
    position: absolute;
    top: 5px;
    left: 6px;
    width: 7px;
    height: 4px;
    content: '';
    transform: rotate(-38deg);
    border-radius: 50%;
    background: rgba(219,245,242,.38);
    filter: blur(.4px);
  }

  .lens-one { top: 11px; }
  .lens-two { top: 57px; }
  .lens-three { top: 103px; }

  .flash,
  .sensor,
  .focus-sensor {
    position: absolute;
    right: 5px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }

  .flash {
    top: 65px;
    border: 1px solid rgba(100,107,89,.5);
    background: radial-gradient(circle, #fff9e7 0 40%, #e4d7a8 72%, #8d9387 100%);
    box-shadow: 0 0 6px rgba(255,245,211,.6);
  }

  .sensor {
    top: 105px;
    background: radial-gradient(circle at 30% 25%, #7b8b87, #25322f 70%);
    box-shadow: 0 0 0 1px rgba(240,245,240,.34);
  }

  .focus-sensor {
    top: 125px;
    width: 5px;
    height: 5px;
    background: #35413d;
    box-shadow: 0 0 0 1px rgba(255,255,255,.24);
  }

  .back-brand {
    position: absolute;
    right: 0;
    bottom: clamp(34px, calc(var(--phone-w) * .14), 54px);
    left: 0;
    display: grid;
    justify-items: center;
    gap: 5px;
    color: rgba(40, 55, 46, .42);
    text-align: center;
  }

  .brand-name {
    font-size: clamp(8px, calc(var(--phone-w) * .031), 10px);
    font-weight: 800;
    letter-spacing: .27em;
  }

  .brand-caption {
    font-size: clamp(5px, calc(var(--phone-w) * .018), 6px);
    font-weight: 700;
    letter-spacing: .19em;
  }

  .back-seam {
    position: absolute;
    right: 18%;
    bottom: 19px;
    left: 18%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
  }

  /* ---------------------------
     Titanium perimeter rails
  --------------------------- */

  .edge {
    top: 50%;
    left: 50%;
    z-index: 1;
    border: 1px solid rgba(61, 72, 65, .7);
    background:
      linear-gradient(90deg,
        #65716a 0%,
        #e5ebe6 12%,
        #bfc9c2 27%,
        #828e86 49%,
        #e2e8e3 73%,
        #707b74 100%);
    box-shadow:
      inset 0 1px 1px rgba(255,255,255,.76),
      inset 0 -1px 1px rgba(24,36,29,.35);
  }

  .edge-left,
  .edge-right {
    top: calc(var(--corner) - .2px);
    width: var(--d);
    height: calc(100% - var(--corner) - var(--corner) + .4px);
    margin-left: calc(var(--d) / -2);
    border-radius: 2px;
  }

  .edge-left {
    transform: rotateY(-90deg) translateZ(calc(var(--phone-w) / 2));
    background:
      linear-gradient(90deg,
        #58645d 0%,
        #e3e9e4 16%,
        #acb7b0 43%,
        #d4dcd6 76%,
        #59665e 100%);
  }

  .edge-right {
    transform: rotateY(90deg) translateZ(calc(var(--phone-w) / 2));
    background:
      linear-gradient(90deg,
        #657169 0%,
        #dce4dd 18%,
        #9da9a1 48%,
        #e7ece8 79%,
        #5c6860 100%);
  }

  .edge-top,
  .edge-bottom {
    left: calc(var(--corner) - .2px);
    width: calc(100% - var(--corner) - var(--corner) + .4px);
    height: var(--d);
    margin-top: calc(var(--d) / -2);
    border-radius: 2px;
  }

  .edge-top {
    transform: rotateX(90deg) translateZ(calc(var(--phone-height) / 2));
  }

  .edge-bottom {
    transform: rotateX(-90deg) translateZ(calc(var(--phone-height) / 2));
    background:
      linear-gradient(180deg,
        #e5ebe6 0%,
        #a2ada5 35%,
        #5c6860 100%);
  }

  /*
    Each corner is a short polygonal arc extruded across the phone depth.
    Six facets per corner approximate the rounded chassis while keeping
    the perimeter continuous and avoiding gaps at the rail junctions.
  */
  .corner-arc {
    position: absolute;
    z-index: 2;
    width: 0;
    height: 0;
    overflow: visible;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    pointer-events: none;
  }

  .corner-facet {
    position: absolute;
    left: calc(var(--corner) * var(--facet-x));
    top: calc(var(--corner) * var(--facet-y));
    width: calc(var(--corner) * .261052 + .2px);
    height: var(--d);
    box-sizing: border-box;
    border: 0;
    background:
      linear-gradient(180deg,
        #657169 0%,
        #e1e8e2 15%,
        #aeb9b1 48%,
        #dce4dd 84%,
        #606c64 100%);
    box-shadow:
      inset 0 1px 1px rgba(255,255,255,.72),
      inset 0 -1px 1px rgba(24,36,29,.34);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-origin: 50% 50%;
    transform:
      translate(-50%, -50%)
      rotateZ(var(--facet-angle))
      rotateX(90deg);
  }

  /* Physical side keys sit slightly proud of the right rail. */

  .side-button {
    position: absolute;
    left: 50%;
    display: block;
    width: clamp(5px, calc(var(--d) * .38), 7px);
    transform: translateX(-50%) translateZ(1px);
    border: 1px solid rgba(60,70,63,.72);
    border-radius: 4px;
    background:
      linear-gradient(90deg,
        #737f77,
        #f0f3ef 42%,
        #c0c9c2 70%,
        #68746c);
    box-shadow:
      0 0 2px rgba(0,0,0,.45),
      inset 0 0 1px rgba(255,255,255,.85);
  }

  .volume-up { top: 18%; height: 34px; }
  .volume-down { top: 26%; height: 34px; }
  .power { top: 41%; height: 47px; }

  .antenna {
    position: absolute;
    z-index: 2;
    display: block;
    background: rgba(42, 54, 47, .58);
    box-shadow: 0 1px 0 rgba(255,255,255,.52);
  }

  .edge-left .antenna,
  .edge-right .antenna {
    left: -1px;
    width: calc(100% + 2px);
    height: 1px;
  }

  .edge-top .antenna,
  .edge-bottom .antenna {
    top: -1px;
    width: 1px;
    height: calc(100% + 2px);
  }

  .antenna-top { top: 12%; }
  .antenna-bottom { bottom: 12%; }
  .antenna-left { left: 13%; }
  .antenna-right { right: 13%; }

  .sim-outline {
    position: absolute;
    top: 57%;
    left: 50%;
    width: 2px;
    height: 33px;
    transform: translateX(-50%) translateZ(.8px);
    border-radius: 2px;
    background: rgba(50,62,54,.52);
    box-shadow: 0 0 0 1px rgba(255,255,255,.2);
  }

  /* Top rail: two small microphone apertures. */

  .top-mic {
    position: absolute;
    top: 50%;
    width: 3px;
    height: 3px;
    transform: translate(-50%, -50%) translateZ(.8px);
    border-radius: 50%;
    background: #303b34;
    box-shadow: inset 0 0 1px #000, 0 0 0 1px rgba(255,255,255,.35);
  }

  .mic-one { left: 38%; }
  .mic-two { left: 62%; }

  /* Bottom rail: USB-C recess, speaker outlets and microphone. */

  .usb-port {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 28px;
    height: 6px;
    transform: translate(-50%, -50%) translateZ(.9px);
    border: 1px solid rgba(32,42,36,.9);
    border-radius: 5px;
    background: linear-gradient(180deg, #101713, #303b34 48%, #080d0a);
    box-shadow:
      inset 0 1px 2px rgba(0,0,0,.8),
      0 0 0 1px rgba(255,255,255,.25);
  }

  .speaker-grille {
    position: absolute;
    top: 50%;
    width: 17px;
    height: 4px;
    transform: translateY(-50%) translateZ(.8px);
    border-radius: 3px;
    background: repeating-linear-gradient(
      90deg,
      #344038 0 1.5px,
      transparent 1.5px 3px
    );
  }

  .grille-left { left: 13%; }
  .grille-right { right: 13%; }

  .bottom-mic {
    position: absolute;
    top: 50%;
    left: 36%;
    width: 3px;
    height: 3px;
    transform: translate(-50%, -50%) translateZ(.8px);
    border-radius: 50%;
    background: #29332d;
    box-shadow: 0 0 0 1px rgba(255,255,255,.35);
  }

  /* ---------------------------
     Front glass and display
  --------------------------- */

  .front {
    z-index: 3;
    overflow: visible;
    border: 1px solid #303936;
    background:
      linear-gradient(135deg,
        #68716c 0%,
        #1e2722 16%,
        #080d0a 52%,
        #303a34 85%,
        #69736c 100%);
    transform: translateZ(calc(var(--d) / 2));
    box-shadow:
      0 0 0 1px rgba(10,18,13,.82),
      0 5px 10px rgba(15,28,20,.16),
      inset 0 1px 2px rgba(255,255,255,.42),
      inset 0 -1px 2px rgba(0,0,0,.7);
  }

  .bezel {
    position: absolute;
    inset: 3px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: calc(var(--corner) - 4px);
    background: #050908;
    box-shadow:
      inset 0 0 0 1px rgba(0,0,0,.72),
      0 0 0 1px rgba(255,255,255,.025);
    transform: translateZ(1px);
  }

  .screen {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: calc(var(--corner) - 6px);
    color: var(--screen-ink);
    background: var(--screen-bg);
  }

  /*
    The glass is a separate plane above the screen. Keeping it as a
    child of the front face gives the display a visible glass layer
    while the complete phone shell remains in a 3D context.
  */

  .glass {
    position: absolute;
    inset: 2px;
    z-index: 6;
    overflow: hidden;
    border-radius: calc(var(--corner) - 3px);
    pointer-events: none;
    background:
      linear-gradient(112deg,
        transparent 25%,
        rgba(255,255,255,.025) 36%,
        rgba(255,255,255,.18) 43%,
        rgba(255,255,255,.38) 47%,
        rgba(255,255,255,.09) 51%,
        transparent 62%),
      linear-gradient(155deg,
        rgba(255,255,255,.16) 0%,
        transparent 18% 72%,
        rgba(202,232,220,.09) 100%);
    background-size: 260% 100%, 100% 100%;
    background-position: var(--glass-pos, 72%) 0, 0 0;
    mix-blend-mode: screen;
    opacity: .82;
    transform: translateZ(1.7px);
  }

  .glass::before {
    position: absolute;
    inset: 0;
    content: '';
    border: 1px solid rgba(255,255,255,.23);
    border-top-color: rgba(255,255,255,.48);
    border-left-color: rgba(255,255,255,.31);
    border-radius: inherit;
    box-shadow:
      inset 0 0 12px rgba(255,255,255,.08),
      inset 0 1px 1px rgba(255,255,255,.16);
  }

  .glass::after {
    position: absolute;
    top: -24%;
    bottom: -24%;
    left: -72%;
    width: 56%;
    content: '';
    transform: skewX(-16deg);
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.19) 48%,
      rgba(255,255,255,.04),
      transparent
    );
    opacity: 0;
    animation: glass-shimmer 8.4s cubic-bezier(.36, 0, .2, 1) infinite;
  }

  .front-rim {
    position: absolute;
    inset: 0;
    z-index: 7;
    border: 1px solid rgba(255,255,255,.09);
    border-radius: inherit;
    pointer-events: none;
  }

  @keyframes glass-shimmer {
    0%, 42% {
      transform: translateX(0) skewX(-16deg);
      opacity: 0;
    }

    50% {
      opacity: .55;
    }

    72%, 100% {
      transform: translateX(310%) skewX(-16deg);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .glass::after {
      animation: none;
    }
  }
</style>