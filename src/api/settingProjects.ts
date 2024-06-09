import { API } from "./axiosInstance";

export interface IProjectList {
  id: number;
  name: string;
  description: string;
  status: string;
  updated_at: string;
  alias: {
    project_name_origin: string;
    project_name_alias: string;
  }[];
}
 
export const getProjectList = (search?: string, status?: string) => {
  const data = API.get<{ data: IProjectList[] }>(`/settings/projects`, {
    params: {
      search: search ? search : null,
      status: status ? status : null,
    },
  });
  return { data }.data;
};

export const getProjectInSetting = (project_id: number) => {
  const data = API.get<{ data: IProjectList }>(
    `/settings/projects/${project_id}`
  );
  return { data }.data;
};

export const putProjectInSetting = async (
  project_id: number,
  name: string,
  status: string,
  alias?: string[]
) => {
  const { data } = await API.put<{ data: IProjectList }>(
    `/settings/projects/${project_id}`,
    {
      name: name ? name : null,
      status: status ? status : null,
      alias: alias ? alias : undefined,
    }
  );
  return data;
};

export const postMergeProjects = async (
  project_id: number,
  merge_project_id: number
) => {
  const data = await API.post(`/settings/projects/${project_id}/merge`, {
    project_id: merge_project_id,
  });
  return data;
};

export const postArchiveProject = async (project_id: number) => {
  const data = await API.post(`/settings/projects/${project_id}/archive`);
  return data;
};

export const postCreateProject = async (name: string, status: string) => {
  const data = await API.post(`/settings/projects`, {
    name: name,
    status: status,
  });
  return data;
};
