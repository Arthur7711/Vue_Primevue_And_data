<template>
  <div class="main-header">
    <div class="main-header__logo">DATA</div>
    <div class="main-header__menu">
      <CustomMenuItem
        v-for="item in MENU_ITEMS"
        :route-name="item.routeName"
        :route-title="item.routeTitle"
      />
    </div>
    <a-avatar :size="36" class="main-header__avatar" :src="avatar" />
  </div>
</template>

<script setup lang="ts">
// import
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import userStore from "@/stores/user";
import { getAvatar } from "@/utils";

// props & pinia
const route = useRoute(),
  router = useRouter();

// constants
const MENU_ITEMS = [
  { routeName: "Studios", routeTitle: "Studios" },
  { routeName: "Projects", routeTitle: "Projects" },
  { routeName: "Staff", routeTitle: "Staff" },
  { routeName: "Allocation", routeTitle: "Allocation" },
  { routeName: "Reports", routeTitle: "Reports" },
  { routeName: "Settings", routeTitle: "Settings" }
];

// refs

// computed
const avatar = computed(() => {
  if (userStore.self.value?.samaccountname)
    return getAvatar(36, String(userStore.self.value?.samaccountname));
  else return undefined;
});

// methods
const checkForOverlap = (linkName) => {
  const path = router.resolve({ name: linkName }).path;
  return route.path.includes(path);
};

// watch

// hooks
</script>

<style scoped lang="scss">
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  top: 0;
  width: 100%;
  position: fixed; //HERACNEL
  z-index: 5;  //HERACNEL
  background-color: #FFFFFF; //HERACNEL

  &__logo {
    @include Monument-Extended;
  }

  &__menu {
  }

  &__menu-item {
    display: inline-block;
    @include Button-M;
    border-radius: 8px;
    padding: 8px 16px;

    &:hover {
      background-color: $primary-background-weak-hover;
    }

    &_active {
      background-color: $primary-background-weak-active;
    }
  }

  &__menu-item + &__menu-item {
    margin-left: 40px;
  }

  &__avatar {
  }
}
:global(.active) {
  display: none;
  color: #070606 !important;
}
:global(.ant-table-column-sorter-down) {
  font-size: 15px !important;
}
:global(.ant-table-column-sorter-up) {
  font-size: 15px !important;
}
</style>
