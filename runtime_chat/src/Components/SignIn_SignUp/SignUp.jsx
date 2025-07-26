import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, register } from "../../Redux/Auth/Action";
import Swal from "sweetalert2";
/*- Trang giao dien dang ky*/ 

/*
    private String fullname;

    private String email;

    private String password;

*/ 
const SignUp = () => {
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const token = localStorage.getItem("token"); 


  const handleChangeInput = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
  e.preventDefault();
     localStorage.setItem("newlyRegistered", "true");
    dispatch(
      register(
        inputData,
        () => {
           Swal.fire({
              title: "🎉 Đăng ký thành công!",
              text: "Chào mừng bạn trải nghiệm app!",
              icon: "success",
              timer: 2000, 
              showConfirmButton: false, 
            });


        },
        (err) => {
          toast.error(`Đăng ký thất bại: ${err}`);
        }
      )
    );
  };


  useEffect(() => {
       if(token){
        dispatch(currentUser(token))
       }
  },[token]);

  useEffect(() => {
    if(auth.reqUser?.fullname){
         navigate("/")
    }
    
  },[auth.reqUser])

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-[90%] max-w-md p-10 bg-white rounded-lg shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Tạo Tài Khoản</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Tên người dùng</label>
            <input
              type="text"
              name="fullname"
              value={inputData.fullname}
              onChange={handleChangeInput}
              placeholder="Nhập tên"
              
              className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={inputData.email}
              onChange={handleChangeInput}
              placeholder="Nhập email"
              autoComplete="email" 
              className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={inputData.password}
              onChange={handleChangeInput}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white transition-all duration-200 bg-green-600 rounded-md hover:bg-green-700"
          >
            Đăng ký
          </button>
        </form>

        <div className="my-5 text-sm text-center text-gray-500">— hoặc đăng ký bằng —</div>

        <div className="flex items-center justify-center gap-4">
          <button
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            onClick={() => alert("Đăng ký Google")}
          >
            <FcGoogle className="text-xl" />
            Google
          </button>

          <button
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => alert("Đăng ký Facebook")}
          >
            <FaFacebookF className="text-xl" />
            Facebook
          </button>
        </div>

        <div className="mt-5 text-sm text-center">
          Đã có tài khoản?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-green-600 cursor-pointer hover:underline"
          >
            Đăng nhập
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
