<template>
  <a-progress :percent="data"
              :show-info="false"
  />
</template>

<script setup lang="ts">
// import

// types & interfaces
import {computed} from 'vue'

type Props = {
  data: any,
}

// props & pinia
const props = defineProps<Props>()

// constants

// refs

// computed

// methods

// watch

// hooks
</script>

<style scoped lang="scss">
.block-item__input {
  height: 28px;
  margin-top: -4px;
}
</style>
