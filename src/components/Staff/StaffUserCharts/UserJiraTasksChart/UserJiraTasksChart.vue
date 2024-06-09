<script lang="ts">
import {
  Chart as ChartJS,
  Colors,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js/auto";
import { Line } from "vue-chartjs";
import dayjs from "dayjs";

import { datePeriod } from "@/components/Staff/StaffUserCharts/UserAttendanceChart/chartConfig";

ChartJS.register(
  // transitionLIne,
  Colors,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default {
  name: "UserJiraTasksChart",
  components: {
    Line,
  },
  props: {
    areaLegend: {},
    chartData: { type: Object },
  },
  emits: ["refresh-currentMonth"],

  data() {
    return {
      datePeriod: datePeriod,
      currentMonth: "",
      data: this.chartData,
      options: {
        interaction: {
          intersect: false,
        },
        type: "line",
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            pointBorderWidth: 3,
            pointBackgroundColor: "white",
            hoverBorderWidth: 3,
          },
        },
        plugins: {
          doughnutChartTextCenter: false,
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            backgroundColor: "#FFFFFF",
            bodyColor: "#162138",
            borderColor: "#E2E5EA",
            footerColor: "#162138",
            bodySpacing: 5,
            padding: 10,
            boxPadding: 5,
            usePointStyle: true,
            footerMarginTop: 10,
            titleColor: "#576B8B",
            titleMarginBottom: 10,
            borderWidth: 2,
            callbacks: {
              label: (tooltipItems) => {
                const itemName = tooltipItems.dataset.label;
                const itemValue = tooltipItems.parsed.y;

                return `Completed Jira tasks  ${itemValue} `;
              },
              title: function (tooltipItems: { label: string }[]) {
                return dayjs(tooltipItems[0].label).format("MMMM, YYYY");
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            // ticks: {
            //   callback: function (value, index, values,something) {
            //     console.log(something);
            //     var customLabels = ["Jan", "Feb", "Mar", "Apr", "May"];
            //     return customLabels[index];
            //   },
            // },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: "Day of the month",
              font: 12,
              padding: 20,
            },
          },
        },
        onClick: (e: any) => {
          this.currentMonth = e.chart.tooltip.dataPoints[0].label;
        },
      },
    };
  },

  watch: {
    areaLegend: {
      handler(val) {
        const lineChartComponent = this.$refs.userJiraTasksChart;
        if (lineChartComponent) {
          const chartInstance = lineChartComponent.chart;

          const isVisible = chartInstance.isDatasetVisible(val.index);
          if (isVisible === true) {
            chartInstance.hide(val.index);
          }
          if (isVisible === false) {
            chartInstance.show(val.index);
          }
        }
      },
      immediate: true,
    },

    currentMonth: {
      handler(val) {
        this.$emit("refresh-currentMonth", val);
      },
    },
  },
};
// Emits
</script>

<template>
  <div class="chart">
    <Line
      ref="userJiraTasksChart"
      :data="data"
      :options="options"
      style="margin-top: 50px"
    />
    <div class="chart__user-projects">
      <span class="chart__user-projects__circle" />
      <span class="chart__user-projects__item">Completed Jira tasks</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chart {
  height: 45vh;

  &__user-projects {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-left: 60px;
    &__item {
      display: flex;
      align-items: center;
    }
    &__circle {
      width: 8px;
      height: 8px;
      margin-right: 10px;
      background-color: #007bff;
      border-radius: 50%;
    }
  }
}
</style>
