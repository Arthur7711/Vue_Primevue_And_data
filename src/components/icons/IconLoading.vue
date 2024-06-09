<template>
  <LoadingIcon class="loading-icon"/>
</template>

<script setup lang="ts">
import { LoadingIcon } from 'mdi-vue3'
</script>

<style scoped lang="scss">
.loading-icon {
  animation: loadingCircle 1s infinite linear;
}
</style>
