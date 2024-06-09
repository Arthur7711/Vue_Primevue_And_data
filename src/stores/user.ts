import {authUser} from '@/api/auth'
import {ref} from 'vue'
import type {IAuth} from '@/api/models/IRequests'

const useUserStore = () => {
  const self = ref<null | IAuth>(null); 
  const auth = async () => {
    try {
      self.value = await authUser();
    } catch (e) {
      console.log("Auth Error", e);
    }
  };
  // const logout=()=> {
  //   auth.logout();
  // }
  return { auth, self };
};
export default useUserStore();
