import { api } from "@/lib/api";
import axios from "axios"
export const getMeta = async (menuid) => {
    const token = localStorage.getItem("erp_auth_token");
    const response = await api.get('/api/actions/navigation/meta/'+menuid, {
        headers: {
            'Authorization':'Bearer '+token
        }
    });
    return response.data;
}