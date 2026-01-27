import { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext'; 

const AnnouncementModal = () => {
  const { modalConfig, closeModal } = useModal();
  const { 
    isOpen, 
    type = 'info', 
    message, 
    actions, 
    isBlocking = false, 
    refresh = true 
  } = modalConfig;

  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (!isBlocking && isOpen && e.key === 'Escape') {
        closeModal();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isBlocking, isOpen, closeModal]);

  if (!isOpen) return null;

  const isWarning = type === 'warning';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity"
      onClick={() => !isBlocking && closeModal()} 
    >
      <div 
        className="relative w-full max-w-md min-h-55 bg-gray-200 border-3 border-gray-800 shadow-2xl transform transition-all scale-100 p-6 m-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <p className='text-2xl font-bold mb-4'>Komunikat</p>
   
        <div className={`flex mb-6 mx-4 items-center ${isWarning ? "justify-left" : "justify-center"}`}>
          {isWarning && <TriangleAlert size={64} />}
          <div className={`${isWarning ? "ml-4" : ""}`}>
            <div className="my-2 text-lg">
              {message}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          {actions ? (
            actions
          ) : (
            <button
              onClick={() => { 
                closeModal(); 
                if (refresh) { navigate(0); }
              }}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded border border-gray shadow"
            >
              Zamknij
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;