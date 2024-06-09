<script setup lang="ts">
// import
import { computed, onMounted, ref, watch } from "vue";
import { fillTableLine } from "@/utils";
import { getStaffHistory } from "@/api/staff";
import { IStaffHistoryItem } from "@/api/models/IStaff";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import Help from "../icons/Help.vue";

const route = useRoute();
const historyData = ref<null | IStaffHistoryItem[]>(null);
const columns = ref([
  fillTableLine("Projects", "project", {
    sorter: (a, b) => a.project.name < b.project.name,
  }),
  fillTableLine("Full period", "date_start"),
  fillTableLine("Total MM", "employment_rate", {
    width: 100,
    sorter: (a, b) => a.employment_rate < b.employment_rate,
  }),
]);

onMounted(async () => {
  const staffHiscotry = await getStaffHistory(`${route.params.id}`);
  historyData.value = staffHiscotry.data;
});
</script>

<template>
  <a-table
    v-if="historyData"
    :data-source="historyData"
    :columns="columns"
    :pagination="false"
    style="max-width: 475px; height: 306px; overflow-y: auto"
    size="small"
  >
    <template #headerCell="{ column }">
      <template v-if="column.dataIndex === 'date_start'"
        ><div style="display: flex; align-items: center; gap: 4px">
          <span style="color: #576b8b">Full period</span>
          <Help /></div
      ></template>
    </template>
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'project'">
        <router-link
          :to="{ name: 'ProjectInformation', params: { project: text.id } }"
          class="studio-name"
          >{{ text.name }}
        </router-link>
      </template>
      <template v-else-if="column.dataIndex === 'date_start'">
        <p>
          {{ text ? dayjs(text).format("MMMM, YYYY") : "no data" }} —
          {{
            record.date_end
              ? dayjs(record.date_end).format("MMMM, YYYY")
              : "Current month"
          }}
        </p>
      </template>
      <template v-else-if="column.dataIndex === 'employment_rate'">
        <div style="text-align: right">
          {{ text }}
        </div>
      </template>
      <template v-else>{{ text }}</template>
    </template>
  </a-table>
</template>

<style scoped lang="scss">
.studio-name {
  color: $primary-text-default;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
.staff-name {
  color: $primary-text-default;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
