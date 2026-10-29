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

export async function executedDeleteMethod(action, method, data) {
    const token = localStorage.getItem("erp_auth_token");
    const response = await api.delete('/api/actions/execute/'+action+'/'+method, 
        data,
        {
        headers: {
            'Authorization':'Bearer '+token
        }
    });
    return response.data;
}

export async function onSearch(field, searchText, size) {
    if (field && field.meta) {
        let meta = field.meta
        let predicates = []
        if (searchText && searchText.length > 0) {
            predicates = [{fieldName:'stringValue', label:'stringValue', type:'java.lang.String', value: searchText, cond: 'LIKE'}] 
        }
        const response = await executedPostMethod(meta.action, "fetchitems", {
            startIndex: 0,
            pageSize: size,
            class: meta.type,
            predicates: predicates
        })
        
        //console.log('--------onSearch = async (field, searchText, size) ---------- : '+' searchText :  '+searchText+' ----------- '+JSON.stringify(suggestions)+'-------- '+suggestions.length)
        return response.data 
    }
}

/**
 * Upload file to the server
 * @param {*} formData 
 * @returns 
 */
export async function uploadFile(formData) {
    const token = localStorage.getItem("erp_auth_token");
    if (formData != null ) {
        const response = await api.post('/api/file/upload',
            formData,
            {
                headers: {
                     'Authorization':'Bearer '+token,
                     'Content-Type': 'multipart/form-data',
                }
            })
            return response.data
    }
}

export async function download (file) {
    const token = localStorage.getItem("erp_auth_token");
    const response = await api.get(`/api/file/download/${file}`, {
        responseType: 'blob', 
        headers: {
                     'Authorization':'Bearer '+token,
                     'Content-Type': 'multipart/form-data',
                }
    });
    
    return URL.createObjectURL(response.data);      
}

export async function deleteItem(item, metadata) {
    await executedPostMethod(metadata.action, 'delete', {
            data: item,
            typeCode:metadata.typeCode,
            class:metadata.type,
            plugin: null
       })
}
