import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Redux/Auth/Action";
import { toast, ToastContainer } from "react-toastify";

const WelcomeProfileSetup = ({ onFinish, handleUpdateInfoUser }) => {
  const dispatch = useDispatch();
  const { reqUser } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    fullname: reqUser?.fullname || "",
    email: reqUser?.email || "",
    bio: reqUser?.bio || "",
    birthday: reqUser?.birthday || "",
    profilePicture: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = files[0];
      setFormData({ ...formData, profilePicture: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  console.log(formData);
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();

    const userInfo = {
      fullname: formData.fullname,
      birthday: formData.birthday,
      bio: formData.bio,
    };

    // Append JSON -> 'data'
    form.append(
      "data",
      new Blob([JSON.stringify(userInfo)], { type: "application/json" })
    );

    // Append file nếu có
    if (formData.profilePicture) {
      form.append("profile_picture", formData.profilePicture);
    }
    toast.success("Cập nhật thành công!");

    dispatch(
      updateUser(
        form,
        () => {
          toast.success("Cập nhật thành công!");
          localStorage.removeItem("newlyRegistered");
          onFinish();
        },
        (err) => toast.error("Lỗi cập nhật: " + err)
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[95%] max-w-lg transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        <button onClick={handleUpdateInfoUser}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="absolute size-10 top-3 right-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <h2 className="flex items-center justify-center gap-2 mb-3 text-2xl font-bold text-center text-gray-800">
          <span className="text-3xl">👋</span> Chào mừng{" "}
          {reqUser?.fullname || "bạn"}
        </h2>
        <p className="mb-6 text-sm font-medium text-center text-gray-600">
          Hoàn thiện hồ sơ để bắt đầu trải nghiệm tuyệt vời!
        </p>

        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 overflow-hidden border-2 border-gray-200 rounded-full shadow-sm">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-100">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Họ và tên"
              className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 transition-colors border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 text-gray-500 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
            />
          </div>

          <div>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-800 transition-colors border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <input
            type="text"
            name="bio"
            placeholder="Thêm tiểu sử cho bạn nèo <''>"
            value={formData.bio}
            onChange={handleChange} // thêm dòng này để form hoạt động
            className="w-full px-4 py-3 text-gray-800 placeholder-gray-400 transition-colors border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ảnh đại diện
            </label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm text-gray-600 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition-all duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300"
          >
            Lưu thông tin
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WelcomeProfileSetup;