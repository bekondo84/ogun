import { useCallback, useState } from "react";
import ActionModal from "./ActionModal";

export function useActionModal() {
    const [modalState, setModalState] = useState({
        isOpen: false,
        metadata : null,
        formData : null,
        toast : null,
        resolveFn: null,
    });

    const showModal = useCallback((options) => {
    return new Promise((resolve) => {
          setModalState({
            isOpen: true,
            metadata: options.metadata,
            formData: options.formData,
            toast : options.toast,
            disabled: options.disabled
          });
     });
    }, []);

    const handleSave = () => {
    modalState.resolveFn?.(true);
    setModalState((prev) => ({ ...prev, isOpen: false, resolveFn: null }));
  };

  const handleCancel = () => {
    modalState.resolveFn?.(false);
    setModalState((prev) => ({ ...prev, isOpen: false, resolveFn: null }));
    //console.log ('useActionModal.handleCancel ----------------------- '+JSON.stringify(modalState.formData))
  };

  const ModalComponent = (
     <ActionModal
        isOpen={modalState.isOpen}
        metadata={modalState.metadata}
        formData={modalState.formData}
        toast={modalState.toast}
        onClose={handleCancel}
        onSave={handleSave}
     >
        {modalState.children}
     </ActionModal>
  );
  return [showModal, ModalComponent];
}