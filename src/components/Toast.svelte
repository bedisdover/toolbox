<script context="module" lang="ts">
import { flip } from 'svelte/animate'
import { fly } from 'svelte/transition'
import { writable } from 'svelte/store'

const themes = {
  error: 'bg-red-400 shadow-red-400/50',
  success: 'bg-green-400 shadow-green-400/50',
  waring: 'bg-orange-400 shadow-orange-400/50',
  info: 'bg-cyan-400 shadow-cyan-400/50',
} as const

const notifications = writable([])

export function Toast() {}

function add(msg: string, type: keyof typeof themes) {
  const id = new Date().getTime()
  notifications.update((state) => [...state, { id, msg, type }])
  setTimeout(() => {
    notifications.update((state) => state.filter((n) => n.id !== id))
  }, 3000)
}

Object.keys(themes).forEach((key: keyof typeof themes) => {
  Toast[key] = (msg: string) => add(msg, key)
})
</script>

<div class="fixed right-0 bottom-8 left-0 m-auto z-50 flex flex-col items-center text-center text-white">
  {#each $notifications as n (n.id)}
    <div animate:flip class="{`mb-2 p-3 leading-none rounded-lg shadow-lg ${themes[n.type]}`}" in:fly="{{ y: 30 }}">
      {n.msg}
    </div>
  {/each}
</div>
