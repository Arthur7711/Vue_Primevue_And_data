export interface IStaffData {
  about: null;
  avatar_url: string;
  born_date: string;
  created_at: string;
  department: string;
  department_id: number;
  description: string;
  displayname: string;
  division: string;
  division_id: null | number;
  employment_rate: number;
  fire_date: null | string;
  fired: number;
  givenname: string;
  head_id: null | number;
  homephone: string;
  icq: string;
  id: number;
  language_id: null | number;
  mail: string;
  memberof: string;
  mobile: string;
  office: {
    id: number;
    name: string;
    shortname: string;
    is_outsource: number;
    studio: { id: number; name: string };
  };
  hire_fire: {
    fired_at: null | string;
    hired_at: string;
    id: number;
    staff_id: number;
  };
  office_id: number;
  personnel_number: null | number;
  phone_manual: number;
  physicaldeliveryofficename: string;
  projects: string[];
  room_id: null | number;
  samaccountname: string;
  sid: string;
  sn: string;
  studio: { id: number; name: string };
  telegram_username: null | string;
  title: string;
}
export interface IStaff {
  data: IStaffData[];
  meta: {
    current_page: number;
    last_page: number;
    limit: number;
    total: number;
  };
}
export interface IGetStaff {
  date_from?: string;
  date_to?: string;
  status?: string;
  project_id?: (number | string)[];
  studio_id?: (number | string)[];
  office_id?: (number | string)[];
  department?: string[];
  position?: string[];
  workload?: string;
  page?: number;
  search?: string;
}
export interface IUserStaff {
  id: 7282;
  samaccountname: string;
  displayname: string;
  description: string;
  department: string;
  division: string;
  title: string;
  fired: number;
  fire_date: string;
  created_at: string;
  physicaldeliveryofficename: string;
  avatar_url: string;
  office: {
    id: number;
    name: string;
    shortname: string;
    is_outsource: number;
  };
  studio: {
    id: number;
    name: string;
    projects: {
      id: number;
      name: string;
    }[];
  };
  head: {
    id: number;
    samaccountname: string;
    displayname: string;
    description: string;
    department: string;
    division: string;
    title: string;
    fired: number;
    fire_date: string;
    created_at: string;
    physicaldeliveryofficename: string;
    avatar_url: string;
  };
}
export interface IStaffStatistic {
  data: {
    last_projects: ["wwz2"];
    last_employment_rate: 5.12;
  };
}
export interface IStaffHistoryItem {
  date_start: string;
  date_end: string;
  employment_rate: number;
  project: {
    id: number;
    name: string;
    description: string;
    updated_at: string;
  };
}
export interface IStaffCount {
  staff_count: number;
  staff_fired_count: number;
  staff_new_count: number;
}
