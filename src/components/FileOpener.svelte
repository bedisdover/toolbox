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

<button
  class="inline-flex items-center bg-slate-500"
  on:click="{() => {
    openCallback = onOpen
    ipcRenderer.send('open-file', { type, multiple })
  }}">
  选择文件夹
</button>
