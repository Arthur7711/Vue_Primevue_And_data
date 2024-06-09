
<script setup lang="ts">
// import
import StudiosTabs from "@/components/Studio/StudiosTabs.vue";
import dayjs from "dayjs";
import IconArrowRight from "@/components/icons/IconArrowRight.vue";
import {computed, onMounted, ref, watch } from "vue";
import type { Dayjs } from "dayjs";
import ChartsTable from "@/components/Studio/Charts/ChartsTable.vue";
import Tooltip from "../../components/Tooltip.vue";
import IconPieChart from "@/components/icons/IconPieChart.vue";
import IconBarChart from "@/components/icons/IconBarChart.vue";
import IconLineChart from "@/components/icons/IconLineChart.vue";
import {useStudioAreaChartData} from "@/stores/charts";
import {generateColors} from "@/assets/scss/chartColors";
import BarChart from "@/components/Studio/Charts/BarChart/BarChart.vue";
import DoughnutChart from "@/components/Studio/Charts/DoughnutChart/DoughnutChart.vue";
import {useStudiosStore} from "@/stores/studios";
import {useRoute} from "vue-router";

// props & pinia
const route = useRoute()
const {studiosStore, getProjectsFiltersOptions, getOfficesFiltersOptions} = useStudiosStore()
// Local State
const {chartStore, getStudioAreaChartData}= useStudioAreaChartData()
const activeKey = ref("1");


const dateStart = ref<string | Dayjs>(dayjs().subtract(1, "month"));
const dateEnd = ref<string | Dayjs>(dayjs());
const thisMonth = ref(null);

const disabledCharts = ref(false);
const areaLegend = ref({});

// refs
const filters = ref({
  // date: {
  //   start: undefined,
  //   end: undefined,
  // },
  projects: undefined,
  offices: undefined,
});

const options = ref({
  projects: null,
  offices: null,
});
const colors = ref()
// computed

const projectOptions = computed(()=>{
  let value = []
  if(studiosStore.projectsFilter.data.length){
    value =  studiosStore.projectsFilter.data.map(item => {
      return {title: item.name, id: item.id}

    })
  }
  return value
})
const officesOptions = computed(()=>{
  let value = []
  if(studiosStore.officesFilter.data.length){
    value =  studiosStore.officesFilter.data.map(item => {
      return {title: item.name, id: item.id}

    })
  }
  return value
})

const chartTableColors = ref([])

 const chartData = computed(()=>{
   chartTableColors.value = []
   let quantity = 0
  const transformedData = chartStore.chartData.reduce((result, item) => {
    result.labels.push(item.date);

    item.projects.forEach((project) => {
      const existingProject = result.datasets?.find((p) => p.label === project?.name);
      if (existingProject) {
        existingProject.data.push(project.mm);
      } else {
        chartTableColors.value.push({name: project.name, color:  colors.value?.borderColors[quantity]})
        result.datasets.push({
          label: project?.name,
          backgroundColor:   colors.value?.backgroundColors[quantity],
          borderColor: colors.value?.borderColors[quantity],
          fill: 'stack',
          data: [project.mm] });
      }
      quantity++
    });

    return result;
  }, { labels: [], datasets: [] });
   console.log('data',transformedData)
  return transformedData
})
const doughnutChartData = computed(()=>{
  const transformedData = chartStore.chartData?.map(item => ({
    labels: item.projects.length?  item.projects?.map(project => project?.name):[],
    datasets: [{
      backgroundColor:   item.projects?.map((project, index) => colors.value?.backgroundColors[index]),
      borderColor: item.projects?.map((project, index) => colors.value?.borderColors[index]),
      data: item.projects?.map(project => project?.mm)
    }]
  }));
  return transformedData?.length > 0? transformedData[0]: []
})
// methods
const log = (e: MouseEvent) => {
  // console.log(e);
  thisMonth.value = "";
};
const refreshLegend = (legend) => {
  areaLegend.value = legend;
};
const selectedMonth = (month) => {
  thisMonth.value = month;
};

// watch
watch(projectOptions,()=>{
  options.value.projects = projectOptions.value

}, )
watch(officesOptions,()=>{
  options.value.offices = officesOptions.value
}, )

watch([activeKey, filters.value, dateStart, dateEnd], async ()=>{

  if(activeKey.value !== '1' && dateStart.value){
    thisMonth.value = dayjs(dateStart.value).format("YYYY-MM")
    await getStudioAreaChartData({
      date_from: dayjs(dateStart.value).format("YYYY-MM-01"),
      studio_id:  [route.params.id],
      office_id: filters.value.offices,
      project_id: filters.value.projects
    })
  }else if(dateStart.value && dateEnd.value ){
      await getStudioAreaChartData({
      date_from: dayjs(dateStart.value).format("YYYY-MM-01"),
      date_to: dayjs(dateEnd.value).format("YYYY-MM-01"),
      studio_id:  [route.params.id],
      office_id: filters.value.offices,
      project_id: filters.value.projects
    })
  }

}, {deep: true})

// hooks
onMounted( ()=>{
   getProjectsFiltersOptions({studios_ids: [route.params.id]})
   getOfficesFiltersOptions({studios_ids:  [route.params.id]})
   colors.value = generateColors()
   getStudioAreaChartData({
    date_from: dayjs(dateStart.value).format("YYYY-MM-01"),
    date_to: dayjs(dateEnd.value).format("YYYY-MM-01"),
    studio_id:  [route.params.id]// Saber Core
  })

})
</script>


<template>
  <StudiosTabs>
    <template #projects>
      <section class="studios-projects">
        <div class="studios-projects__filters">
          <div class="studios-projects__filters-header">
            <h3>Filters</h3>
          </div>

          <div class="studios-projects__filters-content">
            <label class="studios-projects__filters-content-label"
            >Month or period</label
            >
            <div
                style="
                margin-top: 0;
                align-items: center;
                display: flex;
                justify-content: space-between;
              "

            >
              <a-date-picker v-model:value="dateStart" picker="month"  :class="activeKey !== '1' ? 'oneDatePicker' : ''"  />
              <IconArrowRight v-if="activeKey === '1' "/>
              <a-date-picker
                  v-if="activeKey === '1' "
                  v-model:value="dateEnd"
                  picker="month"
              />
            </div>
            <CustomSelect
                v-model="filters.offices"
                :options="options.offices"
                select-title="Offices"
            />
            <CustomSelect
                v-model="filters.projects"
                :options="options.projects"
                select-title="Projects"
            />
          </div>
        </div>
        <div class="studios-projects__charts">
          <div class="studios-projects__charts-header">
            <div class="studios-projects__charts-header__title">
              <h3>Studios load</h3>
            </div>
            <div class="studios-projects__charts-header__icons" style="">
              <span @click="activeKey = '1'">
                <IconLineChart :active-key="activeKey" />
              </span>
              <tooltip content="Only for one month">
                <span
                    @click.stop.prevent="activeKey = '2'"
                    :class="{ disabled: disabledCharts }"
                >
                  <IconBarChart
                      :activeKey="activeKey"
                      :disabled="disabledCharts"
                  />
                </span>
              </tooltip>

              <tooltip content="Only for one month">
                <span
                    @click.stop.prevent="activeKey = '3'"
                    :class="{ disabled: disabledCharts }"
                >
                  <IconPieChart
                      :activeKey="activeKey"
                      :disabled="disabledCharts"
                  />
                </span>
              </tooltip>
            </div>
          </div>
          <div class="studios-projects__charts-tabs">
            <AreaChart
                v-if="activeKey === '1'"
                :chartData="chartData"
                :areaLegend="areaLegend"
                @refresh-currentMonth="selectedMonth"
            />
            <BarChart
                v-else-if="activeKey === '2'"
                :chartData="chartData"
                :areaLegend="areaLegend"
                :dateStart="dateStart"
            />
            <DoughnutChart
                v-else-if="activeKey === '3'"
                :chartData="doughnutChartData"
                :areaLegend="areaLegend"
            />
          </div>
          <div class="studios-projects__charts-list">
            <div class="studios-projects__charts-list__header">
              <span class="studios-projects__charts-list__header__projects"
              >Project list</span
              >
              <span class="studios-projects__charts-list__header__departments">
                Departments statistics
                <span
                    v-if="activeKey !== '1'"
                    class="studios-projects__charts-list__header__month"
                    style=""
                >{{ dayjs(dateStart).format("MMMM,YYYY") }}</span
                >
                <a-tag
                    v-if="activeKey === '1'"
                    class="table-month"
                    :visible="!!thisMonth"
                    closable
                    @close="log"
                >{{ thisMonth }}</a-tag
                >
              </span>
            </div>

            <ChartsTable
                @refresh-legend="refreshLegend"
                :thisMonth="thisMonth? thisMonth: dayjs().format('YYYY-MM')"
                :activeKey="activeKey"
                :chartTableColor="chartTableColors"
                :filters="filters"
                :dateStart="dateStart"
                :dateEnd="dateEnd"

            />
          </div>
          <div style="margin-top: 100px"></div>
        </div>
      </section>
    </template>
  </StudiosTabs>
</template>



<style scoped lang="scss">
.oneDatePicker {
  width: 550px !important;
}
.disabled {
  pointer-events: none;
  opacity: 0.5;
}
.ant-picker {
  width: 11rem;
}
.table-month {
  padding-left: 10px;
  margin-left: 10px;
  background: $neutrals-background-semi;
}
.studios-projects {
  display: flex;
  flex-flow: row;
  border: 1px solid $neutrals-border-default;
  border-radius: 8px;

  &__filters {
    flex: none;
    width: 21%;
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
  }

  &__filters-content-label {
    @include Body-M;
    color: $neutrals-text-secondary;
  }

  &__charts {
    width: 100%;
  }

  &__charts-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;

    &__title {
      h3 {
        @include Title-H3;
        margin-bottom: 0;
      }

      span {
        @include Body-M-14-Regular;
        color: $neutrals-text-hint;
      }
    }

    &__icons {
      width: 88px;
      height: 24px;
      border-radius: 8px;
      background: #f4f5f8;
      display: flex;
      align-items: baseline;
      cursor: pointer;

      span {
        width: 33px;
      }
    }
  }

  &__charts-list {
    margin-top: 10px;
    max-width: 1470px;
    &__header {
      display: flex;
      @include Body-M-14-Bold();
      background-color: $neutrals-background-weak;
      color: $neutrals-text-hint;

      &__projects {
        height: 2.25rem;
        width: 16.75rem;
        padding: 8px 12px;
        border: 1px solid $neutrals-border-default;
      }
      &__departments {
        height: 36px;
        width: 100%;
        padding: 8px 12px;
        border: 1px solid $neutrals-border-default;
      }
      &__month {
        margin-left: 10px;
        padding: 2px 8px;
        border-radius: 4px;
        background-color: $neutrals-background-semi;
        color: $neutrals-text-primary;
        @include Body-S-12-Regular;
      }
    }
  }
}
</style>
