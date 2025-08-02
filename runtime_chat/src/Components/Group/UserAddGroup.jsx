import React from "react";
import { BASE_API_URL } from "../../config/Api";
const UserAddGroup = ({user}) => {
  return (
    <div
      className="flex items-center p-2.5 transition-all duration-200 bg-gray-200 rounded-md shadow hover:shadow-md hover:bg-gray-100 cursor-pointer"
    >
      <div className="relative">
        <img
          className="border border-blue-500 rounded-full w-9 h-9"
          src={
             user.profilePicture ? user.profilePicture
             : "https://cdn-media.sforum.vn/storage/app/media/Van%20Pham/5/5b/anh-ac-quy-anime-53.jpg"
            
          }   
          alt="User avatar"
        />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
      </div>
      <div className="ml-2.5 text-black">
        <p className="text-sm font-medium">{user.fullname}</p>
      </div>
    </div>
  );
};

export default UserAddGroup;
