import {getProjectsGroupsOptions} from '@/api/allocation'


export interface IStackedBarChart {
  data: IStackedBarChartData
}
export interface IStackedBarChartData {
  dates: string[];
  data: {
    name: string;
    data: number[];
  }[];
  sum: number
}
export interface IProjectsGroupsOptions {
  data: {
    id: number;
    name: string
  }[]

}

export interface ITeamsResponse {
  data: {
    id: number;
    name: string
  }[]

}

export interface IUsers {
  id: number,
  samaccountname: string,
  displayname: string,
  avatar_url: string
}

export interface IAllocationParams {
  date_from?: string,
  date_to?: string,
  group_by?: string,
  studio_ids?: number[],
  office_ids?: number[],
  departments?: string[],
  divisions?: string[],
  project_ids?: number[],
  user_ids?: number[],
  team_ids?: number[],
  root_user_ids?: number[],
  project_group_ids?: number[],
  page?: number,
  sort_by?: string,
  sort_type?: string | null,
  search?: string
}

export interface IAllocationTable {
  data?: {
    id: number | string,
    samaccountname: string,
    sn: string,
    givenname: string,
    displayname: string,
    description: string,
    department: string,
    division: string,
    title: string,
    employer_statistic: number
  }[] | null,
  meta: {
    current_page: number
    last_page: number
    limit: number
    total: number
    total_mm?:number
  } | null

}

export interface IAvailableDates {
  data: string[]
}




