<template>
  <div class="chart" >
    <Doughnut ref="doughnutChartRef" :data="data" :options="options"  />
  </div>

</template>

<script lang="ts">
import {
  Chart as ChartJS,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import dayjs from "dayjs";
import {textCenter} from "@/components/Studio/Charts/DoughnutChart/chartConfig";

ChartJS.register(
    textCenter,
    ArcElement,
    DoughnutController,
    Title,
    Tooltip,
)

export default {
  name: 'DoughnutChart',
  components: {
    Doughnut
  },
  props: {
    areaLegend: {},
    chartData:{
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          backgroundColor:   [],
          borderColor: [],
          data: []
        }]
      },
      options: {
        responsive: true,
        elements: {
          arc: {
            circular: true
          }
        },
        plugins: {
          areaChartTransitionLIne: false,
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
              title: (context) => {
                const {type, data} = context[0].chart.config
                if( type === 'doughnut'){
                  return  data.datasets[0].label;
                }
              },
              // title: (context) => {
              //   console.log(context)
              //   const {type, data} = context[0].chart.config
              //   if( type === 'doughnut'){
              //     return  data.labels[0];
              //   }
              // },
              label: (tooltipItems) => {
                const itemName = tooltipItems.label
                const itemValue = tooltipItems.parsed
                return  `${itemName}  ${itemValue}  MM `
              },
              //
            }
          },
          // emptyDoughnut: {
          //   color: 'rgba(255, 128, 0, 0.5)',
          //   width: 2,
          //   radiusDecrease: 20
          // }
        },
        scales: {
          y: {
            position: 'right',
            display: false,
            // grid: {
            //   display: false,
            // },
            // ticks: {
            //   display: false
            // },
            // title: {
            //   display: true,
            //   text: 'Projects load (MM)',
            //   font: 12,
            //   padding: 20,
            // }
          }
        },
        onClick: (e:any) => {
          // let img = new Image(10, 10)
          // img.src = arrowImage
          // const l = new CanvasRenderingContext2D()
          // l.drawImage(img)
          console.log(111, e.chart.tooltip.dataPoints)
        },
      },
    }
  },

// Watch
  watch: {
    areaLegend: {
      handler(val) {
        const doughnutChartComponent = this.$refs.doughnutChartRef;
        if (doughnutChartComponent) {
          const doughnutChart = doughnutChartComponent.chart;
          const {type} = doughnutChartComponent.chart.config;
          if(type === 'pie' || type === 'doughnut'){
            doughnutChart.toggleDataVisibility(val.index)
          }
          doughnutChart.update()
        }
      }
    },
    chartData: {
      handler(val) {
        console.log('bublik', val)
        if (val){
          this.data = val
        }
        },

      immediate: true,

    }
  }
}
</script>
<style scoped lang="scss">
.chart {
  max-width: 1460px;
  height: 35vh;
  margin-bottom: 20px;
  align-items: center;
  display: flex;
  justify-content: center;
}

</style>