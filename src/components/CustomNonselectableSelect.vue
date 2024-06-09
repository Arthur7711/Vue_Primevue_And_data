<script setup lang="ts">
defineProps<{
  title: string | number;
  value: string | number;
  options: { label?: string | number; value?: string | number }[];
  showCounts?: boolean;
}>();
</script>
<template>
  <div class="non-selectable">
    <div class="non-selectable__static">
      <h3>{{ title }}</h3>
      <p>{{ value }}</p>
    </div>
    <a-select style="width: 250px">
      <a-select-option
        v-for="option of options"
        :value="option.value"
        disabled
        class="none_selectable_options"
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 200;
          "
        >
          <p>{{ option.label }}</p>
          <p v-if="showCounts">{{ option.value }}</p>
        </div>
      </a-select-option>
    </a-select>
  </div>
</template>
<style scoped lang="scss">
.non-selectable {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none !important;
  padding: 0px !important;
  &__static {
    display: flex;
    flex-direction: column;
    h3 {
      color: $neutrals-text-secondary;
      font-size: 14px;
      line-height: 20px;
      border: none;
      white-space: nowrap;
    }
    p {
      color: $neutrals-text-primary;
      font-size: 22px;
      font-weight: 700;
      line-height: 24px;
      white-space: nowrap;
    }
  }
  &:deep {
    .ant-select-show-arrow {
      border: none !important;
      .ant-select-selector {
        border: none !important;
      }
    }
    .ant-select-selector {
      border: none !important;
    }
    .ant-select-selection-search,
    .ant-select-selection-item {
      display: none;
    }
  }
  :global(.none_selectable_options) {
    .ant-select-item-option-content {
      div,
      p {
        color: #000 !important;
      }
    }
  }
}
</style>
