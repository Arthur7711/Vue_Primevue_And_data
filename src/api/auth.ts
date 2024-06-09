import { API } from "./axiosInstance";
import { type IAuth } from "./models/IRequests";

export const authUser = async (): Promise<IAuth> => {
  const { data } = await API.get("/user/self");
  return data;
};
