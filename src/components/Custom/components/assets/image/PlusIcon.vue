<script setup lang="ts">
defineProps<{
  color?: string
}>()
</script>

<template>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    :fill="color ? color : 'none'"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1V15M1 8H15"
      :stroke="color ? color : 'white'"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
