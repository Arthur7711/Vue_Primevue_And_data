<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { fillTableLine } from "@/utils";
import { IProject } from "@/api/models/IProjects";
import MilestoneIcon from "../icons/MilestoneIcon.vue";
import { reactive } from "vue";
import { antSort } from "../../utils/antSort";

const props = defineProps<{
  itemList: IProject[];
  filters: { [key: string]: string };
}>();
const dataTable = ref<IProject[]>([]);

const emit = defineEmits(["refresh-table"]);

const columns = ref([
  fillTableLine("Projects", "project_name", {
    width: "250px",
    sorter: (a, b, e) => antSort(a.project_name, b.project_name),
  }),
  fillTableLine("Studio", "studios", { width: "250px" }),
  fillTableLine("Offices", "offices", { width: "250px" }),
  fillTableLine("Milestone", "milestone", { width: "200px" }),
  fillTableLine("Headcount", "headcount", {
    sorter: (a, b) => a.headcount - b.headcount,
  }),
  fillTableLine("MMtotal", "man_month", {
    width: "200px",
    sorter: (a, b) => a.man_month - b.man_month,
  }),
]);
watch(
  () => props.itemList,
  () => {
    dataTable.value = props.itemList;
  },
  { immediate: true }
);
</script>
<template>
  <a-table
    :data-source="dataTable"
    :columns="columns"
    :pagination="false"
    class="project_table"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'project_name'">
        <router-link
          :to="{
            name: 'ProjectInformation',
            params: { project: `${record?.project_id}` },
          }"
          class="project-name"
          >{{ text }}</router-link
        >
      </template>
      <template v-else-if="column.dataIndex === 'studios'">
        <CustomTag v-for="item in record[column.dataIndex].slice(0, 3)">
          <router-link
            :to="{
              name: 'StudiosProjects',
              params: { id: `${item?.id}` },
            }"
            class="project-name"
            >{{ item?.name }}</router-link
          >
        </CustomTag>
        <LinkDropdown
          v-if="text.length > 3"
          :title="`${text.length - 3}`"
          :options="text.slice(3, text.length)"
          where="StudiosProjects"
          paramName="id"
        />
      </template>
      <template v-else-if="column.dataIndex === 'offices'">
        <CustomTag
          v-for="item in record[column.dataIndex].slice(0, 3)"
          type="neutral"
        >
          {{ item }}
        </CustomTag>
        <LinkDropdown
          v-if="text.length > 3"
          :title="`${text.length - 3}`"
          :options="
            text.slice(3, text.length)?.map((el) => {
              return { id: 1, name: el };
            })
          "
          :diactive="true"
        />
      </template>
      <template v-else-if="column.dataIndex === 'milestone'">
        <CustomTag
          v-for="item in record[column.dataIndex]"
          type="colored-rounded"
          :color="item.name"
          icon
        >
          {{ item.name }}
        </CustomTag>
      </template>
      <template v-else>{{ text }}</template>
    </template>
  </a-table>
</template>

<style scoped lang="scss">
.project-name {
  color: $primary-text-default;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
.project_table {
  &:deep(.ant-table-cell) {
    tr {
      th {
        width: 250px !important;
      }
    }
  }
}
</style>
