import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { login, forgotPassword,currentUser } from "../../Redux/Auth/Action";
const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });

  const auth = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  const handleChangeInput = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      login(
        { email: inputData.email, password: inputData.password },
        () => {
         
          Swal.fire({
            title: "🎉 Đăng nhập thành công!",
            text: "Chào mừng bạn quay lại!",
            icon: "success",
            confirmButtonText: "OK",
          });
           navigate("/");
          
        },
        (err) => {
          toast.error(`❌ ${err}`);
        }
      )
    );
    
    
    
  };

  const handleForgotPassword = () => {
  if (!inputData.email) {
    toast.error("❗ Vui lòng nhập email trước.");
    return;
  }

  dispatch(
    forgotPassword(
      { email: inputData.email },
      (res) => {
        toast.success("📨 OTP đã được gửi!");
        navigate("/verify-otp", { state: { email: inputData.email } }); 
      },
      (err) => toast.error(`❌ ${err}`)
    )
  );
};


  useEffect(() => {
    if (token) {
      dispatch(currentUser(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (auth.reqUser?.fullname) {
      navigate("/");
    }
  }, [auth.reqUser, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Đăng nhập
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={inputData.email}
              onChange={handleChangeInput}
              placeholder="Nhập email"
              autoComplete="email"
              className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={inputData.password}
              onChange={handleChangeInput}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              className="w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-500 hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white transition-all duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Đăng nhập
          </button>
        </form>

        <div className="my-5 text-sm text-center text-gray-500">
          — hoặc đăng nhập bằng —
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            onClick={() => alert("Đăng nhập Google")}
          >
            <FcGoogle className="text-xl" />
            Google
          </button>

          <button
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => alert("Đăng nhập Facebook")}
          >
            <FaFacebookF className="text-xl" />
            Facebook
          </button>
        </div>

        <div className="mt-5 text-sm text-center">
          Bạn chưa có tài khoản?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline"
          >
            Đăng ký
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SignIn;