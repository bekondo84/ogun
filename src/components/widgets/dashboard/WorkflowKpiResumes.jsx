import { AlertTriangle, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import WorkflowKpiResume from "./WorkflowKpiResume";

export default function WorkflowKpiResumes ({
    data
}) {
    const [resumes, setResumes] = useState([])
    
    useEffect(() => {
       setResumes(data?.resumes)
    }, [data])
    return (
        <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/60">
            {resumes?.map((item, idx) => (
                 <WorkflowKpiResume resume={item} />
            ))}        
      </div>
    )
}