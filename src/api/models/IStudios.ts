interface Office {
  id: number;
  name: string;
  shortname: string;
  is_outsource: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
  updated_at: string;
}

export interface IData {
  id: number;
  name: string;
  staff: number;
  offices: Office[] | [];
  projects: Project[] | [];
}

export interface IStudiosList {
  data: IData[];
}

export type IOptionItem = {
  id: number;
  name: string;
};

export type IOptionData = {
  data: IOptionItem[]
};


export interface IOfficeOptionItem {
  id: number;
  name: string;
  shortname: string;
  is_outsource: number;
}

export interface IOfficesOptions {
  data: IOfficeOptionItem[];
}

export interface IStudiosStore {
  studiosList: IStudiosList,
  studiosFilter: IOptionData,
  projectsFilter: IOptionData,
  officesFilter: IOfficesOptions,
  studiosStaff: IStudioStaff,
  studioName: IStudioNameType | null
}

export interface IStudiosParams {
  studiosId?: number[] | string[]
  projectsId?: number[] | string[]
  officesId?: number[] | string[]
}

export interface IFilters {
  studio_ids?: number[] | null,
  project_ids?: number[] | null,
  office_ids?: number[] | null,
}

export interface IStudioStaffCount {
  data: IStudioStaff

}

export type IStudioStaff = {
  staff_count: number,
  staff_fired_count: number
  staff_new_count: number
}

export interface IStudioName {
  data: IStudioNameType
}

export type IStudioNameType = {
  name: string
}
