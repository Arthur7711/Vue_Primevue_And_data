    <template>
      <div class="chart" >
      <Bar ref="barChartRef" :data="data" :options="options" />
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
  Colors
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import dayjs from "dayjs";
import {useStudioAreaChartData} from "@/stores/charts";
// const {chartStore, getStudioAreaChartData}= useStudioAreaChartData()
ChartJS.register(
    CategoryScale,
    PointElement,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend,
    Filler,
    Colors
)

export default {
  name: 'BarChart',
  components: {
    Bar
  },
  props: {
    areaLegend: {},
    chartData:{
      type: Object,
      default: () => {},
    },
    dateStart: null,
  },
  data() {
    return {
      type: 'bar',
      data: {},
      options: {
       responsive: true,
        maintainAspectRatio: false,
        barPercentage: 0.2,
       plugins: {
         areaChartTransitionLIne: false,
         doughnutChartTextCenter: false,
         legend: {
           display: false,
         },
         tooltip: {
           backgroundColor: '#FFFFFF',
           bodyColor: '#162138',
           borderColor: '#E2E5EA',
           padding: 10,
           boxPadding: 5,
           usePointStyle: true,
           titleColor: '#576B8B',
           titleMarginBottom: 10,
           borderWidth: 2,
           callbacks: {
             label: (tooltipItems) => {
               const itemName = tooltipItems.dataset.label
               const itemValue = tooltipItems.parsed.y

               return  `${itemName}  ${itemValue}  MM `
             },
           //
           }
         },
       },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Projects load (MM)',
              font: 12,
              padding: 20,
            }
          }
        },
        onClick: (e:any) => {
          // let img = new Image(10, 10)
          // img.src = arrowImage
          // const l = new CanvasRenderingContext2D()
          // l.drawImage(img)
          // console.log(111, e.chart.tooltip.dataPoints)
        },
      },

    }
  },
// Watch
  watch: {
    areaLegend: {
      handler(val) {
        const barChartComponent = this.$refs.barChartRef;
        if (barChartComponent) {
          const chartInstance = barChartComponent.chart;

          const isVisible = chartInstance.isDatasetVisible(val.index)
          if (isVisible === true) {
            chartInstance.hide(val.index)
          }
          if (isVisible === false) {
            chartInstance.show(val.index)
          }
        }
      },
      immediate: true
    },
    dateStart: {
        handler(val) {
          const newVal = String(dayjs(val).format("MMMM,YYYY"))
          this.data = {...this.data, labels: [newVal]}
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




  }
</script>
<style scoped lang="scss">
    .chart {
      max-width: 1460px;
      width: 100%;
      height: 35vh
    }

</style>