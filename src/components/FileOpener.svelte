<script context="module">
import { ipcRenderer } from 'electron'

let openCallback
ipcRenderer.on('open-file-res', (_, data) => openCallback?.(data))
</script>

<script lang="ts">
export let type: 'file' | 'dir' = 'dir'
export let multiple = false
export let onOpen: (files: string[]) => void
</script>

<div
  class="cursor-pointer"
  on:click="{() => {
  openCallback = onOpen
  ipcRenderer.send('open-file', { type, multiple })
}}">
  <slot />
</div>
