import { api } from "@/lib/api";
import axios from "axios";

export async function executedPostMethod(action, method, data) {
    const token = localStorage.getItem("erp_auth_token");
    const response = await api.post('/api/actions/execute/'+action+'/'+method, 
        data,
        {
        headers: {
            'Authorization':'Bearer '+token
        }
    });
    return response.data;
}