<template>
  <CustomBreadcrumbs :breadcrumbs="breadcrumbs" />
  <div style="display: flex; align-items: center">
    <h1 class="page-title">{{ useProjectStore.title.value }}</h1>
    <div style="margin-left: 8px; margin-bottom: 4px">
      <CustomTag
        v-if="useProjectStore.milestoneName.value"
        type="colored-rounded"
        :color="useProjectStore.milestoneName.value"
        icon
      >
        {{ useProjectStore.milestoneName.value }}
      </CustomTag>
    </div>
  </div>

  <section class="projects-tab-page">
    <a-tabs
      :activeKey="activeTab"
      @change="tabClick"
      class="projects-tab-page__tabs"
      animated
    >
      <a-tab-pane key="ProjectInformation" tab="Information">
        <slot name="information" />
      </a-tab-pane>
      <a-tab-pane key="ProjectMilestone" tab="Milestone">
        <slot name="milestone" />
      </a-tab-pane>
      <a-tab-pane key="ProjectAnalytics" tab="Analytics">
        <slot name="analytics" />
      </a-tab-pane>
      <a-tab-pane key="ProjectLogs" tab="Logs & Comments">
        <slot name="logs" />
      </a-tab-pane>
      <a-tab-pane key="ProjectDocuments" tab="Documents">
        <slot name="documents" />
      </a-tab-pane>
    </a-tabs>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import useProjectStore from "../../stores/project";
const route = useRoute(),
  router = useRouter();

const ICONS = {
  Cancelled: "check",
  "Blocked / On Hold": "check",
  Complete: "check",
  Certification: "empty",
  "No milestones": "",
};

if (!useProjectStore.title.value && !route.path.includes("information")) {
  router.push(`/projects/${route.params.project}/information`);
}
const breadcrumbs = computed(() => {
  if (useProjectStore.title) {
    return ["Projects", useProjectStore.title.value];
  }
});
const activeTab = computed(() => route.name?.toString());
const tabClick = (name: string) => {
  router.push({ name, params: { project: route.params.project } });
};
</script>

<style scoped lang="scss"></style>
