import {API} from './axiosInstance'
import {
  type IGetStaff,
  type IStaff,
  type IUserStaff,
  type IStaffStatistic,
  type IStaffHistoryItem,
  type IStaffCount,
} from './models/IStaff'
import {type IAllocationParams} from "@/api/models/IAllocation";

export const getStaff = async (params?: IGetStaff): Promise<IStaff> => {
  const {data} = await API.get('/staff', {
    params,
  })
  return data
}
export const getStafItem = async (
  id: number | string
): Promise<{ data: IUserStaff }> => {
  const {data} = await API.get(`/staff/${id}`)
  return data
}
export const getStaffStatics = async (
  id: number | string
): Promise<IStaffStatistic> => {
  const {data} = await API.get(`/staff/${id}/statistic`)
  return data
}
export const getStaffHistory = async (
  id: number | string
): Promise<{ data: IStaffHistoryItem[] }> => {
  const {data} = await API.get(`/staff/${id}/projects_history`)
  return data
}

export const getStaffChart = async (
  id: number | string,
  date_from: string,
  date_to: string
): Promise<{ data: { [key: string]: number }[] }> => {
  const {data} = await API.get(`/staff/${id}/chart/jira`, {
    params: {
      date_from,
      date_to,
    },
  })
  return data
}
export const getStaffCount = async (
  id: number | string
): Promise<{ data: IStaffCount }> => {
  const {data} = await API.get(`/staff/${id}/staff_count`)
  return data
}
export const getStaffListWithAvatars = async (params?: IAllocationParams) => {
  const {data: {data}} = await API.get(`/staff/list_with_avatars`, {params})
  return data
}
