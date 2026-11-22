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

    <!-- Individual raised camera rings; no shared camera island. -->
    <div class="camera-array" aria-hidden="true">
      <span class="camera-module main-lens lens-one">
        <span class="camera-glass"></span>
      </span>
      <span class="camera-module main-lens lens-two">
        <span class="camera-glass"></span>
      </span>
      <span class="camera-module main-lens lens-three">
        <span class="camera-glass"></span>
      </span>
      <span class="camera-module small-lens lens-four">
        <span class="camera-glass"></span>
      </span>
      <span class="camera-module small-lens lens-five">
        <span class="camera-glass"></span>
      </span>
      <span class="camera-flash"></span>
    </div>
  </div>

  <!-- Left and right side rails. -->
  <div class="edge edge-left" aria-hidden="true">
    <span class="antenna antenna-top"></span>
    <span class="antenna antenna-bottom"></span>
  </div>

  <div class="edge edge-right" aria-hidden="true">
    <span class="side-button volume-rocker">
      <span class="rocker-seam"></span>
    </span>
    <span class="side-button power-button"></span>
    <span class="antenna antenna-top"></span>
    <span class="antenna antenna-bottom"></span>
  </div>

  <!-- Top and bottom rails. -->
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
      Those grouping properties can flatten the 3D descendants.
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

  /*
    Individual camera rings sit directly on the rear panel.
    There is no shared raised camera island.
  */

  .camera-array {
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
  }

  .camera-module {
    position: absolute;
    display: block;
    aspect-ratio: 1;
    border: 1px solid rgba(55, 65, 58, .76);
    border-radius: 50%;
    background:
      radial-gradient(circle,
        #071012 0 42%,
        #1e3034 44% 49%,
        #59665f 51% 55%,
        #e5eae5 58% 64%,
        #87938b 67% 72%,
        #e8ece7 75% 79%,
        #647168 83% 89%,
        #c6cec7 93% 100%);
    box-shadow:
      0 2px 4px rgba(23, 32, 26, .32),
      0 0 0 1px rgba(255, 255, 255, .58),
      inset 0 1px 1px rgba(255, 255, 255, .9),
      inset 0 -2px 3px rgba(27, 38, 30, .32);
  }

  .camera-module::before {
    position: absolute;
    inset: 7%;
    content: '';
    border: 1px solid rgba(34, 45, 39, .68);
    border-radius: 50%;
    box-shadow:
      inset 0 1px 2px rgba(0, 0, 0, .72),
      0 0 0 1px rgba(255, 255, 255, .45);
    pointer-events: none;
  }

  .camera-glass {
    position: absolute;
    inset: 19%;
    display: block;
    overflow: hidden;
    border: 1px solid rgba(4, 11, 13, .95);
    border-radius: 50%;
    background:
      radial-gradient(circle at 31% 25%,
        rgba(190, 222, 222, .9) 0 3%,
        rgba(91, 126, 130, .8) 7%,
        transparent 17%),
      radial-gradient(circle at 50% 55%,
        #020607 0 43%,
        #13272c 57%,
        #061014 75%,
        #010405 100%);
    box-shadow:
      inset 0 0 4px 1px rgba(0, 0, 0, .92),
      inset 0 1px 2px rgba(202, 235, 232, .2),
      0 0 0 1px rgba(15, 27, 28, .7);
  }

  .camera-glass::before {
    position: absolute;
    top: 13%;
    left: 18%;
    width: 29%;
    height: 12%;
    content: '';
    transform: rotate(-38deg);
    border-radius: 50%;
    background: rgba(218, 242, 238, .52);
    filter: blur(.6px);
  }

  .main-lens {
    width: clamp(22px, calc(var(--phone-w) * .195), 56px);
  }

  .small-lens {
    width: clamp(17px, calc(var(--phone-w) * .145), 42px);
  }

  /* Three larger lenses form the left column. */

  .lens-one {
    left: 18.8%;
    top: 9.8%;
    transform: translate(-50%, -50%);
  }

  .lens-two {
    left: 18.8%;
    top: 20.9%;
    transform: translate(-50%, -50%);
  }

  .lens-three {
    left: 18.8%;
    top: 32%;
    transform: translate(-50%, -50%);
  }

  /* Two smaller camera modules form the right column. */

  .lens-four {
    left: 40.5%;
    top: 9.8%;
    transform: translate(-50%, -50%);
  }

  .lens-five {
    left: 40.5%;
    top: 20.9%;
    transform: translate(-50%, -50%);
  }

  .camera-flash {
    position: absolute;
    left: 40.5%;
    top: 15.4%;
    width: clamp(6px, calc(var(--phone-w) * .043), 13px);
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(120, 125, 108, .65);
    border-radius: 50%;
    background:
      radial-gradient(circle,
        #fffdf0 0 34%,
        #f6edc8 48%,
        #c9c9b2 70%,
        #788179 100%);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, .68),
      0 1px 3px rgba(28, 35, 29, .34),
      0 0 5px rgba(255, 245, 211, .42);
  }

  /* ---------------------------
     Titanium perimeter rails
  --------------------------- */

  .edge {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    overflow: visible;
    border: 1px solid rgba(48, 59, 51, .72);
    background-clip: padding-box;
    box-shadow:
      inset 0 1px 1px rgba(255,255,255,.62),
      inset 0 -1px 1px rgba(23,34,27,.42),
      0 0 0 .35px rgba(255,255,255,.12);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  /*
    The side rails use a layered satin-titanium finish:
    a dark outer arris, a broad brushed center, and a narrow
    polished highlight toward the front glass edge.
  */

  .edge-left,
  .edge-right {
    top: calc(var(--corner) - .2px);
    width: var(--d);
    height: calc(100% - var(--corner) - var(--corner) + .4px);
    margin-left: calc(var(--d) / -2);
    border-radius: 2px;
    background-size: 100% 100%, 100% 100%;
  }

  .edge-left {
    transform: rotateY(-90deg) translateZ(calc(var(--phone-w) / 2));
    background-image:
      repeating-linear-gradient(90deg,
        rgba(255,255,255,.035) 0 .45px,
        rgba(28,38,31,.025) .45px 1px,
        transparent 1px 2.8px),
      linear-gradient(90deg,
        #424d45 0%,
        #78847b 7%,
        #dce3dd 17%,
        #b5c0b8 31%,
        #849188 52%,
        #d4dcd5 73%,
        #77847b 91%,
        #465148 100%);
  }

  .edge-right {
    transform: rotateY(90deg) translateZ(calc(var(--phone-w) / 2));
    background-image:
      repeating-linear-gradient(90deg,
        rgba(255,255,255,.04) 0 .45px,
        rgba(28,38,31,.025) .45px 1px,
        transparent 1px 2.8px),
      linear-gradient(90deg,
        #3f4942 0%,
        #6e7a71 8%,
        #d6ded7 18%,
        #aab6ad 34%,
        #7e8b82 54%,
        #dce4dd 76%,
        #748077 91%,
        #414c44 100%);
  }

  /*
    A moving, low-contrast highlight is driven by Hero's --sheen
    value. It gives the narrow side faces a changing light catch
    during rotation without adding a second animation system.
  */

  .edge-left::before,
  .edge-right::before {
    position: absolute;
    inset: 0;
    content: '';
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,.035) 20%,
      rgba(255,255,255,.13) calc(var(--sheen, 50%) - 13%),
      rgba(255,255,255,.48) var(--sheen, 50%),
      rgba(255,255,255,.12) calc(var(--sheen, 50%) + 12%),
      transparent 100%);
    mix-blend-mode: screen;
    opacity: .72;
  }

  /* Fine front/rear arris lines make the rail read as a machined slab. */

  .edge-left::after,
  .edge-right::after {
    position: absolute;
    inset: 1px 0;
    content: '';
    pointer-events: none;
    background: linear-gradient(90deg,
      rgba(20,29,23,.52) 0 1px,
      rgba(255,255,255,.34) 1px 1.7px,
      transparent 1.7px calc(100% - 1.7px),
      rgba(255,255,255,.42) calc(100% - 1.7px) calc(100% - 1px),
      rgba(20,29,23,.44) calc(100% - 1px) 100%);
    opacity: .78;
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
    background:
      repeating-linear-gradient(0deg,
        rgba(255,255,255,.045) 0 .45px,
        transparent .45px 2.8px),
      linear-gradient(180deg,
        #465148 0%,
        #dbe2dc 16%,
        #aeb9b1 42%,
        #e1e7e2 73%,
        #59655d 100%);
  }

  .edge-bottom {
    transform: rotateX(-90deg) translateZ(calc(var(--phone-height) / 2));
    background:
      repeating-linear-gradient(0deg,
        rgba(255,255,255,.04) 0 .45px,
        transparent .45px 2.8px),
      linear-gradient(180deg,
        #4b564e 0%,
        #dce4dd 18%,
        #9eaaa1 48%,
        #d8e0d9 82%,
        #4b564e 100%);
  }

  .edge-top::before,
  .edge-bottom::before {
    position: absolute;
    inset: 0;
    content: '';
    pointer-events: none;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(255,255,255,.08) 22%,
      rgba(255,255,255,.35) 50%,
      rgba(255,255,255,.06) 78%,
      transparent 100%);
    opacity: .7;
  }

  .edge-top::after,
  .edge-bottom::after {
    position: absolute;
    inset: 0 1px;
    content: '';
    pointer-events: none;
    background: linear-gradient(180deg,
      rgba(20,29,23,.48) 0 1px,
      rgba(255,255,255,.34) 1px 1.6px,
      transparent 1.6px calc(100% - 1.6px),
      rgba(255,255,255,.36) calc(100% - 1.6px) calc(100% - 1px),
      rgba(20,29,23,.42) calc(100% - 1px) 100%);
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

  /* ---------------------------
     Side buttons and antenna bands
  --------------------------- */

  /*
    The button housing is a recessed dark well. Its inset cap is a
    separate polished surface, so the controls look machined into
    the frame rather than painted onto the side.
  */

  .side-button {
    position: absolute;
    left: 50%;
    display: block;
    width: clamp(8px, calc(var(--d) * .48), 10px);
    box-sizing: border-box;
    transform: translateX(-50%) translateZ(1.05px);
    border: 1px solid rgba(31, 41, 34, .88);
    border-radius: 4px;
    background: linear-gradient(90deg,
      #252f29 0%,
      #5a665d 22%,
      #303b34 54%,
      #202a24 100%);
    box-shadow:
      inset 0 1px 2px rgba(0,0,0,.78),
      inset 0 -1px 1px rgba(255,255,255,.17),
      0 0 0 .5px rgba(255,255,255,.2);
  }

  .side-button::before {
    position: absolute;
    inset: 1px;
    content: '';
    border: 1px solid rgba(255,255,255,.5);
    border-radius: 2.5px;
    background: linear-gradient(90deg,
      #87938a 0%,
      #f1f4ef 28%,
      #c5cec7 55%,
      #718077 100%);
    box-shadow:
      inset 0 1px 1px rgba(255,255,255,.8),
      inset 0 -1px 1px rgba(48,60,51,.35),
      0 0 .6px rgba(255,255,255,.65);
    transform: translateZ(.45px);
  }

  .volume-rocker {
    top: 19%;
    height: clamp(34px, calc(var(--phone-height) * .105), 62px);
    border-radius: 5px;
  }

  .volume-rocker::before {
    border-radius: 3.5px;
  }

  .rocker-seam {
    position: absolute;
    z-index: 2;
    top: 50%;
    right: 1px;
    left: 1px;
    height: 1px;
    transform: translateZ(.8px);
    background: rgba(43, 54, 46, .78);
    box-shadow: 0 1px 0 rgba(255,255,255,.62);
    pointer-events: none;
  }

  .power-button {
    top: 36%;
    height: clamp(25px, calc(var(--phone-height) * .073), 42px);
    border-radius: 4px;
  }

  .power-button::before {
    border-radius: 2.5px;
  }

  /*
    Antenna breaks are narrow, dark channels with a bright upper
    arris. Their width crosses the whole rail so the metal appears
    interrupted rather than carrying a floating painted line.
  */

  .antenna {
    position: absolute;
    z-index: 3;
    display: block;
    border: 0;
    border-radius: 2px;
    pointer-events: none;
    background: linear-gradient(180deg,
      rgba(255,255,255,.8) 0%,
      #758178 20%,
      #354139 49%,
      #465249 72%,
      rgba(255,255,255,.58) 100%);
    box-shadow:
      0 0 0 .5px rgba(27,37,30,.48),
      0 1px 0 rgba(255,255,255,.48);
  }

  .edge-left .antenna,
  .edge-right .antenna {
    left: -1px;
    width: calc(100% + 2px);
    height: 2.6px;
  }

  .edge-top .antenna,
  .edge-bottom .antenna {
    top: -1px;
    width: 2.6px;
    height: calc(100% + 2px);
    background: linear-gradient(90deg,
      rgba(255,255,255,.78) 0%,
      #758178 20%,
      #354139 49%,
      #465249 72%,
      rgba(255,255,255,.58) 100%);
  }

  .antenna-top { top: 12%; }
  .antenna-bottom { bottom: 12%; }
  .antenna-left { left: 13%; }
  .antenna-right { right: 13%; }

  /* Top rail microphones */

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

  /* Bottom rail: USB-C, speakers, and microphone. */

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