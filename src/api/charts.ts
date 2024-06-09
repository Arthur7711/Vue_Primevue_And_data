import { API } from "./axiosInstance";
import { IProjectChart } from "./models/IProjectAnalystic";
import {IChartData, IChartTable, IDepartmentsChart} from "./models/ICharts";

export const analysticDepartmentsChart = async (
  params: IProjectChart
): Promise<IDepartmentsChart> => {
  const { data } = await API.get("/chart/group_by_departments", { params });
  return data;
};
export const analysticChartRate = async (params: IProjectChart) => {
  const { data } = await API.get("/chart/rate", { params });
  return data;
};
export const analysticChartProjects = async (
  params: IProjectChart
): Promise<{ data: IChartData[] }> => {
  const {data}  = await API.get("/chart/group_by_projects", { params });
  return data;
}
export const getChartTableData = async (
    params: IProjectChart
): Promise<{ data: IChartTable[] }> => {
  const { data } = await API.get("projects/staff_comp", { params });
  return data;
};
