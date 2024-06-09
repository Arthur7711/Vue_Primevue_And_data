import { API } from "@/api/axiosInstance";
import type {
  IFilters,
  IOfficesOptions,
  IOptionData, IStudioName,
  IStudiosList,
  IStudiosParams, IStudioStaffCount,
} from "@/api/models/IStudios";

export const getStudios = async (
  params?: IStudiosParams
): Promise<IStudiosList> => {
  const { data } = await API.get("/studios/", {params}
  )
  return data;
}

export const studioName = async (
  id?: number
): Promise<IStudioName> => {
  const { data } = await API.get(`/studios/${id}`);
  return data;
}
export const studiosStaffCount = async (
  id?: number
): Promise<IStudioStaffCount> => {
  const { data } = await API.get(`studios/${id}/staff_count`);
  return data;
}
export const getStudiosOptions = async (
  params?: IFilters
): Promise<IOptionData> => {
  const { data } = await API.get("/studios/filter_list", { params });
  return data;
};
export const getProjectsOptions = async (
  params?: IFilters
): Promise<IOptionData> => {
   const { data } = await API.get("/projects/filter_list", {
    params
  });
  return data;
};
export const getOfficesOptions = async (
    params?: IFilters
): Promise<IOfficesOptions> => {
  const { data } = await API.get("/offices", { params });
  return data;
};
