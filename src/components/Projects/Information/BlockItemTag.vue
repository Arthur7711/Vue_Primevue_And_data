<template>
  <a-select v-show="showInput"
            v-model:value="modelValue"
            :bordered="false"
            :max-tag-count="2"
            class="block-item__tag"
            :class="classes"
            mode="tags"
            size="small"
            @blur="emit('custom-blur')"
  />
  <div v-show="!showInput">
    <a-tooltip placement="top">
      <template #title>
        <span v-if="modelValue?.length">{{ modelValue }}</span>
        <span v-else>{{ placeholder }}</span>
      </template>
      <div class="block-item__placeholder" @click="emit('custom-click')">
        <span v-if="modelValue?.length">{{ modelValue }}</span>
        <span v-else>{{ placeholder }}</span>
      </div>
    </a-tooltip>
  </div>
</template>

<script lang="ts" setup>
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
const classes = computed(() => ({
  'block-item__tag_one': modelValue.value?.length === 1,
  'block-item__tag_two': modelValue.value?.length === 2,
}))

// methods

// watch

// hooks
</script>

<style lang="scss" scoped>
.block-item__tag {
  width: 100%;
  height: 28px;
  margin-top: -4px;
  
  &:deep(.ant-select-selection-overflow-item) {
    max-width: 33%;
  }
  &_one:deep(.ant-select-selection-overflow-item) {
    max-width: 100%;
  }
  &_two:deep(.ant-select-selection-overflow-item) {
    max-width: 50%;
  }
  &:deep(.ant-select-selection-item) {
    height: 20px;
  }
}
</style>
