import { getToken } from "./TokenService";


export function getApiConfig(){
    return { headers: { Authorization: `Bearer ${getToken()}` }  }
}