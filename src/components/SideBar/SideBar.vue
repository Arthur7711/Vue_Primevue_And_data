<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { ReloadIcon } from "mdi-vue3";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import SideBarCloseIcon from "@/components/icons/SideBarCloseIcon.vue";
import SideBarOpenIcon from "@/components/icons/SideBarOpenIcon.vue";
import CustomSelect from "@/components/CustomSelect.vue";
import dayjs, { Dayjs } from "dayjs";
import { type IFilters, type IOptions } from "./types";
import { useAllocationStore } from "@/stores/allocation";
import { useStudiosStore } from "@/stores/studios";
import { useRoute, useRouter } from "vue-router";
import { notification } from "ant-design-vue";
import {debouncedWatch} from "@vueuse/core";
const {
  studiosStore,
  getStudiosFiltersOptions,
  getProjectsFiltersOptions,
  getOfficesFiltersOptions,
} = useStudiosStore();
const {
  allocationsStore,
  getStackedBarchart,
  getPieChartData,
  getAllocationTableData,
  getProjectsGroupsFiltersOptions,
  getDepartmentFiltersOptions,
  getDivisionsFiltersOptions,
  getUsersFiltersOptions,
  getTeamsFiltersOptions,
  getRootUsersFiltersOptions,
  getAvailableAllocationDates,
} = useAllocationStore();

const requestFiltersOptions = [
  getProjectsGroupsFiltersOptions,
  getProjectsFiltersOptions,
  getStudiosFiltersOptions,
  getOfficesFiltersOptions,
  getDepartmentFiltersOptions,
  getDivisionsFiltersOptions,
  getTeamsFiltersOptions,
  getUsersFiltersOptions,
  getRootUsersFiltersOptions,
  getAvailableAllocationDates,
]
const emit = defineEmits<{
  (e: "sideBarIsOpen"): void;
  (e: "filters", value: IFilters): void;
  (e: "update_group_by", value: string): void;
  (e: "options", value: IOptions): void;
}>();
const props = defineProps<{
  isOpen: boolean;
  group_by: string;
  tablePage?: number;
  tableSearchQuery?: string;
  sortTable?: { field?: string; order?: number }
}>();
const saveSorts = computed(() => ({
  sort_by: props.sortTable?.field,
  sort_type: props.sortTable?.order
    ? props.sortTable.order == 1
      ? "ASC"
      : "DESC"
    : null,
}));

const route = useRoute();
const router = useRouter();

const availableDates = computed(() => allocationsStore.availableDates?.data);
const tablePage = computed(() => props.tablePage);
const tableSearch = computed(() => props.tableSearchQuery);

const disabledDateFrom = (current: Dayjs) => {
  return (
    (current &&
      dayjs(current) <= dayjs(availableDates.value?.[0]).startOf("month")) ||
    dayjs(current) >= dayjs(availableDates.value?.at(-1)).endOf("month")
  );
};

const disabledDateTo = (current: Dayjs) =>
  (current && current.valueOf() <= dayjs(filters.value?.date_from).valueOf()) ||
  dayjs(current) <= dayjs(availableDates.value?.[0]).startOf("month") ||
  dayjs(current) >= dayjs(availableDates.value?.at(-1)).endOf("month");

const today = dayjs();

const defaultFilters = {
  date_from: dayjs(today).subtract(12, "month"),
  date_to: dayjs(today),
  group_by: "total",
  project_group_ids: [],
  project_ids: [],
  studio_ids: [],
  office_ids: [],
  departments: [],
  divisions: [],
  team_ids: [],
  root_user_ids: [],
  user_ids: [],
  department_group: [],
};

const getDefaultFilters = () => {
  const result = JSON.parse(JSON.stringify(defaultFilters));
  result.date_from = dayjs(today).subtract(12, "month");
  result.date_to = dayjs(today);
  return result;
};
const defaultCheckParams = {
  date_from: null,
  date_to: null,
  group_ids: [],
  project_group_ids: [],
  project_ids: [],
  studio_ids: [],
  office_ids: [],
  departments: [],
  divisions: [],
  team_ids: [],
  root_user_ids: [],
  user_ids: [],
};

const filters = ref<IFilters>(getDefaultFilters());
const options = ref<IOptions>({
  project_group: null,
  project: null,
  studio: null,
  office: null,
  department: null,
  division: null,
  team: null,
  rootUser: null,
  user: null,
});
const optionsDepartmentGroup = ref<IOptions>({
  department_group: [
    {title: 'Platform', id: 1},
    {title: 'Project', id: 2},
    {title: 'Support', id: 3}
  ]
})
const clearAllFilters = () => {
  filters.value = getDefaultFilters();
  emit("update_group_by", "");
  notification.info({ message: "Filters are cleared" });
};
const clearButtonUnavailable = computed(() => {
  return JSON.stringify(filters.value) === JSON.stringify(defaultFilters);
});

//TODO рефакторить Watchs  сделать функцию
watch(
  () => studiosStore.projectsFilter,
  (val) => {
    options.value.project = val.data.map((item) => {
      return { title: item.name, id: item.id };
    });
  }
);

watch(
  () => allocationsStore.projectsGroupsOptions,
  (val) => {
    options.value.project_group = val.data.map((item) => {
      return { title: item.name, id: item.id };
    });
  }
);

watch(
  () => studiosStore.studiosFilter,
  (val) => {
    options.value.studio = val.data.map((item) => {
      return { title: item.name, id: item.id };
    });
  }
);

watch(
  () => studiosStore.officesFilter,
  (val) => {
    options.value.office = val.data.map((item) => {
      return { title: item.name, id: item.id };
    });
  }
);
watch(
  () => allocationsStore.departmentOptions,
  (val) => {
    options.value.department = val.data.map((item) => {
      return { title: item, id: item };
    });
  }
);
watch(
  () => allocationsStore.divisionOptions,
  (val) => {
    options.value.division = val.data.map((item) => {
      return { title: item, id: item };
    });
  }
);
watch(
  () => allocationsStore.teamsOptions,
  (val) => {
    options.value.team = val.data.map((item) => {
      return { title: item.name, id: item.id };
    });
  }
);
watch(
  () => allocationsStore.usersOptions,
  (val) => {
    options.value.user = val.map((item) => {
      return { title: item.displayname, id: item.id };
    });
  }
);
watch(
  () => allocationsStore.rootUsersOptions,
  (val) => {
    options.value.rootUser = val.map((item) => {
      return { title: item.displayname, id: item.id };
    });
  }
);

watch(
  () => props.group_by,
  () => {
    filters.value.group_by = props.group_by;
  }
);
const filtersDates = computed(()=>({
  date_from: filters.value.date_from?.format("YYYY-MM-DD"),
  date_to: filters.value.date_to?.format("YYYY-MM-DD"),
}))
const filtersParams = computed(() => ({
  ...filters.value,
  ...filtersDates.value,
  group_by: undefined,
}));
const searchedSortedParams = computed(() => ({
  sort_by: saveSorts.value.sort_by,
  sort_type: saveSorts.value.sort_type,
  search: tableSearch.value ? tableSearch.value.toString() : undefined,
}));
debouncedWatch(
  () => tableSearch.value,
  () => {
    getAllocationTableData({
      ...filtersParams.value,
      ...searchedSortedParams.value,
      page: 1,
    });
  }, {debounce: 500}
);
watch(
  () => tablePage.value,
  () => {
    getAllocationTableData({
      ...filtersParams.value,
      ...searchedSortedParams.value,
      page: tablePage.value,
    });
  }
);
watch(
  () => props.sortTable,
  (val) => {
    if (val) {
      getAllocationTableData({
        ...filtersParams.value,
        ...searchedSortedParams.value,
        page: 1,
      });
    }
  }
);

watch(
  () => filters.value,
  () => {
    requestFiltersOptions.forEach(foo=>foo(filtersParams.value))
    getAllocationTableData({
      ...filtersParams.value,
      ...searchedSortedParams.value,
      page: 1,
    });
    getStackedBarchart({
      ...filters.value,
      ...filtersDates.value
    });
    getPieChartData({
      ...filters.value,
      ...filtersDates.value
    });
  },
  { deep: true }
);

const toggleSidebar = () => {
  emit("sideBarIsOpen");
};

watch(
  () => filters.value,
  () => {
    router.push({
      name: "Allocation",
      query: {
        ...filters.value,
        ...filtersDates.value
      },
    });
  },
  { deep: true }
);

onMounted(() => {
  //TODO рефакторить if-ы в компактную функцию
  if (route.query.date_from) {
    filters.value.date_from = dayjs(route.query.date_from as string);
  }
  if (route.query.date_to) {
    filters.value.date_to = dayjs(route.query.date_to as string);
  }
  if (route.query.group_by) {
    filters.value.group_by = route.query.group_by as string;
  }
  if (route.query.project_group_ids) {
    filters.value.project_group_ids = Array.isArray(
      route.query.project_group_ids
    )
      ? route.query.project_group_ids?.map((item) => Number(item))
      : [parseInt(route.query.project_group_ids)];
  }
  if (route.query.project_ids) {
    filters.value.project_ids = Array.isArray(route.query.project_ids)
      ? route.query.project_ids?.map((item) => Number(item))
      : [parseInt(route.query.project_ids)];
  }
  if (route.query.studio_ids) {
    filters.value.studio_ids = Array.isArray(route.query.studio_ids)
      ? route.query.studio_ids?.map((item) => Number(item))
      : [parseInt(route.query.studio_ids)];
  }
  if (route.query.office_ids) {
    filters.value.office_ids = Array.isArray(route.query.office_ids)
      ? route.query.office_ids?.map((item) => Number(item))
      : [parseInt(route.query.office_ids)];
  }
  if (route.query.departments) {
    filters.value.departments = Array.isArray(route.query.departments)
      ? (route.query.departments as string[])
      : [route.query.departments];
  }
  if (route.query.divisions) {
    filters.value.divisions = Array.isArray(route.query.divisions)
      ? (route.query.divisions as string[])
      : [route.query.divisions];
  }
  if (route.query.team_ids) {
    filters.value.team_ids = Array.isArray(route.query.team_ids)
      ? route.query.team_ids?.map((item) => Number(item))
      : [parseInt(route.query.team_ids)];
  }
  if (route.query.root_user_ids) {
    filters.value.root_user_ids = Array.isArray(route.query.root_user_ids)
      ? route.query.root_user_ids?.map((item) => Number(item))
      : [parseInt(route.query.root_user_ids)];
  }
  if (route.query.user_ids) {
    filters.value.user_ids = Array.isArray(route.query.user_ids)
      ? route.query.user_ids?.map((item) => Number(item))
      : [parseInt(route.query.user_ids)];
  }

  if (JSON.stringify(route.query).length <= 2) {
    requestFiltersOptions.forEach(foo=>foo(filtersParams.value))

    getAllocationTableData({
      ...filtersParams.value,
      ...searchedSortedParams.value,
      page: 1,
    });
    getStackedBarchart({
      ...filters.value,
      ...filtersDates.value
    });
    getPieChartData({
      ...filters.value,
      ...filtersDates.value
    });
  }

  emit("options", options.value);
});
</script>

<template>
  <div :class="['sidebar', { 'sidebar-open': props.isOpen }]">
    <div class="sidebar-header">
      <div class="sidebar-header__title">Filters</div>

      <button @click="toggleSidebar" class="toggle-button">
        <SideBarCloseIcon v-if="props.isOpen" />
        <SideBarOpenIcon v-else />
      </button>
    </div>
    <div class="scroll">
      <div class="main-filters">
        <Accordion
          v-show="props.isOpen"
          :multiple="true"
          :activeIndex="[0, 1, 2]"
        >
          <AccordionTab header="Main">
            <div class="main-filters__main-tab">
              <div class="flex-auto">
                <label for="Date from" class="date-label"> Date from </label>
                <a-date-picker
                  id="Date from"
                  v-model:value="filters.date_from"
                  picker="month"
                  format="MMM, YYYY"
                  :disabledDate="disabledDateFrom"
                  dropdown-class-name="fixed-sidebar-picker"
                />
              </div>
              <div class="flex-auto">
                <label for="Date to" class="date-label"> Date to </label>
                <a-date-picker
                  id="Date to"
                  v-model:value="filters.date_to"
                  picker="month"
                  format="MMM, YYYY"
                  :disabledDate="disabledDateTo"
                  dropdown-class-name="fixed-sidebar-picker"
                />
              </div>
            </div>

            <div style="margin-top: 15px">
              <CustomSelect
                v-model="filters.department_group"
                :options="optionsDepartmentGroup.department_group"
                :maxTagCount="100000"
                select-title="Department Group"
                placeholder="Select"
                :fixed="true"
              />
            </div>
            <div style="margin-top: 15px">
              <CustomSelect
                v-model="filters.project_group_ids"
                :options="options.project_group"
                :maxTagCount="100000"
                select-title="Project Group"
                placeholder="Select"
                :fixed="true"
              />
            </div>
            <div style="margin-top: 15px">
              <CustomSelect
                v-model="filters.project_ids"
                :options="options.project"
                :maxTagCount="100000"
                select-title="Project"
                placeholder="Select"
                :fixed="true"
              />
            </div>
          </AccordionTab>

          <AccordionTab header="Studios">
            <div>
              <CustomSelect
                v-model="filters.studio_ids"
                :options="options.studio"
                :maxTagCount="100000"
                select-title="Studio"
                placeholder="Select"
                :fixed="true"
              />
            </div>
            <div style="margin-top: 15px">
              <CustomSelect
                v-model="filters.office_ids"
                :options="options.office"
                :maxTagCount="100000"
                select-title="Office"
                placeholder="Select"
                :fixed="true"
              />
            </div>
            <div style="margin-top: 15px">
              <CustomSelect
                v-model="filters.departments"
                :options="options.department"
                :maxTagCount="100000"
                select-title="Department"
                placeholder="Select"
                :fixed="true"
              />
            </div>
            <div style="margin-top: 15px">
              <CustomSelect
                v-model="filters.divisions"
                :options="options.division"
                :maxTagCount="100000"
                select-title="Division"
                placeholder="Select"
                :fixed="true"
              />
            </div>
          </AccordionTab>
          <AccordionTab header="Users">
            <div style="margin-top: 15px">
              <CustomSelect
                v-model="filters.team_ids"
                :options="options.team"
                :maxTagCount="100000"
                select-title="Team"
                placeholder="Select"
                :fixed="true"
              />
            </div>
            <div style="margin-top: 15px">
              <CustomSelect
                v-model="filters.root_user_ids"
                :options="options.rootUser"
                :maxTagCount="100000"
                select-title="Root User"
                placeholder="Select"
                :fixed="true"
              />
            </div>
            <div style="margin-top: 15px">
              <CustomSelect
                v-model="filters.user_ids"
                :options="options.user"
                :maxTagCount="100000"
                select-title="User"
                placeholder="Select"
                :fixed="true"
              />
            </div>
          </AccordionTab>
        </Accordion>
        <div
          class="main-filters__clear-button"
          :class="{
            'main-filters__clear-button_disable': clearButtonUnavailable,
          }"
          @click="clearAllFilters"
        >
          <ReloadIcon />
          Clear all
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.borderColor {
  border-color: red;
}

:global(.fixed-sidebar-picker) {
  position: fixed !important;
}

:global(.ant-picker-suffix) {
  color: $neutrals-icon-secondary;
}

:global(.ant-picker-input > input) {
  @include Body-M-14-Regular;
  color: $neutrals-text-primary;
}

::v-deep(.p-accordion .p-accordion-content) {
  padding: 0 1.5rem 0.5rem !important;
}

.scroll {
  height: calc(100vh - 64px - 43px);
  overflow-y: auto;
  padding: 0;
}

.main-filters {
  &__main-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .ant-picker {
      border-radius: 6px;
      padding: 8px 12px;
    }
  }
  &__clear-button {
    width: 100%;
    color: $primary-text-default;
    display: flex;
    max-height: 50px;
    justify-content: center;
    align-items: center;
    height: 44px;
    cursor: pointer;
    @include Button-M;

    svg {
      width: 14px;
      margin-right: 4px;
    }

    &_disable {
      pointer-events: none;
      color: $neutrals-text-secondary;
      opacity: 0.7;

      svg {
        display: none;
      }
    }
    &:hover {
      background-color: $neutrals-background-hover;
      text-decoration: underline;
    }
  }
}

::v-deep(.main-filters) {
  position: relative;
  min-height: 100%;
  padding-bottom: 44px;

  .p-component {
    font-family: Inter, sans-serif;
  }

  .p-accordion-tab {
    margin: 0;
    box-shadow: none;
    border-bottom: 1px solid $neutrals-border-default;
  }

  .p-accordion-header {
    .p-accordion-header-link {
      padding-bottom: 12px;
      padding-top: 12px;
    }

    .p-accordion-header-text {
      color: $neutrals-text-primary;
      @include Body-M-14-Bold;
    }

    .p-accordion-toggle-icon {
      color: $neutrals-icon-secondary;
    }
  }

  .ant-select-selection-placeholder {
    color: $neutrals-text-secondary;
  }

  .p-inputwrapper {
    height: 44px;
    border: 1px solid $neutrals-border-default;
  }
}

.date-label {
  @include Body-M-14-Regular;
  color: $neutrals-text-secondary;
}

.sidebar {
  box-sizing: border-box;
  width: 356px;
  min-height: 100%;
  position: fixed;
  top: 65px;
  left: -330px;
  transition: left 0.3s;
  background-color: $neutrals-background-white;
  border: 1px solid $neutrals-border-default;
  color: #fff;
  z-index: 6;
}

.sidebar-open {
  left: 0;
}

.toggle-button {
  position: absolute;
  top: 10px;
  right: -3px;
  background-color: transparent;
  border: none;
}

.sidebar-header {
  width: 100%;
  height: 43px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid $neutrals-border-default;

  &__title {
    color: $neutrals-text-primary;
    width: 288px;
    left: 24px;
    position: absolute;
    @include Title-H4;
  }
}
</style>
