import React, { useEffect, useState } from "react"
import { DollarSign, Users, TrendingUp, ShoppingBag, ArrowUpRight, ArrowDownRight } from "lucide-react"
import KpiCard from "./KpiCard"
import { executedPostMethod, executeGetMethod } from "@/axios/DataService";

export default function KpiCards({kpiCardsMeta }) {

  const [kpiData, setKpiData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [kpiItems, setKpiItems] = useState([])
  

   useEffect(() => {
      if (kpiCardsMeta) {
            fetchKpi()
      }      
   }, [kpiCardsMeta]);

   useEffect(() => {
        setKpiItems(kpiData?.items)
        //console.log('------------------------------'+JSON.stringify(kpiData?.items))
   }, [kpiData]);

  const fetchKpi = async() => { 
     try {
      setIsLoading(true)
       const response = await executedPostMethod(kpiCardsMeta.action, kpiCardsMeta.method, {
           data: kpiCardsMeta,
       })
       setKpiData(response.data)
     } finally {
        setIsLoading(false)
     }
       
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiItems?.map((kpi) => {
        return (
          <KpiCard isLoading={isLoading} kpi={kpi} />
        )
      })}
    </div>
  )
}
