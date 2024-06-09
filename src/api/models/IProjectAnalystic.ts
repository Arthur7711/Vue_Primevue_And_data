export interface IProjectChart {
  date_from: string;
  date_to?: string;
  studio_id?: number | string[];
  office_id?: number | string[];
  department?: string[];
  project_id?: number | string[];
}
