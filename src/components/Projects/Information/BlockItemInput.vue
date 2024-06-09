<template>
  <a-input v-show="showInput"
           v-model:value="modelValue"
           compact
           @blur="emit('custom-blur')"
           class="block-item__input"
  />
  <div v-show="!showInput">
    <a-tooltip placement="top">
      <template #title>
        <span v-if="modelValue">{{ modelValue }}</span>
        <span v-else>{{ placeholder }}</span>
      </template>
      <div class="block-item__placeholder" @click="emit('custom-click')">
        <span v-if="modelValue">{{ modelValue }}</span>
        <span v-else>{{ placeholder }}</span>
      </div>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
// import

// types & interfaces
import {computed} from 'vue'

type Props = {
  modelValue: any
  showInput: boolean
  placeholder: string
}

// props & pinia
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'custom-click', 'custom-blur'])

// constants

// refs

// computed
const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

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
