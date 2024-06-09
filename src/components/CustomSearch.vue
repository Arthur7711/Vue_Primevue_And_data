<template>
  <div class="custom-search">
    <div class="custom-search__title">{{ props.selectTitle }}</div>
    <a-input v-model:value="modelValue" class="custom-search__input" placeholder="Search">
      <template #prefix><IconSearch /></template>
    </a-input>

  </div>
</template>

<script setup lang="ts">
// import
import { computed } from 'vue'

// props & pinia
const props = defineProps(['options', 'selectTitle', 'modelValue'])
const emit = defineEmits(['update:modelValue'])

// constants

// refs

// computed
const modelValue = computed({
  get() { return props.modelValue },
  set(value) { emit('update:modelValue', value) }
})

// methods

// watch

// hooks
</script>

<style scoped lang="scss">
.custom-search {

  &__title {
    @include Body-M;
    color: $neutrals-text-secondary;
  }

  &__input {
    width: 100%;
  }
}
</style>