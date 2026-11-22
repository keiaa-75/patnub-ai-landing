import { mount } from 'svelte';
import PatientApp from './lib/PatientApp/PatientApp.svelte';
const names = { assistant:0, chat:1, records:2, scan:3, medicines:4 };
const screen = names[new URLSearchParams(location.search).get('screen')] ?? 0;
mount(PatientApp, { target: document.getElementById('app'), props: { screen } });
