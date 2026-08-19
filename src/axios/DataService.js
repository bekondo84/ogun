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