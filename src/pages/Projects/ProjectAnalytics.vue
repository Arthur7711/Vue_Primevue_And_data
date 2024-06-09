<script setup lang="ts">
// import
import dayjs from "dayjs";
import Tooltip from "@/components/Tooltip.vue";
import IconLineChart from "@/components/icons/IconLineChart.vue";
import IconBarChart from "@/components/icons/IconBarChart.vue";
import IconArrowRight from "@/components/icons/IconArrowRight.vue";
import IconPieChart from "@/components/icons/IconPieChart.vue";
import { ref, watch, onMounted, computed } from "vue";
import AnalyticsAreaChart from "@/components/Projects/Analytics/AnalyticsAreaChart/AnalyticsAreaChart.vue";
import AnalyticsDoughnutChart from "@/components/Projects/Analytics/AnalyticsDoughnutChart/AnalyticsDoughnutChart.vue";
import AnalyticsChartsTable from "@/components/Projects/Analytics/AnalyticsChartsTable.vue";
import { analysticDepartmentsChart } from "@/api/charts";
import type { IDepartmentItem } from "@/api/models/ICharts";
import { getOfficesOptions, getStudiosOptions } from "../../api/studios";
import { getDepartments } from "../../api/projects";
import { getRandomColor } from "@/utils/getRabdomColor";
import type { IBarChartData, ILineChartData } from "./types";
import { generateColors } from "@/assets/scss/chartColors";
import { useRoute } from "vue-router";

const monthFormat = "MMMM,YYYY";
const route = useRoute();
const options = ref({
  studios: undefined,
  offices: undefined,
  departaments: undefined,
});
const activeKey = ref("1");
const disabledCharts = ref(false);
const areaLegend = ref({});
const thisMonth = ref("");
const makeRander = ref(1);
const periods = ref({
  headcount_min: 0,
  headcount_max: 0,
  mm_min: 0,
  mm_max: 0,
});
const filters = ref({
  date: {
    start: dayjs().subtract(1, "month"),
    end: dayjs().subtract(0, "month"),
  },
  studios: undefined,
  offices: undefined,
  departaments: undefined,
});
const analysticDepartments = ref<null | IDepartmentItem[]>(null);
const lineChart = ref<null | ILineChartData[]>(null);
const barChartChart = ref<IBarChartData>({
  labels: [],
  datasets: [],
});
const pieChart = ref({
  labels: [],
  datasets: [
    {
      label: "",
      data: [],
      backgroundColor: [],
    },
  ],
});
const tableData = ref<null | { headcount: number; mm: number; name: string }[]>(
  null
);
const colors = ref();
const coloredData = ref([]);

const log = (e: MouseEvent) => {
  thisMonth.value = "";
};
const refreshLegend = (legend) => {
  areaLegend.value = legend;
};
const selectedMonth = (month) => {
  thisMonth.value = month;
};
const getMinMax = () => {
  if (analysticDepartments.value) {
    const data = analysticDepartments.value;
    let minheadcount = Infinity;
    let maxheadcount = 0;
    let minmm = Infinity;
    let maxmm = 0;
    data?.[0]?.departments?.forEach((el) => {
      if (el) {
        if (el.headcount > maxheadcount) {
          maxheadcount = el.headcount;
        }
        if (el.headcount < minheadcount) {
          minheadcount = el.headcount;
        }
        if (el.mm > maxmm) {
          maxmm = el.mm;
        }
        if (el.mm < minmm) {
          minmm = el.mm;
        }
      }
    });
    periods.value = {
      headcount_min: minheadcount,
      headcount_max: maxheadcount,
      mm_min: minmm,
      mm_max: maxmm,
    };
    tableData.value =
      analysticDepartments.value?.length && thisMonth.value
        ? analysticDepartments.value?.find((el) => el.date === thisMonth.value)
            ?.departments
        : [];
    barChartChart.value.datasets =
      analysticDepartments.value?.[0]?.departments?.map((el) => {
        return {
          label: el.name,
          data: [el.mm],
          backgroundColor: getRandomColor(),
        };
      });
    pieChart.value = {
      labels: analysticDepartments.value?.[0]?.departments?.map(
        (el) => el.name
      ),
      datasets: [
        {
          backgroundColor: analysticDepartments.value?.[0]?.departments?.map(
            () => getRandomColor()
          ),
          data: analysticDepartments.value?.[0]?.departments?.map(
            (el) => el.mm
          ),
          label: "",
        },
      ],
    };
    lineChart.value = analysticDepartments.value.map((el) => {
      return {
        parsing: {
          xAxisKey: "month",
          yAxisKey: el.date,
        },
        fill: "stack",
        label: el.date,
        data: [
          {
            month: el.date,
            transition: "Pitch > Concept",
            project: {
              ART: 9.44,
              Bytex: 0.46,
              Directors: 5.75,
            },
          },
        ],
      };
    });
    makeRander.value += 1;
  }
};
onMounted(async () => {
  getOfficesOptions({ projects_ids: [Number(`${route.params.project}`)] }).then(
    ({ data }) =>
      (options.value.offices = data.map((el) => {
        return { title: el.name, id: el.id };
      }))
  );
  getStudiosOptions({ projects_ids: [Number(`${route.params.project}`)] }).then(
    ({ data }) => {
      options.value.studios = data.map((el) => {
        return { title: el.name, id: el.id };
      });
    }
  );
  getDepartments({ projects_ids: [Number(`${route.params.project}`)] }).then(
    ({ data }) => {
      options.value.departaments = data.map((el: string) => {
        return { title: el, id: el };
      });
    }
  );
  colors.value = generateColors();
  const departament = await analysticDepartmentsChart({
    date_from: dayjs(filters.value.date.start).format("YYYY-MM-DD"),
    date_to: dayjs(filters.value.date.end).format("YYYY-MM-DD"),
  });
  analysticDepartments.value = departament.data;
  getMinMax();
  thisMonth.value = dayjs(filters.value.date.start).format("YYYY-M");
});

watch(
  [filters],
  async () => {
    getStudiosOptions({
      projects_ids: [Number(`${route.params.project}`)],
      offices_ids: filters?.value?.offices,
    }).then(({ data }) => {
      options.value.studios = data.map((el) => {
        return { title: el.name, id: el.id };
      });
    });
    getOfficesOptions({
      projects_ids: [Number(`${route.params.project}`)],
      studios_ids: filters.value?.studios,
    }).then(
      ({ data }) =>
        (options.value.offices = data.map((el) => {
          return { title: el.name, id: el.id };
        }))
    );
    getDepartments({
      projects_ids: [Number(`${route.params.project}`)],
      offices_ids: filters?.value?.offices,
      studios_ids: filters.value?.studios,
    }).then(({ data }) => {
      options.value.departaments = data.map((el: string) => {
        return { title: el, id: el };
      });
    });
    const departament = await analysticDepartmentsChart({
      date_from: dayjs(filters.value.date.start).format("YYYY-MM-DD"),
      date_to: dayjs(filters.value.date.end).format("YYYY-MM-DD"),
      department: filters.value.departaments,
      office_id: filters.value.offices,
      studio_id: filters.value.studios,
    });
    analysticDepartments.value = departament.data;
    getMinMax();
  },
  { deep: true }
);
watch(thisMonth, () => getMinMax());
watch(
  coloredData,
  () => {
    if (pieChart.value) {
      pieChart.value.datasets[0].backgroundColor = coloredData.value.map(
        (el) => el.color
      );
      // coloredData.value?.map(el=>el.color)
    }
  },
  { deep: true }
);
const chartData = computed(() => {
  let quantity = 0;
  const transformedData = analysticDepartments.value.reduce(
    (result, item) => {
      result.labels.push(item.date);

      item?.departments?.forEach((project) => {
        const existingProject = result.datasets.find(
          (p) => p.label === project.name
        );
        if (existingProject) {
          existingProject.data.push(project.mm);
        } else {
          coloredData.value.push({
            name: project.name,
            color: colors.value?.borderColors[quantity],
          });
          result.datasets.push({
            label: project.name,
            backgroundColor: colors.value.backgroundColors[quantity],
            borderColor: colors.value.borderColors[quantity],
            fill: "stack",
            data: [project.mm],
          });
        }
        quantity++;
      });

      return result;
    },
    { labels: [], datasets: [] }
  );

  return transformedData;
});
</script>
<template>
  <ProjectTabs>
    <template #analytics>
      <section class="projects-analytics">
        <div class="projects-analytics__statistics">
          <div class="projects-analytics__statistics-header">
            <h3>Statistics</h3>
            <span
              >{{
                dayjs(filters.date.start).format("MMMM,YYYY") !== "Invalid Date"
                  ? dayjs(filters.date.start).format("MMMM,YYYY")
                  : ""
              }}
              --
              {{
                dayjs(filters.date.end).format("MMMM,YYYY") !== "Invalid Date"
                  ? dayjs(filters.date.end).format("MMMM,YYYY")
                  : ""
              }}</span
            >
          </div>
          <div class="projects-analytics__statistics-period">
            <div class="projects-analytics__statistics-period__item">
              <div class="projects-analytics__statistics-period__item__title">
                Period headcount
              </div>
              <div class="projects-analytics__statistics-period__item__content">
                <div>
                  <div
                    class="projects-analytics__statistics-period__item__content__title"
                  >
                    Min.
                  </div>
                  <div
                    class="projects-analytics__statistics-period__item__content__value"
                  >
                    {{ periods.headcount_min }}
                  </div>
                </div>
                <div>
                  <div
                    class="projects-analytics__statistics-period__item__content__title"
                  >
                    Max.
                  </div>
                  <div
                    class="projects-analytics__statistics-period__item__content__value"
                  >
                    {{ periods.headcount_max }}
                  </div>
                </div>
              </div>
            </div>
            <div class="projects-analytics__statistics-period__item">
              <div class="projects-analytics__statistics-period__item__title">
                Period MM
              </div>
              <div class="projects-analytics__statistics-period__item__content">
                <div>
                  <div
                    class="projects-analytics__statistics-period__item__content__title"
                  >
                    Start
                  </div>
                  <div
                    class="projects-analytics__statistics-period__item__content__value"
                  >
                    {{ periods.mm_min }}
                  </div>
                </div>
                <div>
                  <div
                    class="projects-analytics__statistics-period__item__content__title"
                  >
                    End
                  </div>
                  <div
                    class="projects-analytics__statistics-period__item__content__value"
                  >
                    {{ periods.mm_max }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="projects-analytics__statistics-filters">
            <div class="projects-analytics__statistics-filters__header">
              <h3>Filters</h3>
            </div>
            <div class="projects-analytics__statistics-filters__content">
              <div
                class="projects-analytics__statistics-filters__content__date"
              >
                <div
                  class="projects-analytics__statistics-filters__content__date-label"
                >
                  Period
                </div>
                <div
                  class="projects-analytics__statistics-filters__content__date-value"
                >
                  <a-date-picker
                    v-model:value="filters.date.start"
                    picker="month"
                    :format="monthFormat"
                    :disabledDate="
                      (current) => {
                        return (
                          current &&
                          current.valueOf() >= dayjs(filters.date.end).valueOf()
                        );
                      }
                    "
                  />
                  <IconArrowRight v-if="activeKey === '1'" />
                  <a-date-picker
                    v-if="activeKey === '1'"
                    v-model:value="filters.date.end"
                    picker="month"
                    :format="monthFormat"
                    :disabledDate="
                      (current) => {
                        return (
                          current &&
                          current.valueOf() <=
                            dayjs(filters.date.start).valueOf()
                        );
                      }
                    "
                  />
                </div>
              </div>
              <div
                class="projects-analytics__statistics-filters__content__item"
              >
                <CustomSelect
                  v-model="filters.studios"
                  select-title="Studios"
                  :options="options.studios"
                  v-if="options.studios"
                />
              </div>
              <div
                class="projects-analytics__statistics-filters__content__item"
              >
                <CustomSelect
                  class="projects-analytics__statistics-filters__content__item__offices"
                  v-model="filters.offices"
                  :options="options.offices"
                  select-title="Offices"
                  v-if="options.offices"
                />
              </div>
              <div
                class="projects-analytics__statistics-filters__content__item"
              >
                <CustomSelect
                  class="projects-analytics__statistics-filters__content__item__departments"
                  v-model="filters.departaments"
                  :options="options.departaments"
                  select-title="Departments"
                  v-if="options.departaments"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="projects-analytics__charts">
          <div class="projects-analytics__charts-header">
            <div class="projects-analytics__charts-header__title">
              <h3>Project load</h3>
            </div>
            <div class="projects-analytics__charts-header__icons" style="">
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
                  @click="activeKey = '3'"
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
          <div class="projects-analytics__charts-tabs">
            <AnalyticsAreaChart
              v-if="activeKey === '1' && lineChart"
              :areaLegend="areaLegend"
              @refresh-currentMonth="selectedMonth"
              :chartData="chartData"
              :key="makeRander"
            />
            <AnalyticsBarChart
              v-if="activeKey === '2'"
              :chartData="chartData"
              :areaLegend="areaLegend"
              :dateStart="filters.date.start"
              :key="makeRander"
            />
            <AnalyticsDoughnutChart
              v-if="activeKey === '3'"
              :areaLegend="areaLegend"
              :dateStart="filters.date.start"
              :chart-data="pieChart"
              :key="makeRander"
            />
          </div>
          <div class="projects-analytics__charts-list">
            <div class="projects-analytics__charts-list__header">
              <span class="projects-analytics__charts-list__header__projects"
                >Departments list</span
              >
              <span
                class="projects-analytics__charts-list__header__departments"
              >
                {{ "Departments statistics" }}
                <span
                  v-if="activeKey !== '1'"
                  class="projects-analytics__charts-list__header__month"
                  style=""
                  >{{ dayjs(filters.date.start).format("MMMM,YYYY") }}</span
                >
                <a-tag
                  v-if="activeKey === '1' && analysticDepartments?.[0]?.date"
                  class="table-month"
                  closable
                  @close="log"
                  :key="thisMonth"
                  >{{ thisMonth }}</a-tag
                >
              </span>
            </div>
            <AnalyticsChartsTable
              @refresh-legend="refreshLegend"
              :thisMonth="thisMonth"
              :activeKey="activeKey"
              :item-list="tableData"
              v-if="tableData"
              :key="makeRander + Number(activeKey)"
              :coloredData="coloredData"
            />
          </div>
        </div>
      </section>
    </template>
  </ProjectTabs>
</template>

<style scoped lang="scss">
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
.projects-analytics {
  display: flex;
  flex-flow: row;
  border: 1px solid $neutrals-border-default;
  border-radius: 8px;

  &__statistics {
    flex: none;
    width: 23%;
    padding: 26px 0;
    border-right: 1px solid $neutrals-border-default;
  }

  &__statistics-header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    padding: 0 20px;

    h3 {
      @include Title-H3;
      margin-bottom: 0;
    }

    span {
      @include Body-S-12-Regular;
      color: $neutrals-text-hint;
      margin-left: 1.5rem;
    }
  }
  &__statistics-period {
    border-width: 1px 0;
    border-style: solid;
    border-color: $neutrals-border-default;
    width: 100%;
    display: flex;
    &__item {
      border-width: 0 1px 0 0;
      border-style: solid;
      border-color: $neutrals-border-default;
      width: 50%;
      &__title {
        text-align: center;
        @include Body-S-12-Bold;
        color: $neutrals-text-secondary;
        padding: 0.5rem;
      }
      &__content {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 0.4rem;
        span > &__title {
          color: $neutrals-text-secondary;
          @include Body-S-12-Regular;
        }
        span > &__value {
          color: $neutrals-text-primary;
          @include Body-M-14-Bold;
        }
      }
    }
  }

  &__statistics-filters {
    //& > * + * {
    //  margin-top: 20px;
    //}
    padding: 26px 20px;
    &__header {
      h3 {
        @include Title-H3;
        margin-bottom: 0;
      }
    }
    &__content {
      &__date {
        margin-top: 20px;
      }
      &__date-label {
        @include Body-M-14-Regular;
        color: $neutrals-text-secondary;
      }
      &__date-value {
        margin-top: 0;
        align-items: center;
        display: flex;
        justify-content: space-between;
      }

      &__item {
        margin-top: 20px;

        &__studios {
          border-radius: 8px;
        }
      }
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
    &__header {
      display: flex;
      @include Body-M-14-Bold();
      background-color: $neutrals-background-weak;
      color: $neutrals-text-hint;

      &__projects {
        height: 2.25rem;
        width: 28.875rem;
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
