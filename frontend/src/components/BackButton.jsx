import { useNavigate } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <>
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center hover:text-gray-900 transition-colors" 
      >
        <div className="flex items-center">
          <MoveLeft className="mr-2" />
          Wróć
        </div>
      </button>
    </>
  );
};

export default BackButton;