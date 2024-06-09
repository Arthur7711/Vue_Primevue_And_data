<script setup lang="ts">
const props = defineProps<{
  title: string;
  icon: "progress" | "check" | "empty";
}>();
</script>

<template>
  <a-tag class="custom-tag color-marker">
    <template v-if="props.icon">
      <IconStatusProgress
        style="margin-right: 4px"
        v-if="props.icon === 'progress'" 
      />
      <IconStatusCheck
        style="margin-right: 4px"
        v-else-if="props.icon === 'check'"
      />
      <IconStatusEmpty
        style="margin-right: 4px"
        v-else-if="props.icon === 'empty'"
      />
    </template>
    <p>{{ title }}</p>
  </a-tag>
</template>
<style scoped lang="scss">
.custom-tag {
  margin-bottom: 4px;

  &_primary {
    color: $primary-text-default;
    border-color: $neutrals-border-default;
    border-radius: 4px;
  }

  &_neutral {
    color: $neutrals-text-primary;
    background-color: $neutrals-background-semi;
    border-radius: 4px;
  }

  &_colored {
    display: flex;
    align-items: center;
    width: min-content;
    border-radius: 16px;
    line-height: 16px;
    padding: 4px 8px 4px 6px;
  }
}
</style>
