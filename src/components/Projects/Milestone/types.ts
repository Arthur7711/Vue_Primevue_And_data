export interface IMilestoneTable {
  milestone: string;
  comments: string;
  mm: string;
  average_headcount: string;
  headcount_chart: string;
  action: string;
}

export interface ILineChartProps {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}
