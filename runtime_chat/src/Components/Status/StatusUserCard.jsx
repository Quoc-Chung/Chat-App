import React from "react";
import { useNavigate } from "react-router-dom";

const StatusUserCard = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/status/{userId}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="flex items-center p-3 transition-all duration-200 bg-gray-700 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:bg-gray-600"
    >
      <div className="relative">
        <img
          className="w-10 h-10 border-2 border-blue-500 rounded-full lg:w-12 lg:h-12"
          src="https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-avatar-anime-chibi-boy-1.jpg"
          alt="User avatar"
        />
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-700 rounded-full"></div>
      </div>
      <div className="ml-3 text-white">
        <p className="text-sm font-medium lg:text-base">Thanh Hong</p>
      </div>
    </div>
  );
};

export default StatusUserCard;