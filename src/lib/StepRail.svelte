<script>
  let { steps = [], active = 0, onselect = () => {} } = $props();
</script>

<nav class="rail" aria-label="Features">
  {#each steps as label, i}
    <button
      class:active={i === active}
      aria-current={i === active ? 'step' : undefined}
      onclick={() => onselect(i)}
    >
      <span class="num">0{i + 1}</span>
      <span class="label">{label}</span>
      <span class="dot"></span>
    </button>
  {/each}
</nav>

<style>
  .rail { display: flex; flex-direction: column; gap: 6px; }

  button {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--muted);
    font-family: var(--font);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 7px 0;
    cursor: pointer;
    opacity: 0.42;
    transition: opacity 0.35s ease, color 0.35s ease;
  }

  button:hover,
  button:focus-visible { opacity: 0.85; outline: none; }
  button.active { opacity: 1; color: #fff; }

  .num { font-size: 9px; font-weight: 800; letter-spacing: 0.08em; }

  .label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  .dot {
    width: 22px;
    height: 2px;
    border-radius: 2px;
    background: currentColor;
    transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  button.active .dot { width: 42px; }

  @media (max-width: 767px) { .rail { display: none; } }
</style>
