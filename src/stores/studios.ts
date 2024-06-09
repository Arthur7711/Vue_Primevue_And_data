import { reactive } from "vue";
import {
  getOfficesOptions,
  getProjectsOptions,
  getStudios,
  getStudiosOptions,
  studioName,
  studiosStaffCount,
} from "@/api/studios";
import type {
  IFilters,
  IOfficesOptions,
  IOptionData,
  IStudiosList,
  IStudiosStore,
  IStudioStaff,
} from "@/api/models/IStudios";
import {type IStudiosParams} from "@/api/models/IStudios";

const studiosStore = reactive<IStudiosStore>({
  studiosList: { data: [] } as IStudiosList,
  studiosFilter: { data: [] } as IOptionData,
  projectsFilter: { data: [] } as IOptionData,
  officesFilter: { data: [] } as IOfficesOptions,
  studiosStaff: {} as IStudioStaff,
  studioName: null,
});
export const useStudiosStore = () => {
  const getStudiosList = async (params?: IStudiosParams) => {
    getStudios(params).then((data=> studiosStore.studiosList = data)).catch((e)=>console.log("getStudiosList", e));
  };
  const getStudioName = async (id: number) => {
    try {
      const data = await studioName(id);
      studiosStore.studioName = data.data;
    } catch (e) {
      console.log("getStudioName", e);
    }
  };
  const getStudiosStaffCount = async (id?: number) => {
    try {
      const data = await studiosStaffCount(id);
      studiosStore.studiosStaff = data.data;
    } catch (e) {
      console.log("getStudiosStaffCount", e);
    }
  };
  const getStudiosFiltersOptions =  (filters?: IFilters) => {
         getStudiosOptions({...filters, studio_ids: undefined}).then((data=> studiosStore.studiosFilter = data)).catch((e)=>console.log("getStudiosFiltersOptions", e));

  };
  const getProjectsFiltersOptions =  (filters?: IFilters) => {
    getProjectsOptions({...filters, project_ids: undefined}).then((data)=> {studiosStore.projectsFilter = data}).catch((e)=>console.log("getProjectsFiltersOptions", e));

  };
  const getOfficesFiltersOptions =  (filters?: IFilters) => {
    getOfficesOptions({...filters, office_ids: undefined}).then((data)=>studiosStore.officesFilter = data).catch((e)=>console.log("getOfficesFiltersOptions", e));
  };
  return {
    studiosStore,
    getStudiosList,
    getStudioName,
    getStudiosStaffCount,
    getStudiosFiltersOptions,
    getProjectsFiltersOptions,
    getOfficesFiltersOptions,
  };
};
