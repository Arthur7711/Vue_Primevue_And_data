<template>
  <button class="info_icon_container">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="info_icon_container-svg"
        d="M9.99984 13.3346V10.0013M9.99984 6.66797H10.0082M18.3332 10.0013C18.3332 14.6037 14.6022 18.3346 9.99984 18.3346C5.39746 18.3346 1.6665 14.6037 1.6665 10.0013C1.6665 5.39893 5.39746 1.66797 9.99984 1.66797C14.6022 1.66797 18.3332 5.39893 18.3332 10.0013Z"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  active?: boolean
}>()
</script>

<style lang="scss">
.info_icon_container {
  border: none;
  background: none;
  &-svg {
    stroke: #576B8B;
  }

  &:active,
  &:focus,
  &:hover {
    border: none;
  background: none;
  outline: none;
  .info_icon_container-svg {
      stroke: black;
    }
  }
}
</style>
