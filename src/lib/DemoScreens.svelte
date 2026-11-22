<script>
  import PatientApp from './PatientApp/PatientApp.svelte';
  let { index = 0 } = $props();
</script>

<PatientApp screen={index} />
