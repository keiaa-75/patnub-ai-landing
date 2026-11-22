
<script>
  import Hero from './lib/Hero.svelte';
  import Clinicians from './Clinicians.svelte';

  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const isCliniciansRoute = pathname === '/clinicians';
</script>

<svelte:head>
  {#if !isCliniciansRoute}
    <meta name="color-scheme" content="light" />
    <title>patnub.ai | Care that stays with you.</title>
  {/if}
</svelte:head>

{#if isCliniciansRoute}
  <Clinicians />
{:else}
  <main id="top">
    <Hero />
  </main>
{/if}
