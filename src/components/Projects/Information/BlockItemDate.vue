<template>
  <a-date-picker
    v-show="showInput"
    v-model:value="modelValue"
    :bordered="false"
    format="MMM, DD YYYY"
    @blur="emit('custom-blur')"
    class="block-item__date-picker"
  />
  <div class="block-item__placeholder" v-show="!showInput" @click="emit('custom-click')">
    <span v-if="!modelValue">{{ props.placeholder }}</span>
    <DateParser v-else :date="modelValue" :format="dateShort ? 'MMM DD' : 'MMM DD, YYYY'"/>
  </div>
</template>

<script setup lang="ts">
// import

// types & interfaces
import {computed} from 'vue'

type Props = {
  modelValue: any
  showInput: boolean
  placeholder: string,
  dateShort?: boolean
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
.block-item__date-picker {
  height: 28px;
  margin-top: -4px;
}
</style>
