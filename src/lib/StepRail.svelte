<script>
  let { steps = [], active = 0, onselect = () => {} } = $props();
</script>

<nav class="rail" aria-label="Product highlights">
  {#each steps as label, i}
    <button
      type="button"
      class:active={i === active}
      aria-current={i === active ? 'step' : undefined}
      aria-label={`Show ${label}`}
      onclick={() => onselect(i)}
    >
      <span class="num">0{i + 1}</span>
      <span class="label">{label}</span>
      <span class="track"><span class="progress"></span></span>
    </button>
  {/each}
</nav>

<style>
  .rail { display: flex; flex-direction: column; gap: 8px; }
  button {
    appearance: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 8px 0;
    border: 0;
    color: var(--stage-muted);
    background: transparent;
    font-family: var(--font-body);
    cursor: pointer;
    opacity: .62;
    transition: opacity 180ms ease, color 180ms ease;
  }
  button:hover, button:focus-visible { opacity: 1; color: var(--stage-accent); outline: none; }
  button.active { opacity: 1; color: var(--stage-ink); }
  .num { font-size: 10px; font-weight: 700; letter-spacing: .08em; }
  .label { min-width: 68px; text-align: right; font-size: 12px; font-weight: 600; }
  .track { width: 24px; height: 4px; overflow: hidden; border-radius: 8px; background: rgba(79, 104, 96, .18); transition: width 260ms ease; }
  .progress { display: block; width: 0; height: 100%; border-radius: inherit; background: var(--stage-accent); transition: width 280ms cubic-bezier(.2,.8,.2,1); }
  button.active .track { width: 40px; }
  button.active .progress { width: 100%; }
  @media (max-width: 767px) { .rail { display: none; } }
</style>
