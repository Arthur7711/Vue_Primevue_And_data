import {ref} from "vue";
import {Chart as ChartJS} from "chart.js";
import {useStudioAreaChartData} from "@/stores/charts";
const {chartStore}= useStudioAreaChartData()

// const data=  [
//     {
//         date: "2023-1",
//         projects: [
//             {
//                 name: "Office Support",
//                 mm: 50
//             },
//             {
//                 name: "Amber",
//                 mm: 25
//             }
//         ]
//     },
//     {
//         date: "2023-2",
//         projects: [
//             {
//                 name: "Office Support",
//                 mm: 20
//             },
//             {
//                 name: "Amber",
//                 mm: 40
//             }
//         ]
//     }
// ]
const data = chartStore.chartData
// data: {
//     labels: ['march', 'april'],
//         datasets: [
//         {
//             label: 'Ardena',
//             backgroundColor: chartBackgroundColors[0],
//             borderColor: chartBorderColors[0],
//             fill: 'stack',
//             data: [52, 83],
//             // parsing: {
//             //   yAxisKey: 'y',
//             //   xAxisKey: 'x'
//             // },
//         },
//     ]
// }
// export const data = ref({
//     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
//     datasets: [
//         {
//             label: 'Data One',
//             backgroundColor: 'rgba(10, 10, 10, 1)',
//
//             pointRadius: 5,
//             pointHoverRadius: 10,
//             fill: 1,
//             data: [60, 49, 30, 60, 59, 90, 60]
//         },
//         {
//             label: 'Data two',
//             backgroundColor: 'rgba(181, 220, 252, 1)',
//             pointRadius: 5,
//             pointHoverRadius: 10,
//             fill: 2,
//             data: [50, 39, 20, 50, 39, 80, 40]
//         },
//
//
//         {
//             label: 'Data tree',
//             backgroundColor: 'rgba(100, 56, 156, 1)',
//             pointRadius: 5,
//             pointHoverRadius: 10,
//             fill: 'origin',
//             data: [30, 29, 35, 30, 29, 70, 30]
//         },
//     ]
// })

// export const getData = ()=>{
//     console.log('chartStore', data)
//     let chartData = {
//         labels: [],
//         datasets: []
//     }
//     chartData.labels = data.map(item=> item.date)
//     chartData.datasets = data.map((item, index)=> {
//         console.log([item.projects[index]?.mm])
//         return {
//         label: item.projects[index]?.name,
//
//         backgroundColor:   chartBackgroundColors[index],
//         borderColor: chartBorderColors[index],
//         fill: 'stack',
//         data: item.projects?.map(mm => mm.mm),
//     }})
//     // let keys = Object.keys(test[0].project)
//     // test.forEach((item, index)=>{
//     //     if(!keys[index]){
//     //         return
//     //     }
//     //     const data = {
//     //         label: undefined,
//     //         fill: 'stack',
//     //         data: test as unknown as number[],
//     //         parsing: {
//     //             yAxisKey: 'project.Ardena',
//     //             xAxisKey: 'month',
//     //         },
//     //     }
//     //     if (keys[index] in item.project){
//     //         data.label = keys[index]
//     //     }
//     //     data.parsing.yAxisKey = 'project'+'.'+ keys[index]
//     //     data.parsing.xAxisKey = 'month'
//     //     datases.push(data)
//     // } )
//     return chartData
// }
export const config = ref({

    type: 'line',
    data: data,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        mode: 'index',
    },
    options: {
        elements: {
            point: {
                pointStyle: 'rectRounded',
            }
        },
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: (ctx) => 'Chart.js Line Chart - stacked=' + ctx.chart.options.scales.y.stacked
            },
            tooltip: {
                mode: 'index'
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
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
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        }
    },
    onClick: (e:any) => {
        console.log(111, e.chart.tooltip.dataPoints)
    },

})


// export const test ={
//     data1:  [{'x': 'January', 'y': 30}, {'x': 'February', 'y': 71}, {'x': 'March', 'y': 35}, {'x': 'April', 'y': 30}, {'x': 'May', 'y': 29}, {'x':'June', 'y': 71}, {'x': 'July', 'y': 30}],
//     data2:  [{'x': 'January', 'y': 30}, {'x': 'February', 'y': 29}, {'x': 'March', 'y': 35}, {'x': 'April', 'y': 30}, {'x': 'May', 'y': 29}, {'x':'June', 'y': 65}, {'x': 'July', 'y': 30}],
//     data3:  [{'x': 'January', 'y': 30}, {'x': 'February', 'y': 29}, {'x': 'March', 'y': 35}, {'x': 'April', 'y': 30}, {'x': 'May', 'y': 29}, {'x':'June', 'y': 55}, {'x': 'July', 'y': 30}],
// }
export const chartInstances = ChartJS.instances

export const getData =()=>{
    const transformedData = chartStore.chartData.reduce((result, item) => {
        result.labels.push(item.date);

        item.projects.forEach((project) => {
            const existingProject = result.datasets.find((p) => p.label === project.name);
            if (existingProject) {
                existingProject.data.push(project.mm);
            } else {
                result.datasets.push({ label: project.name, data: [project.mm] });
            }
        });

        return result;
    }, { labels: [], datasets: [] });

    console.log('dddddd',transformedData);

    return transformedData
}