import dayjs, { Dayjs } from "dayjs";
export interface IFilters {
    date_from?: Dayjs | undefined,
    date_to?: Dayjs | undefined;
    group_by?: string, 
    project_group_ids?: number[] ;
    project_ids?: number[] | undefined;
    studio_ids?: number[] | undefined;
    office_ids?: number[] | undefined;
    departments?: string[] | undefined;
    divisions?: string[] | undefined;
    team_ids?: number[] | undefined;
    root_user_ids?: number[] | undefined;
    user_ids?: number[] | undefined;
    department_group?: number[] | undefined;
  }
export const OPTION_LIST = ['department_group','projectGroup', 'project', 'studio', 'office', 'department', 'division', 'team', 'rootUser', 'user'] as const

export type Otion_Aliases = 'total' | 'project_group' | 'project'| 'studio'| 'office'| 'department'| 'division'| 'team'

export type TOption = {
    id: number | string;
    title: string;
}

export type IOptions = {
    [key in (typeof OPTION_LIST)[number] as string]: TOption[] | null;
}

// export interface IOptions {
//     projectGroup: TOption[] | null;
//     project: TOption[] | null;
//     name: TOption[] | null;
//     office: TOption[] | null;
//     department: TOption[] | null;
//     division: TOption[] | null;
//     team: TOption[] | null;
//     rootUser: TOption[] | null;
//     user: TOption[] | null;
// }