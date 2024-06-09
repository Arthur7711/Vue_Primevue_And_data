export interface IStudioObject {
  id: number;
  name: string;
  staff: number;
  offices: {
    id: number;
    name: string;
    shortname: string;
    is_outsource: number;
  }[];
  projects: {
    id: number;
    name: string;
    description: string;
    updated_at: string;
  }[];
}
