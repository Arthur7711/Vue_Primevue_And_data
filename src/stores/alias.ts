import { ref} from "vue";
import {getDepartment, getPosition, setDepartment, setPosition} from "@/api/settings";

// export const useAliasStore = defineStore({
//     id: 'alias',
//     state: () => ({
//         aliasDepartment: [],
//         loading: false,
//         aliasPosition: [],
//     }),
//     actions: {
//         //getters
//         async getAliasDepartment  (){
//             this.loading = true
//             try{
//                 let {data: {items}} = await API.get('/alias/department')
//                 this.aliasDepartment = [...items]
//                 this.loading = false
//             }catch (e){
//                 console.log('getAliasDepartment Error', e)
//             }
//
//         },
//         async getAliasPosition  (){
//           // await  http.getAliasPosition().then(({items}) => {
//           //       this.aliasPosition = [...items]
//           //   })
//             try{
//                 let {data: {items}} = await API.get('/alias/position')
//                 this.aliasPosition = [...items]
//                 this.loading = false
//             }catch (e){
//                 console.log('getAliasPosition Error', e)
//             }
//             this.loading = false
//         },
//         //setters
//         async setAliasDepartment  (data){
//            // await http.setAliasDepartment({data})
//            //  this.aliasDepartment.push(data)
//             try{
//                 await API.post('/alias/department', {data})
//                 this.aliasDepartment.push(data)
//             }catch (e){
//                 console.log('setAliasDepartment Error', e)
//             }
//         },
//         async setAliasDepartmentTags  (data){
//            // await http.setAliasDepartment({data})
//             try{
//                 await API.post('/alias/department', {data})
//             }catch (e){
//                 console.log('setAliasDepartmentTags Error', e)
//             }
//         },
//         async setAliasPosition  (data){
//          // await   http.setAliasPosition({data})
//             try{
//                 await API.post('/alias/position', {data})
//                 this.aliasPosition.push(data)
//             }catch (e){
//                 console.log('setAliasPosition Error', e)
//             }
//
//         },
//         async setAliasPositionTags  (data){
//          // await   http.setAliasPosition({data})
//             try{
//                 await API.post('/alias/position', {data})
//             }catch (e){
//                 console.log('setAliasPositionTags Error', e)
//             }
//         },
//     }
// })


export const useAliasStore = () => {
    const aliasStore = ref({
        aliasDepartment: [],
        loading: false,
        aliasPosition: [],
    })
    const getAliasDepartment = async () => {
        try {
            aliasStore.value.loading = true
            const data = await getDepartment()
            aliasStore.value.aliasDepartment = [...data.items]
        } catch (e) {
            console.log('getAliasDepartment', e)
        }
    }
    const getAliasPosition = async () => {
        try {
            const data = await getPosition()
            aliasStore.value.aliasPosition = [...data.items]
            aliasStore.value.loading = false
        } catch (e) {
            console.log('getAliasPosition', e)
        }
    }
    const setAliasDepartment = async (data) => {
        try {
             await setDepartment(data)
            aliasStore.value.aliasDepartment.push(data)
        } catch (e) {
            console.log('setAliasDepartment', e)
        }
    }
    const setAliasPosition = async (data) => {
        try {
             await setPosition(data)
            aliasStore.value.aliasPosition.push(data)
        } catch (e) {
            console.log('setAliasPosition', e)
        }
    }
    const setAliasDepartmentTags = async (data) => {
        try {
            await setDepartment(data)
        } catch (e) {
            console.log('setAliasDepartmentTags', e)
        }
    }
    const setAliasPositionTags = async (data) => {
        try {
            await setPosition(data)
        } catch (e) {
            console.log('setAliasPositionTags', e)
        }
    }
    // const logout=()=> {
    //   auth.logout();
    // }
    return {
        aliasStore,
        getAliasDepartment,
        getAliasPosition,
        setAliasDepartment,
        setAliasPosition,
        setAliasDepartmentTags,
        setAliasPositionTags
    }
}
// get parameters = params
// body = data
// args

// http.getAliasDepartment({params, data, args})