import React, { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react'; 

const AnnouncementModal = ({ 
  isOpen, 
  onClose, 
  type = 'info', // 'info' lub 'warning'
  message, 
  actions, 
  isBlocking = false 
}) => {
  
  // Obsługa klawisza ESC (tylko jeśli nie jest blokujący)
  useEffect(() => {
    const handleEsc = (e) => {
      if (!isBlocking && isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isBlocking, isOpen, onClose]);

  if (!isOpen) return null;

  const isWarning = type === 'warning';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={() => !isBlocking && onClose()} 
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-lg shadow-2xl transform transition-all scale-100 p-6 m-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <p className='text-lg font-bold mb-2'>Komunikat</p>
   
        <div className="flex items-center mb-6 mx-4">
            {isWarning && ( 
              <TriangleAlert size={64} /> 
            )}
          <div className="ml-4 mt-1">
            <div className="my-2 text-lg text-gray-600">
              {message}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          {actions ? (
            actions
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2   bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors"
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