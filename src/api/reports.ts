import { API } from "./axiosInstance";

export interface IAvaliableReportsStudios {
  id: number;
  name: string;
}

export const getAvaliableReportsStudios = async () => {
  const { data } = await API.get<{ data: IAvaliableReportsStudios[] }>(
    "/documents/available_studios"
  );
  return data.data;
};

export interface IAvaliableReportsDates {
  data: string[];
}

export const getAvaliableReportsDates = async (studio_id: number) => {
  const { data } = await API.get<IAvaliableReportsDates>(
    `/documents/${studio_id}/available_dates`
  );
  return data.data;
};

export interface IUserDocsCreator {
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
  avatar_urls: {
    "32px": string;
    "64px": string;
    "128px": string;
    "256px": string;
  };
}

export interface IDocErrors {
  id: number;
  import_file_process_id: number;
  cell: null | string | number;
  error_type: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface IDocumentStatus {
  id: number;
  import_file_id: number;
  progress: number;
  status: "in_queue" | "validation" | "importing" | "error" | "done";
  staff_id: number;
  created_at: string;
  updated_at: string;
  import_file: {
    id: number;
    studio_id: number;
    year: number;
    month: number;
    status: string;
    google_id: string;
    created_at: string;
    updated_at: string;
    google_url: string;
    google_url_with_cell: string;
  };
  user: IUserDocsCreator;
  errors_count: number;
  errors: IDocErrors[];
}

export interface IDocumentStatusResponce {
  data: IDocumentStatus;
}

export const getDocumentsStatus = async (id: number) => {
  const data = await API.get<IDocumentStatusResponce>(
    `/documents/process/${id}`
  );
  return { data }.data;
};

export interface IDocumentStatusIndividual {
  id: number;
  studio_id: number;
  year: number;
  month: number;
  status: "generating" | "generated";
  google_id: string;
  created_at: string;
  updated_at: string;
  google_url: string;
  last_process: IDocumentStatus | null;
}

export interface IDocumentStatusIndividualResponce {
  data: IDocumentStatusIndividual[];
}

export const getDocumentsStatusIndividual = async (studio_id: number) => {
  const data = await API.get<IDocumentStatusIndividualResponce>(
    `/documents/${studio_id}`
  );
  return data.data.data;
};

export interface IPostDocReport {
  id: number;
  import_file_id: number;
  progress: number;
  status: string;
  staff_id: number;
  created_at: string;
  updated_at: string;
}

export const postDocumentReports = async (
  studio_id: number,
  import_file_id: number
) => {
  const data = await API.post<{ data: IPostDocReport }>(
    `/documents/${studio_id}/${import_file_id}/import`
  );
  return { data }.data;
};

export const postCreateDocument = (studio_id: number | null, date: string) => {
  const data = API.post(`/generate_allocation_doc`, {
    studio_id: studio_id,
    date: date,
  });
  return { data }.data;
};

export const deleteDocument = async (
  studio_id: number,
  import_file_id: number
) => {
  const { data } = await API.delete<{ data: boolean }>(
    `/documents/${studio_id}/${import_file_id}`
  );
  return data;
};
