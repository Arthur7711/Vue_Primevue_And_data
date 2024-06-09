export interface IBarChartData {
  labels: string[];
  datasets: {
    label: string;
    backgroundColor: string;
    data: number[];
  }[];
}
export interface ILineChartData {
  data: {
    month: string;
    project: { [key: string]: number };
    transition?: string;
  }[];
  fill: string;
  label: string;
  parsing: {
    xAxisKey: string;
    yAxisKey: string;
  };
}
