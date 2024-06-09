<template>
  <div class="chart">
    <Bar ref="analyticsBarChartRef" :data="data" :options="options" />
  </div>
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors,
} from "chart.js";
import { Bar } from "vue-chartjs";
import dayjs from "dayjs";
import zoomPlugin from 'chartjs-plugin-zoom';
ChartJS.register(
  zoomPlugin,
  CategoryScale,
  PointElement,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
  Colors
);

export default {
  name: "AnalyticsBarChart",
  components: {
    Bar,
  },
  props: {
    areaLegend: {},
    dateStart: null,
    chartData: { type: Object },
  },
  data() {
    return {
      type: "bar",
      data: {
        datasets: [],
        labels: []
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        barPercentage: ()=>this.barPercentageComputed,
        plugins: {
          areaChartTransitionLIne: false,
          doughnutChartTextCenter: false,
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#FFFFFF",
            bodyColor: "#162138",
            borderColor: "#E2E5EA",
            padding: 10,
            boxPadding: 5,
            usePointStyle: true,
            titleColor: "#576B8B",
            titleMarginBottom: 10,
            borderWidth: 2,
            callbacks: {
              label: (tooltipItems) => {
                const itemName = tooltipItems.dataset.label;
                const itemValue = tooltipItems.parsed.y;

                return `${itemName}  ${itemValue}  MM `;
              },
              //
            },
          },
          zoom: {
            pan:{
              enabled: true,
              mode: 'x'
            },
            zoom: {
              wheel:{
                enabled: true
              },
              mode: 'x'
            }
          }
        },
        scales: {
          y: {
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
          null
        },
      },
    };
  },
  computed: {
    barPercentageComputed() {
      return this.data.datasets.length >3 ? 1 :0.5;
    },
  },
  // Watch
  watch: {
    areaLegend: {
      handler(val) {
        const lineChartComponent = this.$refs.analyticsBarChartRef;
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
    dateStart: {
      handler(val) {
        const newVal = String(dayjs(val).format("MMMM,YYYY"));
        this.data = { ...this.data, labels: [newVal] };
      },
      immediate: true,
    },
    chartData: {
      handler(val) {
        this.data = val
      },
      immediate: true
    }
  },
};
</script>
<style scoped lang="scss">
.chart {
  width: 100%;
  height: 35vh;
}
</style>
