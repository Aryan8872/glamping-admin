import { useApiStore } from "@/stores/useLoad";

export async function apiWrapper <T>(key:string,request:()=>Promise<T>){
    const {apiRequest} = useApiStore.getState()
    return apiRequest(key,request)
}