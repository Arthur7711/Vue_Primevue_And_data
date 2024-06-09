<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { type StyleValue } from 'vue'
import { type ILoaderProps } from './types'
import { LoaderHeight, LoaderWidth } from './functions'
const props = defineProps<ILoaderProps>() 
const st = (): StyleValue => {
  return {
    width: props.width ? LoaderWidth(props) : '20px',
    height: props.height ? LoaderHeight(props) : '20px',
    borderColor: props.out_color,
    borderBottomColor: props.in_color,
    maxHeight: '100%',
    maxWidth: '100%',
    borderWidth: props.line_width ? props.line_width + 'px' : '5px'
  }
}
</script>

<template>
  <div :style="st()" class="loader"></div>
</template>

<style scoped>
.loader {
  border: 5px solid #c5c3c3fd;
  border-bottom-color: #8a8a8a;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 2s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
