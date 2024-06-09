<template>
  <h2 v-if="!data">loading...</h2>
  <h4 v-else-if="Array.isArray(data)" style="color: #576b8b">No data</h4>
  <Line
    v-else
    ref="chart"
    :data="data"
    :options="options"
    :style="{ width: '100%', maxHeight: '50px' }"
  />
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  Filler,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
  Filler
);

export default {
  name: "ChartMilestoneTable",
  components: {
    Line,
  },
  props: {
    chartData: { type: Object },
    //    {
    //     labels: String[],
    //     datasets: {
    //         data: Number[],
    //         borderColor: String,
    //         backgroundColor: String,
    //         fill: String,
    //       }[]
    //   },
  },
  data() {
    return {
      data: null,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 1,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
            stacked: true,
          },
        },
      },
    };
  },
  //   async mounted() {
  //     const chartData = await getProjectMilesroneChart(this.project_id, this.id);
  //     if (chartData.data.length < 1) {
  //       this.data = chartData.data;
  //     }
  //     if (chartData.data.length > 0) {
  //       this.data = {
  //         labels: chartData.data.map((el) => `${el.month}.${el.year}`),
  //         datasets: [
  //           {
  //             data: chartData.data.map((el) => el.employment_rate),
  //             borderColor: "#1860DC",
  //             backgroundColor: "#AEE9FF",
  //             fill: "start",
  //           },
  //         ],
  //       };
  //     }
  //   },
};
</script>
