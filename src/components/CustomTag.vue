<template>
  <a-tag
    class="custom-tag color-marker"
    :class="{
      [`color-marker_${markerType}`]: true,
      [`custom-tag_${props.type}`]: props.type !== 'colored-rounded',
      'custom-tag_colored-rounded': props.type === 'colored-rounded',
    }"
  >
    <template v-if="props.icon">
      <IconStatusProgress
        class="custom-tag__icon custom-tag__icon_prefix"
        v-if="iconComputed === 'progress'"
      />
      <IconStatusCheck
        class="custom-tag__icon custom-tag__icon_prefix"
        v-else-if="iconComputed === 'check'"
      />
      <IconStatusEmpty
        class="custom-tag__icon custom-tag__icon_prefix"
        v-else-if="iconComputed === 'empty'"
      />
    </template>
    <slot />
    <CloseIcon
      class="custom-tag__icon custom-tag__icon_close"
      v-if="closable"
      @close="emit('close')"
    />
  </a-tag>
</template>

<script setup lang="ts">
// import
import { CloseIcon } from "mdi-vue3";
import { computed } from "vue";

// types & interfaces
export interface ICustomTag {
  type?: string;
  color?: string;
  icon?: boolean;
  closable?: boolean;
}

// props & pinia
const props = withDefaults(defineProps<ICustomTag>(), {
  type: "primary",
  closable: false,
  icon: false,
});
const emit = defineEmits(["close"]);

// constants

// computed
const coloredTag = computed(() => props.type === "colored-rounded");
const markerType = computed(() => {
  return props.color
    ?.toLowerCase()
    .replace(/\//g, " ")
    .replace(/\s/g, "-")
    .replace(/-+/g, "-");
});
const iconComputed = computed(() => {
  const iconType = props.color?.toLowerCase();
  switch (iconType) {
    case "cancelled":
    case "blocked / on hold":
    case "complete":
      return "check";
    case "certification":
      return "empty";
    default:
      return "progress";
  }
});

// methods

// watch

// hooks
</script>

<style lang="scss">
.custom-tag {
  display: inline-flex;
  align-items: center;
  width: min-content;
  margin-bottom: 4px;

  &_primary {
    color: $primary-text-default;
    border-color: $neutrals-border-default;
    border-radius: 4px;
    a {
      color: $primary-text-default;
      text-decoration: none !important;
    }
    &:hover {
      background: #0f4cbd;
      color: #fff;
      a {
        color: #fff;
      }
    }
  }

  &_neutral {
    color: $neutrals-text-primary;
    background-color: $neutrals-background-semi;
    border-radius: 4px;
  }

  &_colored-rounded {
    display: flex;
    align-items: center;
    width: min-content;
    height: 24px;
    border-radius: 16px;
    line-height: 16px;
    padding: 4px 8px 4px 6px;
  }
  &__icon {
    width: 12px;
    height: 12px;

    &_prefix {
      margin-right: 4px;
    }
    &_close {
      margin-right: -6px;
      margin-left: 2px;
      margin-top: 2px;
      cursor: pointer;

      &:hover {
        fill: black !important;
      }
    }
  }
}
</style>
