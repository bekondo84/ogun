import React, { useEffect, useState } from "react"
import { BarChart3, TrendingUp } from "lucide-react"
import LineChart from "@/components/charts/LineChart"
import DoughnutChart from "@/components/charts/DoughnutChart"
import { PieChart } from "@/components/charts/PieChart"
import ActivityLogs from "./ActivityLogs"
import { BarChart } from "@/components/charts/BarChart"
import Chart from "@/components/charts/Chart"

export default function Charts({
   data
}) {

  const [charts, setCharts] = useState([]);
  
  useEffect(() => {
      if (data) {
         setCharts(data?.items)
      }
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {charts?.map((chart, idx) => (
        <Chart chart={chart}/>
      ))}
    </div>
  )
}
