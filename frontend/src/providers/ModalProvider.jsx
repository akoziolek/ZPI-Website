import { useState, useCallback } from 'react';
import { ModalContext } from '../contexts/ModalContext';

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

  const value = { 
    openModal, 
    closeModal, 
    modalConfig 
  };

  return (
    <ModalContext.Provider value={value}>
      {children} 
    </ModalContext.Provider>
  );
};

