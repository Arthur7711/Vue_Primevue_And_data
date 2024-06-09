<template>
  <div class="grouping-select-div-all">
    <a-select
      class="grouping-select-div-all__select"
      v-model:value="value"
      placeholder="Select a person"
      :options="options"
      @change="handleChange"
    />
  </div>
</template>
<script setup lang="ts">
import type {SelectProps} from 'ant-design-vue'
import {onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {CHART_GROUPS} from '@/stores/allocation'
import {upperCaseFirstLetter} from '@/utils'

const route = useRoute()
const emit = defineEmits<{
  (e: 'selectGroupingUpdate', value: string): void
}>()
const value = ref('total')
const options = ref<SelectProps['options']>(
  CHART_GROUPS.map(group => ({
    value: group,
    label: group.split('_')
      .map(word => upperCaseFirstLetter(word))
      .join(' ')
  }))
)
const handleChange = (value: string) => {
  emit('selectGroupingUpdate', value)
}

watch(
  () => route.query.group_by,
  () => {
    value.value = route.query.group_by?.toString()
  },
  {deep: true}
)

onMounted(() => {
  const queryGrouping = route.query.group_by
  if (queryGrouping) {
    value.value = queryGrouping as string
  }
})
</script>

<style scoped lang="scss">
.grouping-select-div-all {
  &__select {
    color: $primary-text-default;
  }
}

:global(
    .ant-select-show-search.ant-select:not(.ant-select-customize-input)
      .ant-select-selector,

  ) {
  .ant-select-focused {
    @include Body-M-14-Regular;
    border: none;
    color: $primary-text-default;
  }
  border: none;
}

:global(
    .ant-select-focused:not(.ant-select-disabled).ant-select:not(
        .ant-select-customize-input
      )
      .ant-select-selector
  ) {
  box-shadow: none;
}

:global(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  border: none;
}

:global(.ant-select-arrow) {
  color: $primary-text-default;
}

:global(.ant-select-arrow) {
  &::after {
    margin-top: -5px !important;
  }
}

:global(.ant-select-dropdown) {
  width: 120px !important;
  overflow: hidden !important;
}
</style>
