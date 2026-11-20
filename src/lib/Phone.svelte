<script>
  let { children, depth = 14, layers = 7 } = $props();
</script>

<div class="phone" style="--d:{depth}px">
  {#each Array(layers) as _, i}
    <div class="slice" style="transform: translateZ({(i / (layers - 1) - 0.5) * (depth - 2)}px)"></div>
  {/each}

  <div class="face front">
    <div class="screen">{@render children?.()}</div>
  </div>

  <div class="face back">
    <div class="camera"></div>
  </div>
</div>

<style>
  .phone {
    position: relative;
    width: var(--phone-w);
    aspect-ratio: 9 / 19;
    transform-style: preserve-3d; /* no overflow, filter or will-change on this element */
  }
  .slice,
  .face {
    position: absolute;
    inset: 0;
    border-radius: 40px;
    box-sizing: border-box;
  }
  .slice { background: #1a1a19; }
  .face {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden; /* fine here, faces have no 3D children */
  }
  .front {
    border: 8px solid #1a1a19;
    background: var(--screen-bg);
    transform: translateZ(calc(var(--d) / 2));
  }
  .back {
    background: #2a2a28;
    transform: rotateY(180deg) translateZ(calc(var(--d) / 2));
  }
  .screen { width: 100%; height: 100%; color: var(--screen-ink); }
  .camera {
    position: absolute; top: 18px; left: 18px;
    width: 64px; height: 64px; border-radius: 18px;
    background: #1a1a19;
  }
</style>