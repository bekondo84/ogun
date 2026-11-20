import { getDashboard, getMeta } from "@/axios/MetaService"

/**
 * 
 * @param {*} menuObject 
 * @param {*} setMetadata 
 * @param {*} setActiveMenu 
 * @param {*} setViewMode 
 * @param {*} setAllowedViews 
 * @param {*} setSnapshotstore 
 * @param {*} updateSystemSnapshaps 
 * @param {*} fetchData 
 */
export const loadMetaMenu = async(menuObject, setMetadata, setActiveMenu, setViewMode, setAllowedViews, setSnapshotstore, updateSystemSnapshaps, fetchData) => {
       const meta = await getMeta(menuObject.code)
       
      if (meta !== null) {
          const targetView = meta.viewMode.split(',')[0]
        
          setMetadata (meta)
          await fetchData(1, meta, [], [], targetView)
          setActiveMenu(menuObject)
      
        //console.log("Changement de vue ERP : " +menuObject.viewMode)
        setViewMode(targetView)
        setAllowedViews(meta.viewMode)
        //Initialize the 
        setSnapshotstore(updateSystemSnapshaps([], menuObject.label, meta, null, [], targetView))
     }   
}

/**
 * 
 * @param {*} menuObject 
 * @param {*} setDashboard 
 * @param {*} setActiveMenu 
 * @param {*} setViewMode 
 * @param {*} setAllowedViews 
 */
export const loadDashboardMenu = async(menuObject, setDashboard, setActiveMenu, setViewMode, setAllowedViews) => {
     const dashboard =  await getDashboard(menuObject.code)
    // console.log('-------------------- '+JSON.stringify(dashboard))
     if (dashboard) {
        setDashboard(dashboard)
       
     }
     setActiveMenu(menuObject)
      const targetView = menuObject.viewMode.split(',')[0]
      //console.log("Changement de vue ERP : " +menuObject.viewMode)
      setViewMode(targetView)
      setAllowedViews(menuObject.viewMode)
}