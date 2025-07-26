import React from "react";
import { BASE_API_URL } from "../../config/Api";

const ChatCard = ({ name, userImage}) => {
  return (
    <div className="flex items-center px-3 py-2 mx-1 my-0.5 bg-white rounded-lg shadow-md cursor-pointer group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ease-in-out border border-gray-100">
      <div className="w-[20%]">
        <img
          src={
             `${BASE_API_URL}/uploads/${userImage}`
          }
          className="object-cover w-12 h-12 transition-transform duration-200 border-2 border-indigo-200 rounded-full group-hover:scale-105"
          alt="User avatar"
        />
      </div>
      <div className="pl-3 w-[80%]">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-gray-800 transition-colors duration-200 group-hover:text-indigo-600">
            {name}
          </p>
          
          {/* Thời gian của tin nhắn lần cuối  */}
          <p className="text-xs text-gray-500 group-hover:text-gray-600">
            timestamp
          </p>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          {/* Hiển thị tin nhắn cuối cùng của người đó */}
          <p className="text-sm text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap max-w-[70%]">
            message...
          </p>
          <div className="flex items-center space-x-1.5">
            <p className="px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full group-hover:bg-green-600 transition-colors duration-200">
              5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;


// email
// : 
// "tuquocchung@gmail.com"
// fullname
// : 
// "Tu Quoc Chung"
// id
// : 
// 1
// password
// : 
// "$2a$10$C60nwpRj2UsoHZPPL1XeX.yLSf0waU7LxKxsWTCGMae4HFKvIF7kW"
// profilePicture
// : 
// null