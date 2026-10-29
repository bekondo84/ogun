import { useCallback, useState } from "react";
import SearchMoreModal from "../form/fields/SearchMoreModal";

export function useSearchMoreModal() {
   const [modalState, setModalState] = useState({
        isOpen: false, 
        onClose: null,
        meta: null,
        data: null,
        onSelect: null, 
        isSelectable: false,
        onSave: null,
        resolveFn: null,
   });

   const showModal = useCallback((options) => {
      return new Promise((resolve) => {
          setModalState({
               isOpen: true, // 👈 Forcé automatiquement à true à l'appel !
               onClose: options.onClose || (() => handleCancel()),
               meta: options.meta,
               data: options.initialData,
               onSelect: options.onSelect,
               isSelectable: options.isSelectable,
               onSave: options.onSave,
               resolveFn: resolve
          });
      });
   }, []);

   const handleConfirm = (result) => {
     modalState.resolveFn?.(result);
     setModalState((prev) => ({ ...prev, isOpen: false, resolveFn: null }));
   };

   const handleCancel = () => {
     modalState.resolveFn?.(null);
     setModalState((prev) => ({ ...prev, isOpen: false, resolveFn: null }));
   };

   const ModalComponent = (
      <SearchMoreModal
        isOpen={Boolean(modalState.isOpen)} // 👈 Sécurisé en booléen strict pour éviter l'erreur React
        onClose={handleCancel}
        meta={modalState.meta}
        initialData={modalState.data}
        onSelect={modalState.onSelect}
        isSelectable={modalState.isSelectable}
        onSave={(data) => {
            if (modalState.onSave) modalState.onSave(data);
            handleConfirm(data);
        }}
      />
   );
 
   return [showModal, ModalComponent];
}