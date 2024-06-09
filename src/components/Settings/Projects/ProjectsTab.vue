<script setup lang="ts">
import { type IProjectList, getProjectList } from "@/api/settingProjects";
import { ref } from "vue";
import { onMounted } from "vue";

const tableData = ref<IProjectList[] | null>(null);
onMounted(async () => {
  await getProjectList().then((res) => (tableData.value = res.data.data));
});

const handleUpdateTableData = async (search?: string, status?: string) => {
  await getProjectList(search, status).then(
    (res) => (tableData.value = res.data.data)
  );
};
</script>

<template>
  <ProjectsTable
    @update-table="
      (value) => {
        handleUpdateTableData(value?.search, value?.status);
      }
    "
    v-if="tableData"
    :data="tableData"
  />
</template>

<style scoped lang="scss"></style>
