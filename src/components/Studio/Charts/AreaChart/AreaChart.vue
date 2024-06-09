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
  Filler,

} from 'chart.js'
import { Line } from 'vue-chartjs'
import {getDatasets} from "@/components/Projects/Analytics/AnalyticsAreaChart/chartConfig";
import {useStudioAreaChartData} from "@/stores/charts";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

export default {
  name: 'AreaChart',
  components: {
    Line
  },
  props: {
    areaLegend: {},
    chartData:{
      type: Object,
      default: () => {},
    }
  },
 emits: ['refresh-currentMonth'],

  data() {

    return {
      currentMonth: '',
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
        animation: {
          duration: 200
        },
        type: 'line',
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          // point: {
          //   pointBorderWidth: 3,
          //   pointBackgroundColor: 'white',
          //   pointStyle: (e) => {
          //     if(e.raw.y >= 70){
          //       return 'triangle'
          //     }else{
          //       return 'circle'
          //     }
          //   },
          //   radius: (e) => {
          //       if(e.raw.y >= 70){
          //         return 10
          //       }else{
          //         return 5
          //       }
          //     },
          //   pointHoverRadius: (e) => {
          //     if(e.raw.y >= 70){
          //       return 10
          //     }else{
          //       return 5
          //     }
          //   },
          //   hoverBorderWidth: 5,
          //   rotation: 90,
          // },
          // line: {
          //   // borderWidth: 3
          // }
        },
        plugins: {
        areaChartTransitionLIne:  false,
        doughnutChartTextCenter: false,
        legend: {
          display: false,
        },
          title: {
            display: false,
            text: (ctx) => 'Chart.js Line Chart - stacked=' + ctx.chart.options.scales.y.stacked
          },
          tooltip: {
            mode: 'index',
            position: 'nearest',
            backgroundColor: '#FFFFFF',
            bodyColor: '#162138',
            borderColor: '#E2E5EA',
            footerColor: '#162138',
            bodySpacing: 5,
            padding: 10,
            boxPadding: 5,
            usePointStyle: true,
            footerMarginTop: 10,
            titleColor: '#576B8B',
            titleMarginBottom: 10,
            borderWidth: 2,
            callbacks: {
              footer: (tooltipItems) => {

                let sum = 0;

                tooltipItems.forEach(function(tooltipItem) {
                  sum += tooltipItem.parsed.y;
                });
                return 'Total: ' + sum.toFixed(2) + ' mm';
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
                  return itemValue > 2
                      ? [
                        `${itemName}  ${itemValue}  MM `,
                        "Concept > Content Complete",
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
               }

            }
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
              text: 'Month'
            }
          },
          y: {
            stacked: true,
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
          this.currentMonth = e.chart.tooltip.dataPoints[0].label
        },
      },

    }
  },
// methods: {
//    getData (){
//     const transformedData = chartStore.chartData.reduce((result, item) => {
//       result.labels.push(item.date);
//
//       item.projects.forEach((project) => {
//         const existingProject = result.datasets.find((p) => p.label === project.name);
//         if (existingProject) {
//           existingProject.data.push(project.mm);
//         } else {
//           result.datasets.push({ label: project.name, data: [project.mm] });
//         }
//       });
//
//       return result;
//     }, { labels: [], datasets: [] });
//
//     console.log('dddddd',transformedData);
//
//     return transformedData
//   }
// },

  // Watch
  watch: {
    areaLegend: {
      handler(val){
        const lineChartComponent = this.$refs.lineChartRef;
        if (lineChartComponent) {
          const chartInstance = lineChartComponent.chart;

          const isVisible = chartInstance.isDatasetVisible(val.index)
          if(isVisible === true){
            chartInstance.hide(val.index)
          }
          if(isVisible === false) {
            chartInstance.show(val.index)
          }
        }
       },
      immediate: true
    },

    currentMonth: {
      handler(val) {
       this.$emit('refresh-currentMonth', val)
      }
    },
    chartData: {
      handler(val) {
        console.log('val', val)
        this.data = val
      },
      immediate: true
    }
  },



}

// hooks


// Emits

</script>

<template>
  <div class="chart" >
    <Line ref="lineChartRef" :data="data" :options="options" />
  </div>

</template>

<style scoped lang="scss">
    .chart {
      max-width: 1460px;
      width: 100%;
      height: 50vh
    }

</style>