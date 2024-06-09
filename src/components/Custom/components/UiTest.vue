<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Button } from '../index'
const test = ref(false)
function testest() {
  setInterval(() => {
    test.value = !test.value
  }, 3000)
}
onMounted(() => {
  testest()
})
</script>

<template>
  <div style="margin-top: 30vh; width: 150px">
    <Button :size="'xl'" :is-update="test" :color-scheme="'primary'" :icon_side="'right'"
      ><template #content>Submit</template></Button
    >
  </div>
</template>

<style lang="scss"></style>
..
