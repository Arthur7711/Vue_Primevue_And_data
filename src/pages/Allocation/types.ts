import type {Otion_Aliases} from "@/components/SideBar/types";
import type {ISelectedItem} from "@/components/Allocation/Barchart.vue";

export enum ParamsEnum  {
    'total' = 'total',
    'project_group' = 'project_group_ids',
    'project' = 'project_ids',
    'studio' = 'studio_ids',
    'office' = 'office_ids',
    'department' = 'departments',
    'division' = 'divisions',
    'team' = 'team_ids'
}

export interface GroupBy extends ISelectedItem {
    group_By: Otion_Aliases
}

export interface IInitialData {
    date: string[]
    projects: IInitialProjects[]
}
export interface IInitialProjects {
    name: string;
    data: number[]
}

export interface ISeriasFormaterParams {
    $vars: {
        seriesName: string;
        name: string;
        value: number;
    }[];
    borderColor?: undefined;
    color: string;
    componentIndex: number;
    componentSubType: string;
    componentType: string;
    data: number;
    dataIndex: number;
    dataType: null;
    dimensionIndex?: undefined;
    dimensionNames: (string | undefined)[];
    encode: {
        x: number[];
        y: number[];
    };
    name: string;
    marker?: string;
    seriesId: string;
    seriesIndex: number;
    seriesName: string;
    seriesType: string;
    status: string;
    value: number;
}
