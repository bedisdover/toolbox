<style>
.slider {
  position: relative;
  width: 45px;
  height: 25px;
  background-color: #ccc;
  border-radius: 100px;
  transition: all 300ms ease;
}

.knob {
  position: absolute;
  width: calc(25px - 6px);
  height: calc(25px - 6px);
  left: 3px;
  top: 3px;
  background-color: #fff;
  border-radius: 50%;
  transition: all 300ms ease;
}

input:checked + .slider {
  background-color: #44cc66;
}

input:checked + .slider .knob {
  left: calc(100% - 19px - 3px);
}
</style>

<script>
export let label
export let checked = true
export let onChange
</script>

<label class="flex items-center cursor-pointer select-none">
  <input type="checkbox" class="hidden" bind:checked on:click="{(e) => onChange?.(e.target.checked)}" />
  <span class="slider">
    <span class="knob"></span>
  </span>
  <span class="ml-1.5">{label}</span>
</label>
