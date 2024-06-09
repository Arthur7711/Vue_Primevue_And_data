import {type  IUser } from "@/api/models/IUser";
import {type  IBlockItem } from "@/components/Projects/Information/ProjectInformationBlockItem.vue";

export interface IProject {
  man_month: number;
  milestone:
    | {
        id: number;
        name: string;
        color: string;
      }[]
    | [];
  offices: string[];
  studios: {
    id: number;
    name: string;
    is_internal: number;
  }[];
  project_id: number;
  project_name: string;
}
export interface IProjects {
  data: IProject[];
}
export interface IContactItem {
  about: unknown;
  avatar_url: string;
  avatar_urls: string[];
  born_date: string;
  created_at: string | null;
  department: string;
  department_id: number;
  description: string;
  displayname: string;
  division: string;
  division_id: number;
  fired: number;
  givenname: string;
  head_id: string;
  homephone: string;
  icq: string | null;
  id: number;
  mail: string;
  memberof: string | null;
  mobile: string;
  office: string | null;
  office_id: number;
  personnel_number: string | null;
  phone_manual: number;
  physicaldeliveryofficename: number;
  room_id: number;
  samaccountname: string;
  sid: string | null;
  sn: string | null;
  telegram_username: string;
  title: string;
}
export interface IInfo {
  date_from: string;
  date_to: string;
  id: number;
  largest_concern: string;
  project_id: number;
  updated_at: string;
}
export interface IMilestone {
  color: string;
  created_at: string | null;
  description: string | null;
  id: number;
  name: string;
  updated_at: string | null;
}
export interface IProject {
  created_at: string;
  description: string;
  id: number;
  milestone_id: number;
  name: string;
  producer_email: string;
  updated_at: string;
}
export interface IProjectData {
  contact_mail_dev_creatives: string[];
  contact_mail_dev_producers: string[];
  contact_people_pub_creatives: IContactItem[];
  contact_people_pub_producers: IContactItem[];
  contract_statuses: IContactItem[];
  created_at: string;
  description: string;
  distributions: string[];
  engines: string;
  id: number;
  info: IInfo;
  milestone: IMilestone;
  milestone_id: number;
  name: string;
  platforms: string[];
  producer_email: string;
  project_milestones: {
    comment: string;
    date_end: string;
    date_start: string;
    employer_project_id: number;
    milestone_id: number;
    status: string;
    milestone: IMilestone;
    project: IProject;
  }[];
  pros: string[];
  updated_at: string;
  vs_original_targets: string;
}
export interface IProjectInfo {
  data: IProjectData;
}
export interface IEditProjectInfo {
  info: {
    date_to: string;
    cert1_upload_date: string;
    initial_pros_date: string;
    rtm_date: string;
    largest_concern: string;
    final_cert_date: string;
    main_sku_price: number;
    qa_finalizing_date: string;
    rating_submitted_date: string;
    initial_release_target_date: string;
    qa_finalizing_2_date: string;
  };
  contract_statuses: string[];
  distributions: string[];
  engines: string[];
  platforms: string[];
  pros: string[];
  vs_original_targets: string[];
  contact_mail_dev_creatives: string[];
  contact_mail_dev_producers: string[];
  contact_people_pub_creatives: number[];
  contact_people_pub_producers: number[];
}
export interface IJiraTasks {
  data: {
    created_at: null | string;
    id: number;
    in_progress_bugs: number;
    in_progress_tasks: number;
    link: string;
    open_bugs: number;
    open_tasks: number;
    project_id: number;
    updated_at: null | string;
  };
}
export interface IEditJiraTasks {
  data: Partial<{
    id: number;
    project_id: number;
    link: string;
    open_tasks: number;
    in_progress_tasks: number;
    open_bugs: number;
    in_progress_bugs: number;
    created_at: string;
    updated_at: string;
  }>;
}
export interface IProjectStatics {
  data: {
    total_man_month: number;
    offices: {
      [key: string]: number;
    };
    headcount_by_departments: {
      [key: string]: number;
    };
  };
}
export interface IMIlestones {
  comment: string;
  date_end: string;
  date_start: string;
  employer_project_id: number;
  milestone: {
    id: number;
    name: string;
    color: string;
    description: null | string;
    created_at: null | string;
    updated_at: null | string;
  };
  milestone_id: number;
  avg_headcount: number;
  max_headcount: number;
  min_headcount: number;
  status: string;
  sum_man_month: number;
}
export interface IGetMilestone {
  data: IMIlestones[];
}
export interface IMilestoneHead {
  data: {
    total_man_month: number;
    headcount_by_offices: {
      [key: string]: number;
    };
    headcount_by_departments: {
      [key: string]: number;
    };
  };
}
export interface IMilestoneChartItem {
  employment_rate: number;
  month: number;
  year: number;
}
export interface IProjectLog {
  id: number;
  field: string;
  value_before: string | null;
  value_after: string | null;
  created_at: string;
  user: IUser | null;
}

export interface IProjectDocument {
  id: number;
  size: number;
  origin_file_name: string;
  name: string;
}

export interface IProjectDownloadDocumentHash {
  hash: string;
}
