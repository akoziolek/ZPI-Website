import React, { useState, useCallback } from 'react';
import AnnouncementModal from '../components/AnnouncementModal';
import { ModalContext } from '../hooks/useModal';

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const openModal = useCallback((config) => {
    setModalConfig({
      ...config,    
      isOpen: true,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);


  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <AnnouncementModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        type={modalConfig.type || "info"}
        message={modalConfig.message}
        isBlocking={modalConfig.isBlocking ?? true}
        actions={modalConfig.actions}
        refresh={modalConfig.refresh}
      />
    </ModalContext.Provider>
  );
};

