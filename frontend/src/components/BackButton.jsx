import React from "react";
import { useNavigate } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>
      <div className="flex">
        <MoveLeft className="mr-2"/>
        Wróć
      </div>

    </button>
  );
};

export default BackButton;