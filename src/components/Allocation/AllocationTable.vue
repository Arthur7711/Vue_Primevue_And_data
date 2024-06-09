<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { FilterMatchMode } from "primevue/api";
import { ref, onMounted, watch, computed } from "vue";
import { useAllocationStore } from "@/stores/allocation";
import { useInfiniteScroll } from "@vueuse/core";
import { useRoute } from "vue-router";

const route = useRoute();
const { allocationsStore } = useAllocationStore();
export interface ISortEvent {
  field?: string;
  order?: number;
}
const emit = defineEmits<{
  (e: "update-page", value: number): void;
  (e: "sort", value: ISortEvent): void;
}>();
const props = defineProps<{
  sortOptions?: ISortEvent;
}>();
const data = computed(() => {
  if (allocationsStore.allocationTable.data) {
    return allocationsStore.allocationTable.data.map((item) => ({
      id: item.id,
      displayname: item.displayname,
      department: item.department,
      division: item.division,
      title: item.title,
      employer_statistic: item.employer_statistic.toFixed(2),
    }));
  }
});

const el = ref<HTMLElement | null>(null);
const page = ref(1);
const okScroll = ref(false);
const isAllCopy = ref(false);
//Custom Directive

//watchers
watch(
  () => route.query,
  () => {
    if (el.value) {
      page.value = 1;
      el.value.scrollTo(0, 0);
    }
  },
  { deep: true }
);

watch(
  () => page.value,
  () => {
    emit("update-page", page.value);
  }
);

watch(
  () => el.value,
  () => {
    if (el.value) {
      useInfiniteScroll(
        el,
        () => {
          const lastPage = allocationsStore?.allocationTable?.meta?.last_page;
          if (okScroll.value && lastPage) {
            if (page.value < lastPage) {
              page.value++;
            }
            okScroll.value = false;
          }
        },
        {
          distance: 40,
          onScroll: (e) => (okScroll.value = true),
          throttle: 500,
          offset: { top: 1 },
        }
      );
    }
  }
);

const filterCallback = (e: ISortEvent) => {
  if (el.value) {
    el.value.scrollTo(0, 0);
  }
  emit("sort", { field: e.field, order: e.order });
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  el.value = document.querySelector(".p-datatable-wrapper");
});
const handleCopy = async (e: any, isAll: boolean) => {
  if (isAll) {
    const clipboardData = data.value
      ?.map((el) => [
        el.displayname,
        el.department,
        el.division,
        el.title,
        el.employer_statistic,
      ])
      .map((row) => row.join("  ") + " \r\n")
      .join(" ");

    navigator.clipboard
      ?.writeText(clipboardData ? clipboardData : "")
      .then(() => null)
      .catch((err: any) => console.log("err", err));

    return clipboardData;
  } else {
    let text: string = "";
    navigator.clipboard
      ?.readText()
      .then((res) => {
        text = res.replace("/ /g ", "\u00A0").replace('/\t/g',"\u00A0");
      })
      .catch((err) => console.log(err));
  }
};

const handleCtrlA = (e: any) => {
  document.querySelectorAll(".alloc_selectable_column").forEach((el) => {
    if (!el.className.includes("selected_block")) {
      el.className = el.className + " selected_block";
    } else {
      el.className = el.className.replace("selected_block", "");
    }
  });
  e.preventDefault();
  return true;
};

const handleKeydown = (e: any) => {
  const isCtrlPressed = e.ctrlKey || e.metaKey;
  if (e.key === "a" && isCtrlPressed) {
    isAllCopy.value = handleCtrlA(e);
  } else if (e.key === "c" && isCtrlPressed) {
    handleCopy(e, isAllCopy.value);
    isAllCopy.value = false;
  }
};
const clearSelection = (e: any) => {
  document.querySelectorAll(".alloc_selectable_column").forEach((el) => {
    el.className = el.className.replace("selected_block", "");
  });
};
</script>

<template>
  <div class="card" @click="clearSelection" @keydown="handleKeydown">
    <DataTable
      v-model:filters="filters"
      :value="data"
      scrollable
      scrollHeight="800px"
      :rowClass="() => 'alloc_selectable_column'"
      showGridlines
    >
      <Column
        v-if="data"
        field="displayname"
        :bodyClass="'alloc_selectable_column'"
        style="width: 20%"
        filter
      >
        <template #header>
          <div class="allocation_table_header">
            <span
              >{{ `Name (${allocationsStore.allocationTable.meta?.total})` }}
            </span>
            &nbsp;
            <SortAllocationTable
              :field="sortOptions?.field"
              :order="sortOptions?.order"
              :this_field="'displayname'"
              @sort="(val: ISortEvent) => filterCallback(val)"
            /></div
        ></template>
      </Column>
      <Column
        v-if="data"
        field="department"
        style="width: 20%"
        :bodyClass="'alloc_selectable_column'"
      >
        <template #editor="{ data, field }">
          <div>{{ field }}</div>
        </template>
        <template #header>
          <div class="allocation_table_header">
            <span>{{ `Department` }} </span>
            &nbsp;
            <SortAllocationTable
              :field="sortOptions?.field"
              :order="sortOptions?.order"
              :this_field="'department'"
              @sort="(val: ISortEvent) => filterCallback(val)"
            /></div
        ></template>
      </Column>
      <Column
        v-if="data"
        field="division"
        style="width: 20%"
        :bodyClass="'alloc_selectable_column'"
      >
        <template #header>
          <div class="allocation_table_header">
            <span>{{ `Division` }} </span>
            &nbsp;
            <SortAllocationTable
              :field="sortOptions?.field"
              :order="sortOptions?.order"
              :this_field="'division'"
              @sort="(val: ISortEvent) => filterCallback(val)"
            /></div
        ></template>
      </Column>
      <Column
        field="title"
        style="width: 20%"
        v-if="data"
        :bodyClass="'alloc_selectable_column'"
      >
        <template #header>
          <div class="allocation_table_header">
            <span>{{ `Position` }} </span>
            &nbsp;
            <SortAllocationTable
              :field="sortOptions?.field"
              :order="sortOptions?.order"
              :this_field="'title'"
              @sort="(val: ISortEvent) => filterCallback(val)"
            /></div
        ></template>
      </Column>
      <Column
        v-if="data"
        field="employer_statistic"
        style="width: 20%"
        :bodyClass="'alloc_selectable_column'"
      >
        <template #header>
          <div class="allocation_table_header">
            <span
              >{{
                `sum M/M (${allocationsStore.allocationTable.meta?.total_mm?.toFixed(
                  2
                )})`
              }}
            </span>
            &nbsp;
            <SortAllocationTable
              :field="sortOptions?.field"
              :order="sortOptions?.order"
              :this_field="'employer_statistic'"
              @sort="(val: ISortEvent) => filterCallback(val)"
            /></div
        ></template>
      </Column>
    </DataTable>
    <div
      v-if="
        allocationsStore.showPaginateTableLoader ||
        allocationsStore.showSortLoader
      "
      class="allocation_table_loader"
    >
      <div class="allocation_table_loader_loader">
        <a-spin size="large" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.allocation_table_loader {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  top: 50%;
  left: 50%;
  position: absolute;
  &_loader {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.card {
  min-height: 70vh;
  position: relative;
}
:deep(.p-datatable-wrapper) {
  background: #fff;
}
:deep(.p-datatable-thead) {
  top: -1px;
}
::v-deep(.p-datatable.p-datatable-gridlines .p-datatable-thead > tr > th) {
  @include Body-S-12-Bold;
  background: $neutrals-background-weak;
  color: $neutrals-text-secondary;
}
::v-deep(.p-datatable .p-sortable-column .p-sortable-column-icon) {
  height: 13px;
  margin-left: 0.2rem;
  color: $neutrals-icon-secondary;
}
.allocation_table_header {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep {
  .selected_block {
    color: rgb(99, 171, 95) !important;
  }
  .alloc_selectable_column::selection {
    color: rgb(99, 171, 95) !important;
    background: none !important;
  }
}
</style>
