import { reactive } from "vue";
import {analysticChartProjects, getChartTableData} from "@/api/charts";
import type {IChartData, IChartTable} from "@/api/models/ICharts";
interface IChartStore {
    chartData: IChartData[]
    chartTable: IChartTable[]
}
const chartStore = reactive<IChartStore>({
    chartData:  [],
    chartTable: []
})
export const useStudioAreaChartData = () => {

    const getStudioAreaChartData =  (params?) => {
        analysticChartProjects(params).then((data=> chartStore.chartData = data.data )).catch((e)=>console.log("getStudioAreaChartData", e));

// console.log('dattta', data.data)
    }
    const getStudioChartTableData =  (params?) => {
        getChartTableData(params).then((data=> chartStore.chartTable = data.data )).catch((e)=>console.log("getStudioChartTableData", e));
    }
    return {
        chartStore,
        getStudioAreaChartData,
        getStudioChartTableData
    }
}



// studiosFilter: {data: []} as IOptionData,
// projectsFilter: {data: []}as IOptionData,
// officesFilter:  {data: []} as IOfficesOptions