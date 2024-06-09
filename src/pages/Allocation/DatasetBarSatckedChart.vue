<template>
  <v-chart ref="myChart" class="chart" :option="option" autoresize  @click="getItem"/>
</template>

<script setup lang="ts" >
import { use }  from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, CustomChart } from 'echarts/charts';
import {

  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components'; 
import VChart, { THEME_KEY } from 'vue-echarts';
import {computed, provide, watch, ref, unref,toRefs, reactive} from 'vue';

use([
  DataZoomComponent,
  DatasetComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

provide(THEME_KEY, 'light');
const myChart=ref()
// const arr = ref([
//       {
//        c: [45, 58, 68, 25, 5]
//       }
// ]
//
// );
// const {c}
//
// // const newObj = toRefs(arr);
//
// const sort = computed(() => {
//   let sorted = arr.value[0].c.sort((a, b)=>a-b)
//   console.log('sorted', sorted)
//   return sorted
//
//   // return { fullName: `${x.value} ${y.value}` };
// });
//
// const handleAdd = () => {
//   arr.value[0].c.push(1)
// };
//
// watch(() => sort.value, () => {
//   console.log('sort', sort.value);
// }, { immediate: true });


const inputData = [
    {name: 'Matcha Latte', value: 21042},
    {name: 'Milsssssssssssssssssssssssk Tea', value: 78254},
    {name: 'Cheese Cocoa', value: 41032},
    {name: 'Cheese Brownie', value: 12755},
    {name: 'Matcha Cocoa', value: 20145},
    {name: 'Tea', value: 20145},
    {name: 'Orange Juice', value: 79146},
    {name: 'Lemon Juice', value: 91852},
]

function transformData(inputData) {
  const result = [['product', 'amount', 'percentage']];
  const total = inputData.reduce((acc, item) => acc + item.value, 0);

  // Сортировка по убыванию значения value
  inputData.sort((a, b) =>a.value - b.value);

  for (const item of inputData) {
    const percentage = ((item.value / total) * 100).toFixed(2);
    result.push([item.name, item.value, percentage + '%']);
  }

  return result;
}


const transformedData = transformData(inputData)

const data = transformedData.flatMap(item=>item[1]).slice(1, transformedData.length)
const percentage = transformedData.flatMap(item=>item[2]).slice(1, transformedData.length)
// console.log(444, transformedData.flatMap(item=>item[0]).slice(1, transformedData.length));


//
// const option= {
//   dataset: {
//     source: transformedData
//   },
//   grid: { containLabel: true },
//   xAxis: { name: 'amount' },
//   yAxis: { type: 'category' },
//   series: [
//     {
//       type: 'bar',
//       encode: {
//         // Map the "amount" column to X axis.
//         x: 'amount',
//         // Map the "product" column to Y axis
//         y: 'product'
//       },
//       label: {
//         fontSize: 10,
//         show: true, //false,
//         position: 'right',
//         formatter: function(e) {
//           // console.log(e.data[e.seriesIndex+1], 'qweqe')
//           let res = 0
//           console.log(e)
//           e.data.forEach((el, i) => {
//             if(typeof el === "number") {
//               res +=el
//             }
//
//
//           })
//
//           res = e.data[e.seriesIndex+1]*100/res
//           return e.data[e.data.length-1]
//         }
//       },
//     }
//   ]
// };



// let dataAxis = ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Cheese Brownie', 'Matcha Cocoa', 'Tea', 'Orange Juice', 'Lemon Juice', 'Walnut Brownie'];
// // prettier-ignore
// let data = [220, 182, 191, 234, 290, 330, 310, 123, 442];
let xMax = 500;
const option = {
  dataset: {
    dimensions: transformedData[0]
  },
  xAxis: {
show: false

  },
  yAxis: {
    data: transformedData.flatMap(item=>item[0]).slice(1, transformedData.length),
    axisLabel: {
      formatter: (value: string) => {
        const max = 13
        return value.length>20? value.substring(0, max)+' ...':value
      }
    }
  },
  grid: {
    right: '20%',
    left: '20%'
  },
  dataZoom: [
    {
      type: 'slider',
      right: '2%',
      start: 50,
      end: 100,
    }
  ],
  series: [
    {
      type: 'bar',
      showBackground: true,
      emphasis: {
      },
      labelLayout: function () {
        return {
          x: myChart.value.getWidth() - 140,
          moveOverlap: 'shiftY'
        };
      },
      label: {
        fontSize: 10,
        show: true, //false,
        position : 'right',
        // align: 'left',
        // verticalAlign: 'middle',
        // distance: 100,
        formatter:  function(e) {
          console.log('data', data)
          return `${e.value}  (${percentage[e.dataIndex]})`
          // console.log(e.data[e.seriesIndex+1], 'qweqe')
          // let res = 0
          // console.log(e)
          // e.data.forEach((el, i) => {
          //   if(typeof el === "number") {
          //     res +=el
          //   }
          //
          //
          // })
          //
          // res = e.data[e.seriesIndex+1]*100/res
          // return e.data[e.data.length-1]
        }
      },
      data: data
    }
  ]
};











</script>

<style scoped>
.chart {
  margin-top: 20vh;
  height:  80vh;
  width:  100vh;
}
</style>


