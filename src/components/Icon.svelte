<script lang="ts">
export let name: string
</script>

<svg class="{$$props.class}" width="1em" height="1em" fill="currentColor" stroke="currentColor">
  <use href="{`${process.env.NODE_ENV === 'development' ? 'main_window' : '.'}/assets/icons.svg#${name}`}"></use>
</svg>
