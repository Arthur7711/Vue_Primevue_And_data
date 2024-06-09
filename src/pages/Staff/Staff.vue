<script setup lang="ts">
import { ref, onMounted } from "vue";
import CustomSearch from "@/components/CustomSearch.vue";
import StaffListTable from "@/components/Staff/StaffListTable.vue";
import {
  getOfficesOptions,
  getProjectsOptions,
  getStudiosOptions,
} from "@/api/studios";
import { getDepartments } from "@/api/projects";
import { getPositions } from "../../api/positions";
import { watch } from "vue";
import useFiltersStore from "../../stores/filtersStore";

const staff = [
  { title: "All", id: "all" },
  { title: "Not fired", id: "only_not_fired" },
  { title: "Fired", id: "only_fired" },
];
const workflows = [
  { title: "All", id: "all" },
  { title: "Only load", id: "only_load" },
  { title: "Only not load", id: "only_not_load" },
];
const filters = ref({
  dateRange: undefined,
  staff_status: "all",
  projects: undefined,
  studio: undefined,
  offices: undefined,
  department: undefined,
  title: undefined,
  workload: "all",
});
const total = ref(0);
const search = ref(null);
const options = ref({
  projects: undefined,
  studio: undefined,
  offices: undefined,
  department: undefined,
  title: undefined,
});
const filteredItems = () => {
  getProjectsOptions({
    studios_ids: filters.value.studio,
    offices_ids: filters.value.offices,
  }).then(
    ({ data }) =>
      (options.value.projects = data.map((el) => {
        return { title: el?.name, id: el.id };
      }))
  );
  getStudiosOptions({
    projects_ids: filters.value.projects,
    offices_ids: filters.value.offices,
  }).then(
    ({ data }) =>
      (options.value.studio = data.map((el) => {
        return { title: el?.name, id: el.id };
      }))
  );
  getOfficesOptions({
    projects_ids: filters.value.projects,
    studios_ids: filters.value.studio,
  }).then(
    ({ data }) =>
      (options.value.offices = data.map((el) => {
        return { title: el?.name, id: el.id };
      }))
  );
  getDepartments({
    projects_ids: filters.value.projects,
    studios_ids: filters.value.studio,
    offices_ids: filters.value.offices,
  }).then(
    ({ data }) =>
      (options.value.department = data.map((el) => {
        return { title: el, id: el };
      }))
  );
  getPositions({
    projects_ids: filters.value.projects,
    studios_ids: filters.value.studio,
    offices_ids: filters.value.offices,
  }).then(
    ({ data }) =>
      (options.value.title = data.map((el) => {
        return { title: el, id: el };
      }))
  );
};
const clearFilteres = () => {
  filters.value = {
    dateRange: undefined,
    staff_status: "all",
    projects: undefined,
    studio: undefined,
    offices: undefined,
    department: undefined,
    title: undefined,
    workload: "all",
  };
};
onMounted(async () => {
  if (
    useFiltersStore.filters.value?.departments?.length ||
    useFiltersStore.filters.value?.offices?.length ||
    useFiltersStore.filters.value?.projects?.length ||
    useFiltersStore.filters.value?.studios?.length
  ) {
    filteredItems();
  } else {
    getProjectsOptions().then(
      ({ data }) =>
        (options.value.projects = data.map((el) => {
          return { title: el?.name, id: el.id };
        }))
    );
    getStudiosOptions().then(
      ({ data }) =>
        (options.value.studio = data.map((el) => {
          return { title: el?.name, id: el.id };
        }))
    );
    getOfficesOptions().then(
      ({ data }) =>
        (options.value.offices = data.map((el) => {
          return { title: el?.name, id: el.id };
        }))
    );
    getDepartments().then(
      ({ data }) =>
        (options.value.department = data.map((el) => {
          return { title: el, id: el };
        }))
    );
    getPositions().then(
      ({ data }) =>
        (options.value.title = data.map((el) => {
          return { title: el, id: el };
        }))
    );
  }
});

watch(
  () => useFiltersStore.filters.value,
  () => {
    filters.value.offices = useFiltersStore.filters?.value?.offices?.length
      ? useFiltersStore.filters?.value?.offices
      : undefined;
    filters.value.projects = useFiltersStore.filters?.value?.projects?.length
      ? useFiltersStore.filters?.value?.projects
      : undefined;
    filters.value.studio = useFiltersStore.filters?.value?.studios?.length
      ? useFiltersStore.filters?.value?.studios
      : undefined;
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  filters,
  () => {
    filteredItems();
  },
  {
    deep: true,
  }
);
</script>
<template>
  <h1 class="page-title">Staff</h1>
  <section class="staff-page">
    <div class="staff-page__filters">
      <div class="staff-page__filters-header">
        <h3>Filters</h3>
        <span @click="clearFilteres">Clear all</span>
      </div>
      <div class="staff-page__filters-content">
        <div class="date_container">
          <p>Work period</p>
          <a-range-picker
            picker="month"
            v-model:value="filters.dateRange"
            class="staff_range_date"
            :placeholder="['Select date or period', '']"
          />
        </div>
        <div class="date_container">
          <p>Staff status</p>
          <a-select style="width: 100%" v-model:value="filters.staff_status">
            <a-select-option v-for="item of staff" :value="item.id">{{
              item.title
            }}</a-select-option>
          </a-select>
        </div>
        <CustomSelect
          v-model="filters.projects"
          :options="options.projects"
          select-title="Projects"
        />
        <CustomSelect
          v-model="filters.studio"
          :options="options.studio"
          select-title="Studios"
        />
        <CustomSelect
          v-model="filters.offices"
          :options="options.offices"
          select-title="Offices"
        />
        <CustomSelect
          v-model="filters.department"
          :options="options.department"
          select-title="Department"
        />
        <CustomSelect
          v-model="filters.title"
          :options="options.title"
          select-title="Title"
        />
        <div class="date_container">
          <p>Workload</p>
          <a-select style="width: 100%" v-model:value="filters.workload">
            <a-select-option v-for="item of workflows" :value="item.id">{{
              item.title
            }}</a-select-option>
          </a-select>
        </div>
      </div>
    </div>
    <div class="staff-page__list">
      <div class="staff-page__list-header">
        <div class="staff-page__list-title">
          <h3>Staff list</h3>
          <span>Results: {{ total }}</span>
        </div>
        <div class="staff-page__list-search">
          <CustomSearch v-model:model-value="search" />
        </div>
      </div>
      <div class="staff-page__list-table">
        <StaffListTable
          :filters="filters"
          :search="search"
          @total_items="total = $event"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.staff-page {
  display: flex;
  flex-flow: row;
  border: 1px solid $neutrals-border-default;
  border-radius: 8px;

  &__filters {
    flex: none;
    width: 23%;
    padding: 26px 20px;
    border-right: 1px solid $neutrals-border-default;
  }

  &__filters-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 38px;

    h3 {
      @include Title-H3;
      margin-bottom: 0;
    }

    span {
      @include Button-M;
      color: $primary-text-default;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__filters-content {
    & > * + * {
      margin-top: 20px;
    }
    .date_container {
      display: flex;
      flex-direction: column;
      p {
        color: #576b8b;
        font-size: 14px;
      }
    }
  }

  &__list {
    width: 100%;
  }
  &__list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
  }
  &__list-title {
    h3 {
      @include Title-H3;
      margin-bottom: 0;
    }

    span {
      @include Body-M-14-Regular;
      color: $neutrals-text-hint;
    }
  }
  &__list-search {
    width: 320px;
  }
  &__list-table {
    width: 100%;
  }
}
:global(.ant-picker-range-separator) {
  display: none;
}
:global(.ant-picker-active-bar) {
  display: none;
}
</style>
