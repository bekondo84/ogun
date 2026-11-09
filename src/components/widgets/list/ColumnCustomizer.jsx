import { SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import ColumnCustomizerModal from "../notification/ColumnCustomizerModal";
import { Button } from "@base-ui/react";
import { useOdooModal } from "../notification/useOdooModal";
import { useTranslation } from "react-i18next";
import { executedPostMethod } from "@/axios/DataService";
export default function ColumnCustomizer ({
      metadata,
      columns,
      setColumns
}) {

    useEffect(() => {

    }, [metadata]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modal, ModalElement] = useOdooModal()
    const {t, i18n} = useTranslation()

    const handleOpenAction = async() => {
           setIsModalOpen(true)
    }

    /**
     * 
     * @returns 
     */
    const handleResetAction = async() => {
        setIsModalOpen(false)
       const isConfirmed = await modal({
        title: t('action_confirm'),
        message: t('config_lost_risk'),
        variant: "danger",
        confirmText: t('confirmation_btn'),
        cancelText: t('close_btn'),
        showCancel: true
        });

        if (!isConfirmed) {
            setIsModalOpen(true)
            return;
        }
        const response  = await executedPostMethod("settingsAction", "reset_columns_settings", {
            typeCode: metadata.typeCode,
        })
        const localColumns = metadata?.listView?.columns
        setColumns(localColumns)
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
                onReset={handleResetAction}
            />
            {ModalElement}
        </div>
    )

}