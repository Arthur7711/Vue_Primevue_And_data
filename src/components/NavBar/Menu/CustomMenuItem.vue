<template>
  <router-link
    :to="{ name: props.routeName }"
    class="main-header__menu-item"
    :class="{ 'main-header__menu-item_active': checkIfOverlap }"
    @click="useFiltersStore.addFilterValues({})"
    >{{ props.routeTitle }}</router-link
  >
</template>

<script setup lang="ts">
// import
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import useFiltersStore from "../../../stores/filtersStore";

// props & pinia
const route = useRoute(),
  router = useRouter();

const props = defineProps<{
  routeName: string;
  routeTitle: string;
}>();

// constants

// refs

// computed
const checkIfOverlap = computed(() => {
  const path = router.resolve({ name: props.routeName }).path;
  return route.path.includes(path);
});

// methods

// watch

// hooks
</script>
