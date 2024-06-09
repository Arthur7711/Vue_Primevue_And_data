import { API } from "./axiosInstance";
import {
  type IEditJiraTasks,
  type IProjectData,
  type IGetMilestone,
  type IJiraTasks,
  type IMilestoneHead,
  type IProjectInfo,
  type IProjectStatics,
  type IProjects,
  type IMilestoneChartItem,
  type IProjectLog,
  type IProjectDocument,
  type IProjectDownloadDocumentHash,
} from "./models/IProjects";
import { type IResponseMeta } from "@/api/models/IResponse";
import { type IFilters } from "./models/IStudios";
import {type IAllocationParams} from "@/api/models/IAllocation";

export const getProjects = async (params: {
  offices_ids?: (number | string)[];
  studios_ids?: (number | string)[];
  projects_ids?: (number | string)[];
  milestones_ids?: (number | string)[];
}): Promise<IProjects> => {
  const { data } = await API.get("/projects", {
    params: {
      projects_ids: params?.projects_ids,
      studios_ids: params?.studios_ids,
      offices_ids: params?.offices_ids,
      milestones_ids: params?.milestones_ids,
    },
  });
  return data;
};

export const getProjectInfo = async (
  project_id: string
): Promise<IProjectInfo> => {
  const { data } = await API.get(`/projects/${project_id}/info`);
  return data;
};

export const editProjectInfo = async (
  project_id: string,
  params: Partial<IProjectInfo>
) => {
  const { data } = await API.put(`/projects/${project_id}/info`, { params });
  return data;
};

export const getProjectJira = async (
  project_name: string
): Promise<IJiraTasks> => {
  const {data} = await API.get(`/projects/${project_name}/jira`)
  return data
}
export const putProjectJira = async (
  project_id: string | number,
  link: string,
) => {
  const {data} = await API.put(`/projects/${project_id}/jira?link=${link}`)
  return data
}
export const putProjectInfo = async (
  project_id: string | number,
  data: Partial<IProjectData>
) => {
  const {data: result} = await API.put(`/projects/${project_id}/info`, data)
  return result
}
export const getProjectProgress = async (
  project_id: string
): Promise<{ data: number }> => {
  const { data } = await API.get(`/projects/${project_id}/progress`);
  return data;
};
export const getProjectStatistic = async (
  project_id: string
): Promise<IProjectStatics> => {
  const { data } = await API.get(`/projects/${project_id}/statistic`);
  return data;
};
export const getProjectMilesroneSummary = async (
  project_id: string,
  milestone_id: string
): Promise<IMilestoneHead> => {
  const { data } = await API.get(
    `/projects/${project_id}/milestones/${milestone_id}/summary`
  );
  return data;
};
export const getProjectMilesroneChart = async (
  project_id: string,
  milestone_id: string
): Promise<{ data: IMilestoneChartItem[] | [] }> => {
  const { data } = await API.get(
    `/projects/${project_id}/milestones/${milestone_id}/chart`
  );
  return data;
};
export const getMilestones = async (
  filters?: IFilters
): Promise<{
  data: {
    name: string;
    id: string | number;
  }[];
}> => {
  const { data } = await API.get(`/milestones`, {
    params: {
      projects_ids: filters?.projects_ids,
    },
  });
  return data;
};
export const getProjectMilesrone = async (
  project_id: string
): Promise<IGetMilestone> => {
  const { data } = await API.get(`/projects/${project_id}/milestones`);
  return data;
};
export const addProjectMilesrone = async (
  project_id: string,
  body: {
    date_start: string;
    milestone_id: number | string;
    comment: string;
    date_end: string;
  }
): Promise<any> => {
  const { data } = await API.post(`/projects/${project_id}/milestones`, body);
  return data;
};
export const editProjectMilesrone = async (
  project_id: string,
  milestone_id: string,
  body: {
    date_start: string;
    milestone_id: number | string;
    comment: string;
    date_end: string;
  }
): Promise<IGetMilestone> => {
  const { data } = await API.put(
    `/projects/${project_id}/milestones/${milestone_id}`,
    body
  );
  return data;
};
export const DeleteProjectMilesrone = async (
  project_id: string,
  milestone_id: string
): Promise<IGetMilestone> => {
  const { data } = await API.delete(
    `/projects/${project_id}/milestones/${milestone_id}`
  );
  return data;
};
export const getStatus = async (
  project_id: string,
  date_start: string,
  milestone_id?: string | number
): Promise<{ data: string }> => {
  const { data } = await API.get(
    `/projects/${project_id}/milestones/get_edit_status`,
    {
      params: {
        date_start,
        milestone_id,
      },
    }
  );
  return data;
};

export const getAllMilestones = async (): Promise<{
  data: { name: string; id: number | string }[];
}> => {
  const { data } = await API.get("/milestones");
  return data;
};

export const getProjectLogs = async (
  project_id: number,
  page: number
): Promise<{
  data: IProjectLog[];
  meta: IResponseMeta;
}> => {
  return await API.get(
    `/projects/${project_id}/logs?page=${page}&limit=100`
  ).then((response) => response.data);
};

export const addProjectComment = async (
  project_id: number,
  comment: string
): Promise<{
  data: IProjectLog[];
  meta: IResponseMeta;
}> => {
  return await API.post(`/projects/${project_id}/comment`, {
    comment: comment,
  }).then((response) => response.data);
};

export const getProjectDocuments = async (
  project_id: number
): Promise<{
  data: IProjectDocument[];
}> => {
  return await API.get(`/projects/${project_id}/documents`).then(
    (response) => response.data
  );
};

export const getProjectDocumentDownloadHash = async (
  project_id: number,
  document_id: number
): Promise<{
  data: IProjectDownloadDocumentHash;
}> => {
  return await API.get(`/projects/${project_id}/documents/${document_id}`).then(
    (response) => response.data.data
  );
};

export const addProjectDocument = async (
  project_id: number,
  name: string,
  file: File
): Promise<{
  data: IProjectDocument[];
}> => {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("file", file);

  return await API.post(`/projects/${project_id}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => response.data);
};
export const getDepartments = async (params?: IAllocationParams) => {
  const { data } = await API.get("/departments", { params });
  return data;
};
