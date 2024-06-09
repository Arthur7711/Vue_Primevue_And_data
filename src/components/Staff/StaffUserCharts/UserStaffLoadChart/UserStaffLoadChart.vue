<template>
  <div class="chart">
    <Line
      ref="UserStaffLoadChart"
      :data="data"
      :options="options"
      style="height: 400px; margin-top: 50px"
    />
    <div class="chart__users">
      <div class="chart__user-projects" v-for="item of data?.datasets">
        <span
          class="chart__user-projects__circle"
          :style="{ background: item?.backgroundColor }"
        />
        <span class="chart__user-projects__item">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Chart as ChartJS,
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

ChartJS.register(
  // transitionLIne,
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
  name: "UserStaffLoadChart",
  components: {
    Line,
  },
  props: {
    areaLegend: {},
    chartData: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["refresh-currentMonth"],

  data() {
    return {
      currentMonth: "",
      sum: null,
      itemIndex: null,
      data: {
        datasets: [],
        labels: []
      },
      options: {
        interaction: {
          intersect: false,
        },
        type: "line",
        responsive: true,
        maintainAspectRatio: false,
        elements: {},
        plugins: {
          areaChartTransitionLIne: false,
          doughnutChartTextCenter: false,
          legend: {
            display: false,
          },
          title: {
            display: false,
            text: (ctx) =>
              "Chart.js Line Chart - stacked=" +
              ctx.chart.options.scales.y.stacked,
          },
          tooltip: {
            mode: "index",
            backgroundColor: "#FFFFFF",
            bodyColor: "#162138",
            borderColor: "#E2E5EA",
            footerColor: "#162138",
            bodySpacing: 2,
            padding: 6,
            boxPadding: 6,
            usePointStyle: true,
            footerMarginTop: 6,
            titleColor: "#576B8B",
            titleMarginBottom: 6,
            borderWidth: 0,
            xAlign: "left",
            position: "nearest",
            caretSize: 0,
            boxWidth: 5,
            callbacks: {
              footer: (tooltipItems) => {
                let total = 0;
                tooltipItems.forEach(
                  (tooltipSelf: { datasetIndex: number; raw: number }) => {
                    total += tooltipSelf.raw;
                  }
                );
                if (total) {
                  return "total: " + total.toFixed(2) + " mm";
                }
              },
              label: (tooltipItems ) => {
                const itemName = tooltipItems.dataset.label;
                const itemValue = tooltipItems.parsed.y;

                if(this.itemIndex !== tooltipItems.dataIndex){
                  this.sum = null
                  this.chartData?.datasets
                      .slice(5, this.chartData?.datasets.length)
                      ?.forEach((el) => {
                        this.sum += el.data[tooltipItems.dataIndex];
                      });
                }

                this.itemIndex = tooltipItems.dataIndex

                if (
                    tooltipItems.datasetIndex >= 0 &&
                    tooltipItems.datasetIndex < 5
                ) {
                  return itemValue > 1
                      ? [
                        `${itemName}  ${itemValue}  MM `,
                        // "Concept > Content Complete",
                        "------------------------------------",
                      ]
                      :'';
                } else if (
                    tooltipItems.datasetIndex ===
                    this.chartData?.datasets.length - 1
                ) {
                  return [
                    `Others: ${Number(this.sum)?.toFixed(2)}`,
                    "------------------------------------",
                  ];
                } else {
                  return "";
                }
              },
              title: function (tooltipItems: { label: string }[]) {
                return dayjs(tooltipItems[0].label).format("MMMM, YYYY");
              },
            },
          },
          // filler: {
          //   propagate: true
          // },
          // 'samples-filler-analyser': {
          //   target: 'chart-analyser'
          // }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: "Projects load (MM)",
              font: 12,
              padding: 20,
            },
          },
        },
        onClick: (e: any) => {
          // let img = new Image(10, 10)
          // img.src = arrowImage
          // const l = new CanvasRenderingContext2D()
          // l.drawImage(img)
          // this.currentMonth = e.chart.tooltip.dataPoints[0].label
        },
      },
    };
  },
  watch: {
    areaLegend: {
      handler(val) {
        const lineChartComponent = this.$refs.UserStaffLoadChart;
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
    chartData: {
      handler(val) {
        this.data = val;
      },
      immediate: true,
    },
  },
};
// Emits
</script>
<style scoped lang="scss">
.chart {
  height: 45vh;
  &__users {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  &__user-projects {
    display: flex;
    align-items: center;
    margin-top: 10px;
    margin-left: 30px;
    &__item {
      display: flex;
      align-items: center;
    }
    &__circle {
      width: 8px;
      height: 8px;
      margin-right: 10px;
      // background-color: #007bff;
      border-radius: 50%;
    }
  }
}
</style>
