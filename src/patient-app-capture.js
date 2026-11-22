import { mount } from 'svelte';
import PatientApp from './lib/PatientApp/PatientApp.svelte';
const names = { assistant:0, records:1, scan:2, medicines:3 };
const screen = names[new URLSearchParams(location.search).get('screen')] ?? 0;
mount(PatientApp, { target: document.getElementById('app'), props: { screen } });
