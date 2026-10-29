import { useCallback, useState } from "react";
import FormPagesModal from "../form/fields/FormPageModal";

export function useFormPageModal() {
    const [modalState, setModalState] = useState({
             isOpen: false, 
             onClose: null, 
             metadata: null, 
             initialData: null, 
             formData: null, 
             setFormData: null, 
             onSave:null, 
             disabled:null, 
             onSearch: null, 
             onFindById: null,
             resolveFn: null, 
       });

       const showModal = useCallback((options) => {
             return new Promise((resolve) => {
                setModalState({
                    isOpen: true, 
                    onClose: options.onClose || (() => handleCancel()), 
                    metadata: options.metadata, 
                    initialData: options.initialData, 
                    formData: options.formData, 
                    setFormData: options.setFormData, 
                    disabled:options.disabled, 
                    onSearch: options.onSearch, 
                    onFindById: options.onFindById,
                    resolveFn: resolve, 
                    onSave:options.onSave,                    
                })
             })
       });
    
       const handleConfirm = (result) => {
            modalState.resolveFn?.(result);
            setModalState((prev) => ({ ...prev, isOpen: false, resolveFn: null }));
        };

        const handleCancel = () => {
            modalState.resolveFn?.(null);
            setModalState((prev) => ({ ...prev, isOpen: false, resolveFn: null }));
        };

        const ModalComponent = (
            <FormPagesModal 
               isOpen={Boolean(modalState.isOpen)}
               onClose={handleCancel}
               metadata={modalState.metadata}
               initialData={modalState.initialData}
               formData={modalState.formData}
               setFormData={modalState.setFormData}
               disabled={modalState.disabled} 
               onSearch={modalState.onSearch} 
               onFindById={modalState.onFindById}
               onSave={(data) => {
                        if (modalState.onSave) modalState.onSave(data);
                        handleConfirm(data);
                    }}
            />
        );

        return [showModal, ModalComponent];
}