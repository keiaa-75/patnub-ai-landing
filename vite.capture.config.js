import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
export default defineConfig({
  plugins:[svelte()],
  build:{
    outDir:'dist-capture',
    emptyOutDir:true,
    cssCodeSplit:false,
    rollupOptions:{
      input:resolve(process.cwd(),'patient-app-capture.html'),
      output:{inlineDynamicImports:true}
    }
  }
})
