<template>
  <div class="page-breadcrumbs">
    <template v-for="(crumb, index) in props.breadcrumbs">
      <span
        @click="
          () => {
            index === 0 ? router.push(`/${pushTo}`) : null;
          }
        "
        class="page-breadcrumbs__crumb"
      >
        {{ crumb }}
      </span>
      <span class="page-breadcrumbs__crumb-divider">/</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";

// import

// props & pinia 
const props = defineProps<{
  breadcrumbs: (string | string[])[];
  pushTo: string;
}>();

// constants

// refs

// computed

// methods

// watch

// hooks
</script>

<style scoped lang="scss">
.page-breadcrumbs {
  @include Body-M-14-Regular();

  &__crumb {
    display: inline-block;
    color: $neutrals-text-hint;

    &:first-child {
      color: $neutrals-text-primary;
    }
  }

  &__crumb-divider {
    display: inline-block;
    margin: 0 4px;
    color: $neutrals-text-hint;

    &:last-child {
      display: none;
    }
  }
}
</style>
