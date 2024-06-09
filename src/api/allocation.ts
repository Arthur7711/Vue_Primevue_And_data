import { API } from "@/api/axiosInstance";
import type {
  IAllocationTable,
  IAvailableDates,
  IProjectsGroupsOptions,
  IStackedBarChart,
  IAllocationParams,
  ITeamsResponse,
} from "@/api/models/IAllocation";
import {type IFilters} from "@/api/models/IStudios";

export const getStackedChart = async (
  params: IAllocationParams
): Promise<IStackedBarChart> => {
  const { data } = await API.get("/allocation/chart", {
    params,
  });
  return data;
};

export const getProjectsGroupsOptions = async (
  params?: IAllocationParams
): Promise<IProjectsGroupsOptions> => {
  const { data } = await API.get("/projects/groups", {
    params,
  });
  return data;
};

export const getDivisions = async (params?: IAllocationParams) => {
  const { data } = await API.get("/divisions", { params });
  return data;
};
export const getTeams = async (params?: IAllocationParams): Promise<ITeamsResponse> => {
  const { data } = await API.get("/teams", { params });
  return data;
};
export const getTableData = async (params: any
): Promise<IAllocationTable> => {
  const { data } = await API.get("/allocation/table" ,{params});
  return data;
};
export const getAvailableDates = async (params?: IAllocationParams
): Promise<IAvailableDates> => {
  const { data } = await API.get("/allocation/available_dates" ,{params});
  return data;
};
