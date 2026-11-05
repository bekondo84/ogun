import { executedPostMethod } from "@/axios/DataService";
import { getMetaFromTypeCode } from "@/axios/MetaService";


export const executeModal = async (
      action,
      data,
      modal, toast
) => {
        const meta = await getMetaFromTypeCode(action.typeCode)
        //Create Empty entity 
        const response = await executedPostMethod(meta.action, "create", {
                  typeCode:meta.typeCode,
                  class: meta.type,
                  data: data
              })
    //console.log ('ActionUtils.executeModal ....................... '+JSON.stringify(response.data))
       if (response && response.data) {
            await modal({
                metadata: meta, formData: response.data, toast
            })
        }
}
/**
 * 
 * @param {*} action 
 * @param {*} data 
 * @param {*} setMetaFn 
 * @param {*} setEditModeFn 
 * @param {*} setViewModeFn 
 * @param {*} setAllowedViewsFn 
 * @param {*} setSnapshotstoreFn 
 * @param {*} updateSystemSnapshapsFn 
 * @param {*} snapshotstore 
 * @param {*} setDataFn 
 * @param {*} setLoadingFn 
 * @param {*} toast 
 */
export const executeNavigate = async(
    action
    , data
    , setMetaFn
    , setEditModeFn
    , setViewModeFn
    , setAllowedViewsFn
    , setSnapshotstoreFn
    , updateSystemSnapshapsFn
    , snapshotstore
    , setDataFn
    , setLoadingFn
    , toast) => {
        setLoadingFn(true)
    try {
        const meta = await getMetaFromTypeCode(action.typeCode)
       setMetaFn(meta)
        setEditModeFn('C')
        setViewModeFn('view')
        //Create Empty entity 
        const response = await executedPostMethod(meta.action, "create", {
                  typeCode:meta.typeCode,
                  class: meta.type,
                  data: data
              })
        setDataFn(response.data)
        setAllowedViewsFn('view')
        setSnapshotstoreFn(updateSystemSnapshapsFn(snapshotstore, meta.formViewTitle, meta, null, [], 'view'))
    } finally {
        setLoadingFn(false)
    }
}
/**
 * Execute simple action
 * @param {*} metadata 
 * @param {*} action 
 * @param {*} data 
 * @param {*} isLoadinFn 
 * @param {*} setDataFn 
 * @param {*} toast 
 */
export const executeAction = async(metadata, action, data, isLoadinFn, setDataFn, toast, t) => {
  try {
          isLoadinFn(true)
          const response = await executedPostMethod(action.action, action.method, {
                          data: data,
                          plugin: null,
                          class: metadata.type,
                          typeCode:metadata.typeCode
                  })
                  toast.success(t('notification'), {
                        description: t('notification_success')
                  });
          setDataFn(response.data)
    } finally {
       isLoadinFn(false)
    }
}