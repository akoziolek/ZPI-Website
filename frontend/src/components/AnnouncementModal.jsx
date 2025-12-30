import React, { useEffect } from 'react';
import { TriangleAlert } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const AnnouncementModal = ({ 
  isOpen, 
  onClose, 
  type = 'info', // 'info' lub 'warning'
  message, 
  actions, 
  isBlocking = false,
  refresh = true,
}) => {
  
  const navigate = useNavigate();
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60  transition-opacity"
      onClick={() => !isBlocking && onClose()} 
    >
      <div 
        className="relative w-full max-w-md min-h-55 bg-gray-200 border-3 border-gray-800 shadow-2xl transform transition-all scale-100 p-6 m-4"
        onClick={(e) => e.stopPropagation()} 
      >
        <p className='text-2xl font-bold mb-4'>Komunikat</p>
   
        <div
          className={`flex mb-6 mx-4 items-center ${
            isWarning ? "justify-left" : "justify-center"
          }`}
        >
          {isWarning && <TriangleAlert size={64} />}

          <div className={`${isWarning ? "ml-4" : ""}`}>
            <div className="my-2 text-lg">
              {message}
            </div>
          </div>
        </div>


        <div className="flex justify-center gap-3 mt-4">
          {console.log(actions)}
          {actions ? (
            actions
          ) : (
            <button
              onClick={() => { onClose(); if(refresh){ navigate(0)}; }}
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