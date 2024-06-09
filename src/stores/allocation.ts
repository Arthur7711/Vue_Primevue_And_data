import { reactive } from "vue";
import {
  getAvailableDates,
  getDivisions,
  getProjectsGroupsOptions,
  getStackedChart,
  getTableData,
  getTeams,
} from "@/api/allocation";
import type {
  IAllocationTable,
  IAvailableDates,
  IProjectsGroupsOptions,
  IStackedBarChart,
  IStackedBarChartData, IAllocationParams,
  ITeamsResponse,
  IUsers,
} from "@/api/models/IAllocation";
import { getDepartments } from "@/api/projects";
import { getStaffListWithAvatars } from "@/api/staff";

export const CHART_GROUPS = [
  "total",
  "department_group",
  "department",
  "division",
  "team",
  "project_group",
  "project",
  "studio",
  "office",
] as const;

export interface IAllocationStore {
  stackedBarchart: IStackedBarChart;
  pieCharts: { [key in (typeof CHART_GROUPS)[number]]: IStackedBarChartData };
  projectsGroupsOptions: IProjectsGroupsOptions;
  departmentOptions: { data: string[] };
  divisionOptions: { data: string[] };
  teamsOptions: ITeamsResponse;
  usersOptions: IUsers[];
  rootUsersOptions: IUsers[];
  allocationTable: IAllocationTable;
  availableDates: IAvailableDates;
  showChartLoader: boolean;
  showPieChartLoader: boolean;
  showTableLoader: boolean;
  showPaginateTableLoader: boolean;
  showSortLoader: boolean;
}

const allocationsStore = reactive<IAllocationStore>({
  stackedBarchart: {} as IStackedBarChart,
  pieCharts: {} as {
    [key in (typeof CHART_GROUPS)[number]]: IStackedBarChartData;
  },
  projectsGroupsOptions: {} as IProjectsGroupsOptions,
  departmentOptions: {} as { data: string[] },
  divisionOptions: {} as { data: string[] },
  teamsOptions: {} as ITeamsResponse,
  usersOptions: [] as IUsers[],
  rootUsersOptions: [] as IUsers[],
  allocationTable: {
    data: null,
    meta: null,
  },
  availableDates: {} as IAvailableDates,
  showChartLoader: false,
  showPieChartLoader: false,
  showTableLoader: false,
  showPaginateTableLoader: false,
  showSortLoader: false,
});

export const useAllocationStore = () => {
  const getStackedBarchart = async (params: IAllocationParams) => {
    allocationsStore.showChartLoader = true;
      getStackedChart(params )
        .then((res) => {
            // console.log('res', allocationsStore.stackedBarchart)
           allocationsStore.stackedBarchart = res;
          allocationsStore.showChartLoader = false;
        })
        .catch((e) => {
          allocationsStore.showChartLoader = false;
          console.log("getStackedBarchart", e);
        });
    };

  const getPieChartData = async (params: IAllocationParams) => {
    allocationsStore.showPieChartLoader = true
    CHART_GROUPS.forEach((group_by) => {
      getStackedChart({ ...params, group_by })
        .then((res) => {
          allocationsStore.pieCharts[group_by] = res.data;
          allocationsStore.showPieChartLoader = false
        })
        .catch((e) => {
          allocationsStore.showPieChartLoader = false
          console.log("getPieChartData", e);
        });
    });
  };

  const getProjectsGroupsFiltersOptions = async (params?: IAllocationParams) => {
    getProjectsGroupsOptions({...params, project_group_ids: undefined})
      .then((res) => (allocationsStore.projectsGroupsOptions = res))
      .catch((e) => console.log("getProjectsGroupsFiltersOptions", e));
  };
  const getDepartmentFiltersOptions = async (params?: IAllocationParams) => {
    getDepartments({...params, departments: undefined})
      .then((res) => (allocationsStore.departmentOptions = res))
      .catch((e) => console.log("getDepartmentFiltersOptions", e));
  };
  const getDivisionsFiltersOptions = async (params?: IAllocationParams) => {
    getDivisions({...params, divisions: undefined})
      .then((res) => (allocationsStore.divisionOptions = res))
      .catch((e) => console.log("getDivisionsFiltersOptions", e));
  };
  const getTeamsFiltersOptions = async (params?: IAllocationParams) => {
    getTeams({...params, team_ids: undefined})
      .then((res) => (allocationsStore.teamsOptions = res))
      .catch((e) => console.log("getTeamsFiltersOptions", e));
  };
  const getUsersFiltersOptions = async (params?: IAllocationParams) => {
    getStaffListWithAvatars({...params, user_ids: undefined})
      .then((res) => (allocationsStore.usersOptions = res))
      .catch((e) => console.log("getUsersFiltersOptions", e));
  };
  const getRootUsersFiltersOptions = async (params?: IAllocationParams) => {
    getStaffListWithAvatars({...params, root_user_ids: undefined})
      .then((res) => (allocationsStore.rootUsersOptions = res))
      .catch((e) => console.log("getUsersFiltersOptions", e));
  };
  const getAllocationTableData = async (params?: IAllocationParams) => {
    if (params && params.page === 1 && !params.sort_by){
      allocationsStore.showTableLoader = true
      allocationsStore.allocationTable.data = null
      allocationsStore.allocationTable.meta = null
    }
    allocationsStore.showPaginateTableLoader = params
      ? params.page !== 1
      : false;
    allocationsStore.showSortLoader = params
      ? !!params.sort_by
      : false;

    getTableData(params)
      .then((res) => {
        if (res.meta?.current_page === 1) {
          allocationsStore.allocationTable = { data: res.data, meta: res.meta };
          allocationsStore.showTableLoader = false;
          allocationsStore.showSortLoader=false
        } else {
          if(allocationsStore.allocationTable.data){
            allocationsStore.allocationTable = {
              data: [...allocationsStore.allocationTable.data, ...res.data as []],
              meta: res.meta,
            };
            allocationsStore.showPaginateTableLoader=false
            allocationsStore.showSortLoader=false
          }

        }
      })
      .then(() => {
        setTimeout(() => {
          allocationsStore.showPaginateTableLoader = false;
          allocationsStore.showTableLoader = false;
        }, 1000);
      })
      .catch((e) => {
        allocationsStore.showTableLoader = false;
        console.log("getAllocationTableData", e);
      });
  };
  const getAvailableAllocationDates = async (params?: IAllocationParams) => {
    allocationsStore.showTableLoader = true;
    getAvailableDates({...params, date_from: undefined, date_to: undefined})
      .then((res) => {
        allocationsStore.showTableLoader = false;

        return (allocationsStore.availableDates = res);
      })
      .catch((e) => {
        allocationsStore.showTableLoader = false;
        console.log("getAvailableAllocationDates", e);
      });
  };

  return {
    allocationsStore,
    getStackedBarchart,
    getPieChartData,
    getProjectsGroupsFiltersOptions,
    getDepartmentFiltersOptions,
    getDivisionsFiltersOptions,
    getTeamsFiltersOptions,
    getUsersFiltersOptions,
    getRootUsersFiltersOptions,
    getAllocationTableData,
    getAvailableAllocationDates,
  };
};
