import { API } from "./axiosInstance";
import { type IFilters } from "./models/IStudios";

export const getPositions = async (
  params?: IFilters
): Promise<{ data: string[] }> => {
  const { data } = await API.get("/positions", { params });
  return data;
};
