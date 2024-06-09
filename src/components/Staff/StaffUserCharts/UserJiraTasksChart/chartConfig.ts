import {ref} from "vue";
import type { Dayjs } from 'dayjs';
import {Chart as ChartJS} from "chart.js";
import {ChartData} from 'chart.js';
const someVariable = 'Hello, Volar!';

// export const test ={
//     data1:  [{x: 'January', y: 30}, {x: 'February', y: 71}, {x: 'March', y: 35}, {x: 'April', y: 30}, {x: 'May', y: 29}, {x:'June', y: 71}, {x: 'July', y: 30}],
//     data2:  [{x: 'January', y: 30}, {x: 'February', y: 29}, {x: 'March', y: 35}, {x: 'April', y: 30}, {x: 'May', y: 29}, {x:'June', y: 65}, {x: 'July', y: 30}],
//     data3:  [{x: 'January', y: 30}, {x: 'February', y: 29}, {x: 'March', y: 35}, {x: 'April', y: 30}, {x: 'May', y: 29}, {x:'June', y: 55}, {x: 'July', y: 30}],
//     data4:  [{x: 'Pitch > Concept'}, {x: 'Concept > Content Complete' }, {x: ''}, {x: ''}, {x: 'Feasibility > Prototype' }, {x:''}, {x: ''}],
// }

// export const datasets: ChartData <'line', {key: string, value: number} []> = {
//     datasets: [{
//         data: [{key: 'Sales', value: 20}, {key: 'Revenue', value: 10}],
//         parsing: {
//             xAxisKey: 'key',
//             yAxisKey: 'value'
//         }
//     }],
// };
// type ProjectType = {
//     Ardena: number,
//     Magnus: number,
//     Snow_Runner: number,
// }



export const test =[
    {month: 'January', transition:  'Pitch > Concept', project: {Art: 20, It: 25, Outsource: 35, HR: 55}},
    {month: 'February', project: {Art: 30, It: 35, Outsource: 47, HR: 55}},
    {month: 'March', project: {Art: 35, It: 45, Outsource:  35, HR: 55}},
    {month: 'April',  project: {Art: 40, It: 35, Outsource:  47, HR: 55}},
    {month: 'May', transition: 'Concept > Content Complete', project: {Art: 50, It: 55, Outsource: 35, HR: 55}},
    {month: 'June',  transition:  'Feasibility > Prototype', project: {Art: 55, It: 65, Outsource: 35, HR: 55}},
    {month: 'July', project: {Art: 30, It: 45, Outsource: 25, HR: 55}},
]
type RangeValue = [Dayjs, Dayjs];
export const datePeriod =ref<RangeValue>()
 export const getDatasets = ()=>{
    let datases = []

    let keys = Object.keys(test[0].project)
    test.forEach((item, index)=>{
        if(!keys[index]){
            return
        }
        const data = {
            label: undefined,
            fill: 'stack',
            data: test as unknown as number[],
            parsing: {
                yAxisKey: 'project.Ardena',
                xAxisKey: 'month',
            },
        }
        if (keys[index] in item.project){
            data.label = keys[index]
        }
       data.parsing.yAxisKey = 'project'+'.'+ keys[index]
       data.parsing.xAxisKey = 'month'
       datases.push(data)
    } )
    return datases
}
// console.log(555, foo())
    // data4:  [{x: 'Pitch > Concept'}, {x: 'Concept > Content Complete' }, {x: ''}, {x: ''}, {x: 'Feasibility > Prototype' }, {x:''}, {x: ''}],
// ]
// export const transitionLIne = {
//     id: 'areaChartTransitionLIne',
//     afterDatasetsDraw(chart, args, pluginOptions) {
//         const {ctx, data, chartArea: {top, bottom, left, right}, scales: {x, y}} = chart;
//         // console.log(555, data)
//         ctx.save()
//         ctx.beginPath()
//         ctx.lineWidth = 1;
//         ctx.moveTo(x.getPixelForValue('February'), top)
//         ctx.lineTo(x.getPixelForValue('February'), bottom)
//         ctx.stroke()
//         // ctx.fillText(`${data.datasets[0].data.reduce((acc, item)=> acc+item,0)} MM`, xCoor, yCoor)
//     }
// }

