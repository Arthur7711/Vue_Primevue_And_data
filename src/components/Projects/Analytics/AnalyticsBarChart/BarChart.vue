<template>
  <Bar
    :data="data"
    :options="options"
    style="height: 250px"
    ref="analyticsBarChartRef"
  />
</template>
<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "App",
  props: {
    data: { type: Object },
    areaLegend: {},
    dateStart: null,
  },
  components: {
    Bar,
  },
  data() {
    return {
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        barPercentage: 0.2,
        plugins: {
          doughnutChartTextCenter: false,
          legend: {
            display: false,
          },
        },
      },
    };
  },
  // watch: {
  //   areaLegend: {
  //     handler(val) {
  //       const lineChartComponent = this.$refs.analyticsBarChartRef;
  //       if (lineChartComponent) {
  //         const chartInstance = lineChartComponent.chart;
  //         console.log("chartInstance", chartInstance);
  //         const isVisible = chartInstance.isDatasetVisible(val.index);
  //         if (isVisible === true) {
  //           chartInstance.hide(val.index);
  //         }
  //         if (isVisible === false) {
  //           chartInstance.show(val.index);
  //         }
  //       }
  //     },
  //     immediate: true,
  //   },
  //   dateStart: {
  //     handler(val) {
  //       const newVal = String(dayjs(val).format("MMMM,YYYY"));
  //       this.data = { ...this.data, labels: [newVal] };
  //     },
  //     // immediate: true,
  //   },
  // },
};
</script>
