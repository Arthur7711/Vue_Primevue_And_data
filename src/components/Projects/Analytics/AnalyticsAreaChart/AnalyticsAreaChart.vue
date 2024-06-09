<template>
  <div class="chart">
    <Line
      ref="analyticLineChartRef"
      :data="data"
      :options="options"
      id="analisticChart"
    />
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
  name: "AnalyticsAreaChart",
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
      tooltipDataIndex: null,
      data: {
        datasets: [],
        labels: []
      },
      options: {
        interaction: {
          intersect: false,
        },
        animation: {
          duration: 200
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
                let index = tooltipItems.datasetIndex

                const itemName = tooltipItems.dataset.label;
                const itemValue = tooltipItems.parsed.y;
                // console.log('tooltip', tooltipItems.datasetIndex)
                if(this.itemIndex !== tooltipItems.dataIndex){
                  this.tooltipDataIndex = null
                  this.sum = null
                  this.chartData?.datasets
                      .slice(5, this.chartData?.datasets.length)
                      ?.forEach((el) => {
                        // console.log('element', el.data[tooltipItems.dataIndex])
                        if(el.data[tooltipItems.dataIndex]){
                          this.sum += el.data[tooltipItems.dataIndex];
                        }

                      });
                }
                if(index > this.tooltipDataIndex){
                  this.tooltipDataIndex = index
                }
                this.itemIndex = tooltipItems.dataIndex

                if (
                    tooltipItems.datasetIndex >= 0 &&
                    tooltipItems.datasetIndex < 5
                ) {
                  return itemValue > 70
                      ? [
                        `${itemName}  ${itemValue}  MM `,
                        "Concept > Content Complete",
                        "------------------------------------",
                      ]
                      : [
                        `${itemName}  ${itemValue}  MM `,
                        "------------------------------------",
                      ];
                } else if (
                  tooltipItems.datasetIndex ===
                  this.tooltipDataIndex
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
          this.currentMonth = e.chart.tooltip.dataPoints[0].label;
        },
      },
    };
  },

  // Watch
  watch: {
    areaLegend: {
      handler(val) {
        const lineChartComponent = this.$refs.analyticLineChartRef;
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
<style lang="scss">
.chart {
  width: 100%;
  height: 35vh;
}
</style>
