<script>
  import SystemStatusBar from './SystemStatusBar.svelte';
  import AppHeader from './AppHeader.svelte';
  import BottomNavigation from './BottomNavigation.svelte';
  import AssistantScreen from './screens/AssistantScreen.svelte';
  import Chat from './screens/Chat.svelte';
  import RecordsScreen from './screens/RecordsScreen.svelte';
  import ScanScreen from './screens/ScanScreen.svelte';
  import MedicinesScreen from './screens/MedicinesScreen.svelte';

  let { screen = 0 } = $props();
  // 0 assistant, 1 chat, 2 records, 3 scan, 4 medicines. Scan has no active tab.
  const activeNavigation = (value) => value === 0 || value === 1 ? 'assistant' : value === 2 ? 'records' : value === 4 ? 'medicines' : '';
</script>

<div class="patient-app" data-screen={screen}>
  <div class="screen-canvas">
  <SystemStatusBar />
  <AppHeader />
  {#if screen === 0}
    <AssistantScreen />
  {:else if screen === 1}
    <Chat />
  {:else if screen === 2}
    <RecordsScreen />
  {:else if screen === 3}
    <ScanScreen />
  {:else}
    <MedicinesScreen />
  {/if}
  <BottomNavigation active={activeNavigation(screen)} />
  </div>
</div>

<style>
  .patient-app { position:relative; width:100%; height:100%; min-height:0; overflow:hidden; aspect-ratio:945 / 2048; background:#eef2f3; color:#111819; isolation:isolate; }
  .screen-canvas { position:relative; width:100%; height:100%; overflow:hidden; container-type:inline-size; --u:0.10582cqw; font-family:Roboto,Arial,sans-serif; font-weight:300; }
</style>
