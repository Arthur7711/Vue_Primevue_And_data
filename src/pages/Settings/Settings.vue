<template>
  <div class="settings_page_all">
    <h1 class="settings_page_all_h1">Settings</h1>
    <a-tabs
      style="background-color: #f9fafb"
      v-model:activeKey="activeTab"
      class="project-page__tabs"
      @change="(e) => handleQuery(e)"
      animated
    >
      <a-tab-pane key="1" tab="Aliases">
        <AliasTab />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Milestones">
        <MilestonesTab />
      </a-tab-pane>
      <a-tab-pane key="3" tab="Projects">
        <ProjectsTab />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
// import
import { ref, onMounted, onBeforeUnmount } from "vue";
import ProjectsTab from "@/components/Settings/Projects/ProjectsTab.vue";
import { useRoute, useRouter } from "vue-router";
// props & pinia

// constants

// refs
const activeTab = ref("1");
const route = useRoute();
const router = useRouter();
// computed

// methods

// watch

// hooks

onMounted(() => {
  // if(route.params)
  activeTab.value = route.query.tab as string;
});
const handleQuery = (e: number | string) => {
  router.push("/settings?tab=" + e);
};
</script>

<style scoped lang="scss">
// :global(main.ant-layout-content) {
//   padding: 0 !important;
// }
.settings_page_all {
  &_h1 {
    margin-top: 65px;
    font-size: 28px;
    font-weight: 600;
    color: $neutrals-text-primary;
  }
}
.project-page {
  &__tabs {
    margin-top: 12px;
  }
}
</style>
