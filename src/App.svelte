<script lang="ts">
import fs from 'fs'
import path from 'path'
import { shell } from 'electron'
import { scale } from 'svelte/transition'
import Icon from './components/Icon.svelte'
import Checkbox from './components/Checkbox.svelte'
import FileOpener from './components/FileOpener.svelte'
import ToastComponent, { Toast } from './components/Toast.svelte'

let dirs: string[] = []
let names = ''
const options = {
  matchWords: false,
  ignoreCase: false,
}
let target = ''
let error = false
let btnClass = ''

$: if (dirs.length === 1 && !target) {
  target = `${dirs[0]}_copy`
}

function addDirs(list: string[] | FileList) {
  const filtered: string[] = []
  for (const f of list) {
    const path = typeof f === 'string' ? f : f.path
    if (fs.lstatSync(path).isDirectory() && !dirs.includes(path)) {
      filtered.push(path)
    }
  }
  dirs = dirs.concat(filtered)
}

function submit() {
  error = !names
  if (error) {
    btnClass = 'error'
    Toast.error('文件名不能为空')
    return
  }

  try {
    fs.mkdirSync(target, { recursive: true })

    const files = names.trim().replaceAll(/\s+/g, '|')
    const reg = new RegExp(options.matchWords ? `^${files}$` : files, options.ignoreCase ? 'i' : '')

    for (const dir of dirs) {
      const ret = fs.readdirSync(dir).filter((file) => {
        const name = path.parse(file).name
        return reg.test(name)
      })

      ret.forEach((item) => {
        fs.copyFileSync(dir + '/' + item, target + '/' + item)
      })
    }
    alert('选择结束')
  } catch (e) {
    alert('出错啦 (:')
  }
}
</script>

<div class="h-100 overflow-auto grid gap-x-8 gap-y-3" style="grid-template-columns: max-content 1fr">
  <div class="label">文件夹</div>
  <div
    class="p-6 flex flex-col justify-center items-center border-2 border-gray-700 border-dashed rounded"
    on:dragover|preventDefault|stopPropagation
    on:drop|preventDefault|stopPropagation="{(e) => {
      addDirs(e.dataTransfer.files)
    }}">
    <FileOpener multiple onOpen="{addDirs}" />
    <div class="mt-1.5 text-sm text-gray-400 italic">或将文件夹拖放到此处</div>

    <div class="flex flex-wrap justify-center space-x-2">
      {#each dirs as d (d)}
        <div
          class="group relative mt-2 px-4 py-2 text-center overflow-hidden border border-gray-300 rounded cursor-pointer transition-all hover:bg-rose-400"
          out:scale
          on:click="{() => {
            dirs = dirs.filter((dir) => dir !== d)
          }}"
          on:keydown="{() => {}}">
          <span class="block transition-all group-hover:translate-y-12">
            {path.basename(d)}
          </span>

          <Icon
            name="delete"
            class="absolute w-full -top-full left-0 text-white -translate-y-1/2 transition-all group-hover:top-1/2" />
        </div>
      {/each}
    </div>
  </div>

  <label for="names">文件名</label>
  <textarea
    id="names"
    rows="8"
    class:error="{error}"
    placeholder="输入文件名，多个用空格或换行分隔"
    bind:value="{names}"
    on:input="{() => (error = false)}"></textarea>

  <div class="col-start-2 flex space-x-4">
    <div class="label">选项</div>
    <div class="flex space-x-4">
      <Checkbox
        label="精确匹配"
        checked="{options.matchWords}"
        onChange="{(checked) => {
          options.matchWords = checked
        }}" />
      <Checkbox
        label="忽略大小写"
        checked="{options.ignoreCase}"
        onChange="{(checked) => {
          options.ignoreCase = checked
        }}" />
    </div>
  </div>

  <div class="col-start-2 flex space-x-4">
    <div class="label">目标位置</div>
    <div class="flex items-center">
      <FileOpener onOpen="{(dir) => (target = dir)}" />
      <span class="ml-2">{target}</span>
    </div>
  </div>

  <button
    class="mt-8 col-start-2 justify-self-end {btnClass}"
    style="background: #1c69cd"
    on:click="{submit}"
    on:animationend="{() => {
      btnClass = ''
    }}">立即选择</button>
</div>

<div
  class="absolute left-0 right-0 bottom-8 flex items-center justify-center cursor-pointer text-sm text-sky-500 hover:text-red-500"
  on:click="{() => {
    shell.openExternal('https://space.bilibili.com/47334509')
  }}"
  on:keydown="{() => {}}">
  <Icon name="bilibili" class="mr-1.5 mr-0.5 text-lg" />
  _NicoleLiu 修图教程 | 摄影分享 | 工具使用 | 点击了解更多
</div>

<ToastComponent />
