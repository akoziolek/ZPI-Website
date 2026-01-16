// src/components/GlobalModal.jsx
import { useModal } from '../contexts/ModalContext'; // lub hooks/useModal
import AnnouncementModal from './AnnouncementModal';

export const GlobalModal = () => {
  const { modalConfig, closeModal } = useModal();

  // Jeśli modal jest zamknięty, nic nie renderuj (optymalizacja)
  if (!modalConfig.isOpen) return null;

  return (
    <AnnouncementModal
      isOpen={modalConfig.isOpen}
      onClose={closeModal}
      {...modalConfig} // Przekazujemy resztę propsów (type, message, actions)
    />
  );
};