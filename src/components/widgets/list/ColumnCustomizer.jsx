import { SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import ColumnCustomizerModal from "../notification/ColumnCustomizerModal";
import { Button } from "@base-ui/react";
export default function ColumnCustomizer ({
      metadata,
      columns,
      setColumns
}) {

    useEffect(() => {

    }, [metadata]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    /**
     * 
     * @param {*} columnsConfig 
     */
    const handleSave = (columnsConfig) => {
           setColumns(columnsConfig)
    }

    return (
        <div  className="relative shrink-0">
            <div className="flex justify-end mb-2">
                <button 
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="h-8 px-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer select-none"
                    title="Personnaliser les colonnes"
                >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                    <span></span>
                </button>
            </div>
            {/* Modale de personnalisation */}
            <ColumnCustomizerModal 
                metadata={metadata}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                columns={columns} 
                setColumns={setColumns}
                onSave={handleSave}
            />
        </div>
    )

}