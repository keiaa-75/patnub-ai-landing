<script>
  import Hero from './lib/Hero.svelte';
</script>

<main>
  <Hero />

  <!-- Temporary: gives you scroll room after the hero so you can see it release -->
  <div class="after"></div>
</main>

<style>
  .after { height: 100vh; background: var(--green); }
</style>