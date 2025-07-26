import React from "react";
import StatusUserCard from "./StatusUserCard";
import { useNavigate } from "react-router-dom";

const Status = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 bg-blue-200 ">
       <div className="absolute top-0 w-full shadow-md py-14 animate-color-change"> </div>
      <div className="absolute bottom-0 w-full shadow-md py-14 animate-color-change "></div>
      
      <div className="flex w-full max-w-7xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl">
        {/* Left section - Friends list */}
        <div className="flex flex-col w-full p-6 bg-gray-800 lg:w-1/3 z-100">
          <div className="h-20 mb-4">
            <StatusUserCard />
          </div>
          <hr className="border-gray-700" />
          <div className="flex-1 mt-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => (
              <StatusUserCard key={index} />
            ))}
          </div>
        </div>
        {/* Right section - Status content */}
        <div className="relative w-full p-8 lg:w-2/3 bg-gray-950">
          <button
            onClick={handleNavigate}
            className="absolute p-2 transition-colors duration-200 bg-gray-700 rounded-full top-4 right-4 hover:bg-gray-600"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
          {/* Add content for status display */}
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-400">Select a friend to view their status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;