import {type AliasItemType, type IAlias} from "@/api/models/IRequests";
import {API} from "@/api/axiosInstance";


export const getDepartment = async (): Promise<IAlias> => {
        let {data} = await API.get('/alias/department')
        return data

}
export const getPosition  = async (): Promise<IAlias> => {
        let {data} = await API.get('/alias/position')
        return data
}
export const setDepartment  = async (dataVal: any): Promise<AliasItemType> => {
        const {data} = await API.post('/alias/department', {dataVal})
        return data
}
export const setPosition  = async (dataVal: any): Promise<AliasItemType> => {
        const {data} = await API.post('/alias/position', {dataVal})
        return data
}