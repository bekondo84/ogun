import { useState, useCallback } from 'react';
import OdooModal from './OdooModal';

export function useOdooModal() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    children: null,
    variant: 'info',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    showCancel: true,
    resolveFn: null,
  });

  // Fonction universelle d'ouverture (Supporte Alert, Confirm, Info, Notification)
  const showModal = useCallback((options) => {
    return new Promise((resolve) => {
      setModalState({
        isOpen: true,
        title: options.title || 'Information',
        message: options.message || '',
        children: options.children || null,
        variant: options.variant || 'info',
        confirmText: options.confirmText || (options.showCancel === false ? 'OK' : 'Confirmer'),
        cancelText: options.cancelText || 'Annuler',
        showCancel: options.showCancel ?? true,
        resolveFn: resolve,
      });
    });
  }, []);

  const handleConfirm = () => {
    modalState.resolveFn?.(true);
    setModalState((prev) => ({ ...prev, isOpen: false, resolveFn: null }));
  };

  const handleCancel = () => {
    modalState.resolveFn?.(false);
    setModalState((prev) => ({ ...prev, isOpen: false, resolveFn: null }));
  };

  // Composant visuel à inclure dans le render de votre page/layout
  const ModalComponent = (
    <OdooModal
      isOpen={modalState.isOpen}
      title={modalState.title}
      message={modalState.message}
      variant={modalState.variant}
      confirmText={modalState.confirmText}
      cancelText={modalState.cancelText}
      showCancel={modalState.showCancel}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      {modalState.children}
    </OdooModal>
  );

  return [showModal, ModalComponent];
}