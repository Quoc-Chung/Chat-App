import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createGroupChat } from "../../Redux/Chat/Action";

const NewGroup = ({ ReturnHome, lstUserID }) => {
  const [groupName, setGroupName] = useState("");
  const [imagePreview, setImagePreview] = useState(
    "https://mondialbrand.com/wp-content/uploads/2024/03/anh-anime-0258.jpg"
  ); 
  const [chatImageFile, setChatImageFile] = useState(null); 
  const dispatch= useDispatch(); 
  const navigate = useNavigate();

  // Khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl); 
      setChatImageFile(file); 
    }
  };


const handleSubmitGroup = async () => {
  if (!groupName.trim()) {
    toast.error("Tên nhóm không được để trống!");
    return;
  }

  if (!lstUserID || lstUserID.length === 0) {
    toast.error("Bạn phải chọn ít nhất một người để tạo nhóm!");
    return;
  }

  try {
    const form = new FormData();

    const groupchatRequest = {
      chatName: groupName,
      userIds: lstUserID,
    };

    form.append(
      "data",
      new Blob([JSON.stringify(groupchatRequest)], { type: "application/json" })
    );

    if (chatImageFile) {
      form.append("chat_image", chatImageFile);
    }

    const token = localStorage.getItem("token");

    const response = await dispatch(createGroupChat({ form, token }));

    if (response?.payload?.status === true) {
      toast.success("Tạo nhóm thành công!");
      navigate("/");
    } else {
      toast.error(response?.payload?.message || "Tạo nhóm thất bại!");
    }
  } catch (err) {
    console.error("Lỗi khi gửi form:", err);
    toast.error("Đã xảy ra lỗi khi tạo nhóm!");
  }
};



  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex items-center px-4 pt-4 pb-4 space-x-6 text-white shadow-lg bg-gradient-to-r from-gray-400 to-gray-600">
        <button
          onClick={ReturnHome}
          className="p-2 transition-colors duration-200 rounded-full hover:bg-indigo-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="text-white size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <p className="text-xl font-semibold text-center uppercase">New Group</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start flex-grow px-4 mt-6 h-[73vh]">
        <div className="w-full max-w-md p-6 bg-white border border-gray-100 rounded-lg shadow-md">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <label htmlFor="imgInput" className="relative group">
              <img
                className="rounded-full w-[18vw] h-[18vw] max-w-[160px] max-h-[160px] object-cover cursor-pointer border-4 border-indigo-200 group-hover:border-indigo-300 transition-all duration-200"
                src={imagePreview}
                alt="Group avatar"
              />
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black rounded-full opacity-0 bg-opacity-30 group-hover:opacity-100">
                <span className="text-xs font-medium text-white">
                  Change Photo
                </span>
              </div>
            </label>
            <input
              type="file"
              id="imgInput"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* Group Name Input */}
          <div className="mt-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-4 py-2 text-sm text-gray-800 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      </div>

      {/* Add Group Button */}
      <div className="px-6 py-4 mt-auto bg-gray-100">
        <button
          onClick={handleSubmitGroup}
          className="w-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Add Group
        </button>
      </div>
    </div>
  );
};

export default NewGroup;
