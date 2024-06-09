<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { fillTableLine } from "@/utils";
import CustomTag from "@/components/CustomTag.vue";
import { ITableListItem } from "@/pages/Staff/types";
import { getStaff } from "@/api/staff";
import dayjs from "dayjs";
import { useInfiniteScroll } from "@vueuse/core";
import { debounce } from "../../utils";
import useFiltersStore from "../../stores/filtersStore";

const props = defineProps<{
  filters: {
    dateRange: undefined | string;
    staff_status: string;
    projects: undefined | string[];
    studio: undefined | string[];
    offices: undefined | string[];
    department: undefined | string[];
    title: undefined | string[];
    workload: string;
  };
  search: string;
}>();

const emit = defineEmits<{ (e: "total_items", tags: number): void }>();
const tableData = ref<null | ITableListItem[]>(null);
const called = ref(true);
const el = ref<HTMLElement | null>(null);
const showLoader = ref(true);
const tablePageInfo = ref({
  current_page: 1,
  last_page: 0,
  total: 0,
});
const columns = ref([
  fillTableLine("Name & Title", "name", { sorter: true }),
  fillTableLine("Projects", "projects"),
  fillTableLine("Studio", "studio"),
  fillTableLine("Offices", "offices"),
  fillTableLine("Department", "department"),
  fillTableLine("Hire", "hire", { sorter: true }),
  fillTableLine("Fire", "fire", { sorter: true }),
]);

const addMoreItems = async () => {
  if (tablePageInfo.value.current_page < tablePageInfo.value.last_page) {
    showLoader.value = true;
    const { data, meta } = await getStaff({
      page: tablePageInfo.value.current_page + 1,
      date_from: props.filters.dateRange?.[0]
        ? dayjs(props.filters.dateRange?.[0]).format("YYYY-MM-DD")
        : undefined,
      date_to: props.filters.dateRange?.[1]
        ? dayjs(props.filters.dateRange?.[1]).format("YYYY-MM-DD")
        : undefined,
      status: props.filters.staff_status,
      project_id: props.filters.projects,
      studio_id: props.filters.studio,
      office_id: props.filters.offices,
      department: props.filters.department,
      position: props.filters.title,
      workload: props.filters.workload,
      search: props.search,
    });
    tablePageInfo.value.current_page = meta.current_page;
    data.forEach((el) => {
      tableData.value.push({
        name: el?.displayname || "",
        title: el?.title || "",
        projects: el.projects,
        studio: el?.studio?.name,
        offices: [el?.office?.name],
        department: [el?.department],
        hire:
          el.hire_fire && el.hire_fire?.hired_at
            ? dayjs(el.hire_fire?.hired_at).format("DD MMMM,YYYY")
            : "",
        fire:
          el.hire_fire && el.hire_fire?.fired_at
            ? dayjs(el.hire_fire?.fired_at).format("DD MMMM,YYYY")
            : "Not fired",
        id: el?.id,
        img: el?.avatar_url,
      });
    });
  }
  setTimeout(() => {
    called.value = false;
    showLoader.value = false;
  }, 500);
};
const debounceFiltering = debounce(
  async () => {
    const { data, meta } = await getStaff({
      date_from: props.filters.dateRange?.[0]
        ? dayjs(props.filters.dateRange?.[0]).format("YYYY-MM-DD")
        : undefined,
      date_to: props.filters.dateRange?.[1]
        ? dayjs(props.filters.dateRange?.[1]).format("YYYY-MM-DD")
        : undefined,
      status: props.filters.staff_status,
      project_id: props.filters.projects,
      studio_id: props.filters.studio,
      office_id: props.filters.offices,
      department: props.filters.department,
      position: props.filters.title,
      workload: props.filters.workload,
      search: props.search,
    });
    tableData.value = data.map((el) => {
      return {
        name: el.displayname,
        title: el.title,
        projects: el.projects,
        studio: el.studio.name,
        offices: [el.office.name],
        department: [el.department],
        hire:
          el.hire_fire && el.hire_fire?.hired_at
            ? dayjs(el.hire_fire?.hired_at).format("DD MMMM,YYYY")
            : "",
        fire:
          el.hire_fire && el.hire_fire?.fired_at
            ? dayjs(el.hire_fire?.fired_at).format("DD MMMM,YYYY")
            : "Not fired",
        id: el.id,
        img: el.avatar_url,
      };
    });
    tablePageInfo.value.current_page = 1;
    tablePageInfo.value.last_page = meta.last_page;
    tablePageInfo.value.total = meta.total;
    emit("total_items", meta.total);
  },
  500,
  false
);
onMounted(async () => {
  if (
    props.filters?.offices?.length ||
    props.filters?.projects?.length ||
    props.filters?.studio?.length
  ) {
    debounceFiltering();
  } else {
    const { data, meta } = await getStaff();
    tableData.value = data.map((el) => {
      return {
        name: el?.displayname,
        title: el?.title,
        projects: el?.projects, //string[]
        studio: el?.studio?.name,
        studioId: el?.studio?.id,
        offices: [el?.office?.name],
        department: [el?.department],
        hire:
          el.hire_fire && el.hire_fire?.hired_at
            ? dayjs(el.hire_fire?.hired_at).format("DD MMMM,YYYY")
            : "",
        fire:
          el.hire_fire && el.hire_fire?.fired_at
            ? dayjs(el.hire_fire?.fired_at).format("DD MMMM,YYYY")
            : "Not fired",
        id: el.id,
        img: el.avatar_url,
      };
    });
    tablePageInfo.value.current_page = meta.current_page;
    tablePageInfo.value.last_page = meta.last_page;
    tablePageInfo.value.total = meta.total;
    emit("total_items", meta.total);
  }
  setTimeout(() => {
    called.value = false;
  }, 1000);
  showLoader.value = false;
});

useInfiniteScroll(
  el,
  () => {
    if (!called.value) {
      addMoreItems();
      called.value = true;
    }
  },
  { distance: 10 }
);
watch(
  () => [props.filters, props.search],
  async () => {
    debounceFiltering();
  },
  { deep: true }
);
</script>
<template>
  <div class="table_scrollable" ref="el">
    <a-table :data-source="tableData" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <div style="display: flex; align-items: center">
            <a-badge :dot="true">
              <a-avatar shape="circle" size="large" :src="record.img" />
            </a-badge>
            <div style="margin-left: 0.4rem">
              <router-link
                :to="{ name: 'StaffUser', params: { id: record.id } }"
                class="studio-name"
                @click="() => useFiltersStore.addFilterValues({})"
                >{{ text }}
              </router-link>
              <div>{{ record.title }}</div>
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'projects'">
          <CustomTag v-for="item in text.slice(0, 3)">
            <router-link
              @click="() => useFiltersStore.addFilterValues({})"
              :to="{
                name: 'ProjectInformation',
                params: { project: `${item.id}` },
              }"
            >
              {{ item?.name }}
            </router-link>
          </CustomTag>
          <LinkDropdown
            v-if="text.length > 3"
            :title="`${text.length - 3}`"
            :options="text.slice(3, text.length)"
          />
        </template>
        <template v-else-if="column.dataIndex === 'studio'"
          ><CustomTag class="staff-name">
            <router-link
              @click="() => useFiltersStore.addFilterValues({})"
              :to="{
                name: 'StudiosProjects',
                params: { id: `${record.studioId}` },
              }"
            >
              {{ text }}
            </router-link>
          </CustomTag></template
        >
        <template v-else-if="column.dataIndex === 'offices'">
          <CustomTag v-for="item in record[column.dataIndex]" type="neutral">{{
            item
          }}</CustomTag>
        </template>
        <template v-else-if="column.dataIndex === 'department'">
          <CustomTag v-for="item in record[column.dataIndex]" type="neutral">{{
            item
          }}</CustomTag>
        </template>
        <template v-else>{{ text }}</template>
      </template>
    </a-table>
    <a-spin
      tip="Loading..."
      size="large"
      v-if="showLoader"
      style="position: fixed; bottom: 5%; right: 45%"
    />
  </div>
</template>

<style scoped lang="scss">
.table_scrollable {
  height: 74vh !important;
  overflow-y: auto;
}
.studio-name {
  color: $primary-text-default;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    color: $primary-text-default;
  }
}

.staff-name {
  cursor: pointer;
}
:global(.someCounts) {
  .span {
    display: none !important;
    background-color: red !important;
  }
}
</style>
