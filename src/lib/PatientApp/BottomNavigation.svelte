<script>
  let { active = 'assistant' } = $props();
  const items = [
    { id:'assistant', label:'Assistant' },
    { id:'records', label:'Records' },
    { id:'scan', label:'' },
    { id:'medicines', label:'Medicines' },
    { id:'profile', label:'Profile' }
  ];
</script>

<nav class="bottom-navigation" aria-label="Patient app navigation">
  {#each items as item}
    {#if item.id === 'scan'}
      <div class="nav-item qr-item" aria-label="Scan a clinic QR code">
        <span class="qr-icon">
          <svg viewBox="0 0 54 54" aria-hidden="true"><path d="M5 5h17v17H5zM32 5h17v17H32zM5 32h17v17H5z" fill="none" stroke="currentColor" stroke-width="5"/><path d="M11 11h5v5h-5zM38 11h5v5h-5zM11 38h5v5h-5zM31 31h6v6h-6zM42 31h7v7h-7zM31 42h6v7h-6zM42 43h7v6h-7z" fill="currentColor"/></svg>
        </span>
      </div>
    {:else}
      <div class="nav-item" class:active={active === item.id}>
        <span class="nav-icon">
          {#if item.id === 'assistant'}
            <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 8.5h32a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H21l-10 7v-7H8a4 4 0 0 1-4-4v-20a4 4 0 0 1 4-4Z" fill="currentColor"/></svg>
          {:else if item.id === 'records'}
            <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M11 4h18l10 10v29H11z" fill="currentColor"/><path d="M29 4v11h10M17 25h15M17 32h15" fill="none" stroke="#fff" stroke-width="2.7" stroke-linecap="round"/></svg>
          {:else if item.id === 'medicines'}
            <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 17h34l-3 27H10zM13 11h22l-1.5 6h-19zM30 4l-3 9" fill="currentColor"/><path d="M24 23v13M17.5 29.5h13" stroke="#fff" stroke-width="3.3" stroke-linecap="round"/></svg>
          {:else}
            <svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="13" r="8" fill="currentColor"/><path d="M7 42c.6-10.2 7-16 17-16s16.4 5.8 17 16z" fill="currentColor"/></svg>
          {/if}
        </span>
        <span class="nav-label">{item.label}</span>
      </div>
    {/if}
  {/each}
</nav>

<div class="system-navigation" aria-hidden="true">
  <svg class="recent" viewBox="0 0 32 32"><path d="M4 8h24M4 16h24M4 24h24"/></svg>
  <svg class="home" viewBox="0 0 32 32"><rect x="5" y="4" width="22" height="24" rx="5"/></svg>
  <svg class="back" viewBox="0 0 32 32"><path d="M26 4 5 16l21 12z"/></svg>
</div>

<style>
  .bottom-navigation { position:absolute; z-index:6; left:calc(42 * var(--u)); right:calc(42 * var(--u)); bottom:calc(143 * var(--u)); height:calc(168 * var(--u)); display:flex; align-items:center; justify-content:space-around; padding:calc(13 * var(--u)) calc(14 * var(--u)); border:1px solid #e1e6e7; border-radius:calc(100 * var(--u)); background:rgba(255,255,255,.97); box-shadow:0 calc(15 * var(--u)) calc(28 * var(--u)) rgba(20,42,42,.18),0 calc(3 * var(--u)) calc(7 * var(--u)) rgba(20,42,42,.08); }
  .nav-item { flex:1; max-width:calc(160 * var(--u)); height:calc(140 * var(--u)); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:calc(5 * var(--u)); color:#5e6b6b; border-radius:calc(72 * var(--u)); }
  .nav-item.active { color:#237d7b; background:#e3eeee; }
  .nav-icon { width:calc(52 * var(--u)); height:calc(51 * var(--u)); display:grid; place-items:center; }
  .nav-icon svg { width:calc(49 * var(--u)); height:calc(49 * var(--u)); }
  .nav-label { font-family:Roboto,Arial,sans-serif; font-size:calc(26 * var(--u)); line-height:1.05; font-weight:400; white-space:nowrap; }
  .qr-item { flex:0 0 calc(126 * var(--u)); width:calc(126 * var(--u)); height:calc(126 * var(--u)); align-self:center; margin:0 calc(2 * var(--u)); padding:0; border-radius:50%; background:#207e7c; color:white; box-shadow:inset 0 0 0 calc(2 * var(--u)) rgba(255,255,255,.18); }
  .qr-icon { display:grid; place-items:center; width:100%; height:100%; }
  .qr-icon svg { width:calc(56 * var(--u)); height:calc(56 * var(--u)); }
  .system-navigation { position:absolute; z-index:7; bottom:0; left:0; right:0; height:calc(112 * var(--u)); display:flex; align-items:center; justify-content:space-evenly; background:#fff; color:#9ca2a2; }
  .system-navigation svg { width:calc(34 * var(--u)); height:calc(34 * var(--u)); fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
  .system-navigation .home { width:calc(32 * var(--u)); height:calc(32 * var(--u)); }
  .system-navigation .back { width:calc(34 * var(--u)); height:calc(34 * var(--u)); }
</style>
