import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { BASE_API_URL } from "../../config/Api";
import { updateUser } from "../../Redux/Auth/Action";

const Profile = ({ handleOpenCloseProfile, user }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const dispatch = useDispatch();
  const { reqUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullname: reqUser?.fullname || user?.fullname || "User Name",
    bio: reqUser?.bio || user?.bio || "Just a friendly user exploring the world!",
    profilePicture: null,
  });


  console.log("reqUser:", reqUser);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          toast.warn("Vui lòng chọn file ảnh!");
          return;
        }
        setFormData({ ...formData, profilePicture: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFormData({ ...formData, profilePicture: null });
        setPreviewImage(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmitField = (field) => {
  const form = new FormData();
  const userInfo = {};

  if (field === "profilePicture") {
    if (!formData.profilePicture) {
      toast.warn("Bạn chưa chọn ảnh mới!");
      return;
    }
    form.append("profile_picture", formData.profilePicture);
    userInfo.full_name = reqUser.fullname;
    userInfo.bio = reqUser.bio;
  }

  if (field === "fullname") {
    if (!formData.fullname.trim()) {
      toast.warn("Tên không được để trống!");
      return;
    }
    userInfo.full_name = formData.fullname;
    userInfo.bio = reqUser.bio;
  }

  if (field === "bio") {
    if (!formData.bio.trim()) {
      toast.warn("Tiểu sử không được để trống!");
      return;
    }
    userInfo.full_name = reqUser.fullname;
    userInfo.bio = formData.bio;
  }

  form.append("data", new Blob([JSON.stringify(userInfo)], { type: "application/json" }));

  dispatch(
    updateUser(
      form,
      (resData) => {
        toast.success(
          `${field === "profilePicture"
            ? "Ảnh đại diện"
            : field === "fullname"
              ? "Tên"
              : "Tiểu sử"
          } cập nhật thành công!`
        );

        setFormData({
          ...formData,
          fullname: resData.data?.full_name || formData.fullname,
          bio: resData.data?.bio || formData.bio,
          profilePicture: null,
        });

        if (field === "fullname") setIsEditingName(false);
        if (field === "bio") setIsEditingBio(false);
        if (field === "profilePicture") setPreviewImage(null);
      },
      (err) => toast.error(`Lỗi cập nhật ${field}: ${err}`)
    )
  );
};

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex items-center px-4 py-4 space-x-4 text-white shadow-lg bg-gradient-to-r from-gray-600 to-gray-800">
        <button
          onClick={handleOpenCloseProfile}
          className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-900"
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
        <p className="text-lg font-semibold text-center uppercase">Hồ sơ</p>
      </div>

      <div className="flex flex-col items-center justify-start flex-grow px-4 mt-4">
        <div className="w-full max-w-md p-6 bg-white border border-gray-100 shadow-md rounded-2xl">
          <div className="flex flex-col items-center">
            <label htmlFor="imgInput" className="relative group">
              <div className="relative w-32 h-32 overflow-hidden border-2 border-gray-200 rounded-full shadow-sm">
                {previewImage ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <button
                      onClick={() => handleSubmitField("profilePicture")}
                      className="absolute z-10 px-2.5 py-1 mr-4 text-sm font-medium text-white transition-all duration-200 bg-green-600 rounded-full shadow-sm bottom-2 right-2 hover:bg-green-700"
                    >
                      Cập nhật
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      className="object-cover object-center w-full h-full"
                      src={
                        reqUser?.profilePicture
                          ? `${BASE_API_URL}/uploads/${reqUser.profilePicture}?t=${Date.now()}`
                          : "https://i.pinimg.com/736x/81/4f/75/814f75414eda6651e2db3ee9a4e5efcf.jpg"
                      }
                      alt="Profile avatar"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black rounded-full opacity-0 bg-opacity-30 group-hover:opacity-100">
                      <span className="text-xs font-medium text-white">
                        Thay đổi ảnh
                      </span>
                    </div>
                  </>
                )}
              </div>
            </label>
            <input
              type="file"
              id="imgInput"
              accept="image/*"
              name="profilePicture"
              onChange={handleChange}
              className="hidden"
            />
          </div>

          <div className="mt-4 text-center">
            {isEditingName ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="px-3 py-2 text-base font-semibold text-gray-800 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  onClick={() => handleSubmitField("fullname")}
                  className="px-3 py-1.5 text-sm text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Lưu
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-base font-semibold text-gray-800">
                  {formData.fullname}
                </h2>
                <button
                  onClick={handleEditName}
                  className="p-1 transition-colors duration-200 rounded-full hover:bg-gray-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="text-gray-600 size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8_FLAT_2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {reqUser?.email || user?.email || "user@example.com"}
            </p>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Tiểu sử</h3>
              <button
                onClick={handleEditBio}
                className="p-1 transition-colors duration-200 rounded-full hover:bg-gray-200"
                disabled={isEditingBio}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-gray-600 size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8_FLAT_2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            </div>
            {isEditingBio ? (
              <div className="mt-2">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg outline-none resize-none bg-gray-50 focus:ring-2 focus:ring-green-500"
                  rows="3"
                />
                <button
                  onClick={() => handleSubmitField("bio")}
                  className="px-3 py-1.5 mt-2 text-sm text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Lưu tiểu sử
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-center text-gray-600 break-words">
                {formData.bio}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 mt-4">
            <div className="flex items-center justify-between p-2 border border-gray-100 rounded-lg bg-gray-50">
              <span className="text-xs font-medium text-gray-700">
                Tham gia
              </span>
              <span className="text-xs text-gray-500">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 border border-gray-100 rounded-lg bg-gray-50">
              <span className="text-xs font-medium text-gray-700">
                Tin nhắn đã gửi
              </span>
              <span className="text-xs text-gray-500">142</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;