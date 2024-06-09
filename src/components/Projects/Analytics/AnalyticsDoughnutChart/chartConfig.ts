import {ref} from "vue";
import {Chart as ChartJS} from "chart.js";

const someVariable = 'Hello, Volar!';

export const textCenter = {
    id: 'doughnutChartTextCenter',
    beforeDatasetsDraw(chart, args, pluginOptions) {
        const {ctx, data} = chart;
        ctx.save()
        const xCoor = chart.getDatasetMeta(0).data[0].x
        const yCoor = chart.getDatasetMeta(0).data[0].y
        ctx.font = 'bold 1.25rem sans-serif'
        ctx.fillStyle = '#576B8B'
        ctx.fontWeight = 600
        ctx.textAlign = 'center'
        ctx.fillText(`${data.datasets[0].data.reduce((acc, item)=> acc+item,0)} MM`, xCoor, yCoor)
    }
}

