export interface IDepartmentItem {
  date: string;
  departments: {
    headcount: number;
    mm: number;
    name: string;
  }[];
}

export interface IDepartmentsChart {
  data: IDepartmentItem[];
}

export interface IChartData {
  date: string,
  projects: IChartProjects[]
}

interface IChartProjects {
  name?: string,
  mm?: number
}
export interface IChartDataTable {
  data: IChartTable[]
}
export type IChartTable = {
  [key:string]:string
}