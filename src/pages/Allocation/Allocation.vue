<script setup lang="ts">
import SideBar from "@/components/SideBar/SideBar.vue";
import { computed, type ComputedRef, onMounted, ref, watch } from "vue";
import WidgetSettingsIcon from "@/components/icons/WidgetSettingsIcon.vue";
import Barchart, {type ISelectedItem} from "@/components/Allocation/Barchart.vue";
import WidgetsMenu, {
  type IWidgetItems,
} from "@/components/Allocation/WidgetsMenu.vue";
import GroupingSelect from "@/components/Allocation/GroupingSelect.vue";
import { useAllocationStore } from "@/stores/allocation";
import InputText from "primevue/inputtext";
import IconSearch from "@/components/icons/IconSearch.vue";
import AllocationTable, {type ISortEvent} from "@/components/Allocation/AllocationTable.vue";
import { useRoute } from "vue-router";
import type {Otion_Aliases, TOption} from "@/components/SideBar/types";
import type {IOptions } from "@/components/SideBar/types";
import {type GroupBy, type IInitialData, ParamsEnum} from "@/pages/Allocation/types";
import dayjs from "dayjs";


const { allocationsStore, getPieChartData, getStackedBarchart } = useAllocationStore();
let filteredOptionId = null

const options = ref<IOptions>()
const selectedItem = ref<GroupBy>()


const isOpen = ref(true);
const menu = ref(false);
const tablePage = ref<number>();

const sortTable = ref<ISortEvent>()
const isShowWidget = ref<IWidgetItems>({
  date: false,
  department_group: false,
  department: false,
  division: false,
  team: false,
  project_group: false,
  project: false,
  studio: false,
  office: false,
  users: false,
});
const tableSearchQuery = ref();
const route = useRoute();
const group_by = ref<Otion_Aliases>('total');
const tableDataLength = computed(()=> allocationsStore.allocationTable.data? allocationsStore.allocationTable.data.length: null)
const initialData = ref<IInitialData>({
  date: [],
  projects: [],
});
const total: ComputedRef<number | undefined> = computed(() => allocationsStore.stackedBarchart.data?.sum);

const computedDate = computed(()=>{
  return{
    date_from: route.query.date_from? route.query.date_from.toString(): dayjs(dayjs()).subtract(12, 'month').format("YYYY-MM-DD"),
    date_to: route.query.date_to? route.query.date_to.toString(): dayjs(dayjs()).format("YYYY-MM-DD"),
  }
})
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const isShowWidgetItems = (e: IWidgetItems) => {
  isShowWidget.value = e;
};
const loading = ref(false);


watch(()=>selectedItem.value, (val)=>{
  if(options.value){
     if(val?.group_By ){
       const payload = createPayload(val.group_By, options.value)
       if(val?.target){
         getPieChartData(payload)
         getStackedBarchart({...payload, group_by: val.group_By})
       }else {
         getPieChartData({
           date_from: computedDate.value.date_from,
           date_to: computedDate.value.date_to,
         })
         getStackedBarchart({
           date_from: computedDate.value.date_from,
           date_to: computedDate.value.date_to,
           group_by: group_by.value
         })
       }
     }else{
       if(group_by.value !== 'total'){
         const payload = createPayload(group_by.value, options.value)
         if(val?.target){
           getPieChartData(payload)
         }else {
           getPieChartData({
             date_from: computedDate.value.date_from,
             date_to: computedDate.value.date_to,
           })
        }
       }
     }
  }
}, {deep: true})

const createPayload = (groupBy: Otion_Aliases, options: IOptions)=>{
  filteredOptionId = options[groupBy]?.filter((item: TOption)=>item.title === selectedItem.value?.name)?.[0]?.id
  let key = ParamsEnum[groupBy]
  let value = filteredOptionId
  return  {
    [key]: [value],
    date_from: computedDate.value.date_from,
    date_to: computedDate.value.date_to,
  }
}

watch(
  () => allocationsStore.stackedBarchart,
  () => {
    loading.value = true;
    if (allocationsStore.stackedBarchart.data.dates.length) {
      initialData.value.date = allocationsStore.stackedBarchart.data.dates.map(
        (i) => i.replace(" ", "\n")
      );
      initialData.value.projects = allocationsStore.stackedBarchart.data.data;
      loading.value = false;
    } else {
      initialData.value.date = [];
      initialData.value.projects = [];
    }
  }
);

onMounted(() => {
  if (route.query.group_by) {
   group_by.value = route.query.group_by as Otion_Aliases
  }
  loading.value = false;
});
</script>
<template>
  <section class="allocation-page" @click="menu = false">
    <SideBar
      class="test_bar"
      @update_group_by="group_by = 'total'"
      :isOpen="isOpen"
      @side-bar-is-open="toggleSidebar"
      @options="(e)=>options=e"
      :group_by="group_by"
      :tablePage="tablePage"
      :tableSearchQuery="tableSearchQuery"
      :sortTable="sortTable"
    />
    <section class="content-section">
      <div
        class="content-section__main"
        :class="{ 'content-section__main_sidebar-opened': isOpen }"
      >
        <div
          class="content-section__header"
          :class="{ 'content-section__header_sidebar-opened': isOpen }"
        >
          <div class="content-section__header-title">Total MM: {{ total }}</div>
          <div class="content-section__header-widget">
            <WidgetSettingsIcon />
            <WidgetsMenu @is-show-widgets="isShowWidgetItems" v-model="menu" />
          </div>
        </div>
        <div class="charts">
          <Card v-if="!isShowWidget.date">
            <template #header>
              <div class="card-header">
                <div>M/M by Date</div>
                <div class="card-header-grouping">
                  Select Grouping:
                  <GroupingSelect
                    @select-grouping-update="(val) => (group_by = val as Otion_Aliases)"
                  />
                </div>
              </div>
            </template>
            <template #content>
              <div class="chartSection" v-if="allocationsStore.showChartLoader">
                <a-spin size="large" />
              </div>
              <div
                v-else-if="
                  initialData.projects.length < 1 &&
                  !allocationsStore.showChartLoader
                "
                class="searchInfo chartSection"
              >
                Select filters
              </div>
<!--                            <DatasetBarSatckedChart/>-->
              <Barchart v-else :initialData="initialData" @selected_item="value => selectedItem=value"/>
            </template>
          </Card>

          <PieChartsWrapper
            @selected_item="value => selectedItem=value" :sidebar-is-open="isOpen"
            :initialData="initialData"
            :isShowWidget="isShowWidget"
          />

          <Card v-if="!isShowWidget.users">
            <template #header>
              <div class="table-header">
                <span>Users</span>

                <span class="p-input-icon-left">
                  <IconSearch />
                  <InputText
                    v-model="tableSearchQuery"
                    placeholder="Search users"
                    size="small"
                  />
                </span>
              </div>
            </template>
            <template #content>
                <div class="table-content">
                      <a-spin
                          size="large"
                          v-if="tableDataLength=== null"
                      />
                        <div v-else-if="tableDataLength === 0">No available data</div>
                            <AllocationTable
                                v-else
                                style="margin-top: 15px; width: 100%"
                                @update-page="(val) => (tablePage = val)"
                                @sort="value => sortTable = value"
                                :sortOptions="sortTable"
                            />
                </div>
            </template>
          </Card>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped lang="scss">
.card-header {
  display: flex;
  gap: 20px;
  @include Title-H4;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid $neutrals-border-default;
  &-grouping {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    overflow: hidden;
    @include Body-M-14-Regular;
  }
  :nth-child(2) {
    //padding: 0;
    margin-top: 1.5px;
  }
}

.allocation-page {
  display: flex;
  position: relative;
  border-top: 1px solid $neutrals-border-default;
  background-color: $neutrals-background-default;
  margin-top: 64px;
  min-height: 120vh;
  overflow: hidden;
  .test_bar {
    margin-top: -1px;
  }
}

$sidebar-width: 365px;
$content-width-without-sidebar: calc(100vw - 48px);
$content-width-with-sidebar: calc(100vw - $sidebar-width - 32px);

.content-section {
  position: relative;
  display: flex;
  justify-content: flex-end;
  height: 100%;
  width: $content-width-without-sidebar;
  margin-top: 44px;
  background-color: $neutrals-background-default;
  transition: left 0.3s;
  overflow-x: clip;

  &__header {
    position: fixed;
    top: 64px;
    z-index: 5;
    display: flex;
    width: $content-width-without-sidebar;
    height: 44px;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px 0 10px;
    background-color: $neutrals-background-white;
    border-bottom: 1px solid $neutrals-border-default;
    border-top: 1px solid $neutrals-border-default;
    transition: all 0.3s ease-in-out;

    &_sidebar-opened {
      width: $content-width-with-sidebar;
      transition: all 0.3s ease-in-out;
    }
  }

  &__header-title {
    color: $neutrals-text-secondary;
    @include Body-M-14-Bold;
  }

  &__header-widget {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: $primary-text-default;
    @include Body-M-14-Regular;

    &:hover {
      color: $primary-text-hover;
    }
  }

  &__main {
    display: flex;
    justify-content: center;
    flex-direction: column;
    transition: all 0.3s ease-in-out;
    height: 100%;
    width: 100%;
    overflow-x: clip;

    &_sidebar-opened {
      width: $content-width-with-sidebar;
      overflow-y: hidden;
      transition: all 0.3s ease-in-out;
      overflow-x: hidden;
    }
  }
}

.charts {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 24px;

  .p-card {
    width: 100%;
  }

  & > * + * {
    margin-top: 20px;
  }
}

.chartSection {
  height: 460px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.searchInfo {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #576b8b;
}

.test_card {
  min-height: 50vh;
  background-color: #ffffff;
}

::v-deep(.p-input-icon-left > .p-inputtext) {
  height: 2.25rem;
  width: 20rem;
  border-radius: 8px;
}

//.noFilters {
//  font-size: 14px;
//  font-weight: 400;
//  line-height: 20px;
//  color: #576b8b;
//  display: flex;
//  align-items: center;
//  justify-content: center;
//  margin: 15% auto;
//}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid $neutrals-border-default;
}
.table-content{
  min-height: 879px;
  display: flex;
  justify-content: center
}
.ant-spin-spinning{
  display: flex;
  align-items: center;
}
</style>
