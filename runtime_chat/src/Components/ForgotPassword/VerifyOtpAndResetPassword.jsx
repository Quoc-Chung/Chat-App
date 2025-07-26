import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyOtp, resetPassword } from "../../Redux/Auth/Action";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const VerifyOtpAndResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleVerifyOtp = () => {
    if (!otp) {
      toast.error("❗ Vui lòng nhập mã OTP.", { toastId: "otp-empty" });
      return;
    }

    dispatch(
      verifyOtp(
        { email, otp: otp.trim() },
        () => {
          toast.success("✅ OTP chính xác!", { toastId: "otp-success" });
          setIsOtpVerified(true);
        },
        (err) => toast.error(`❌ OTP không hợp lệ: ${err}`, { toastId: "otp-error" })
      )
    );
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("❗ Vui lòng nhập mật khẩu mới và xác nhận.", { toastId: "password-empty" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("❗ Mật khẩu xác nhận không khớp.", { toastId: "password-mismatch" });
      return;
    }

    dispatch(
      resetPassword(
        { email, newPassword: newPassword.trim(), confirmPassword: confirmPassword.trim() },
        () => {
          Swal.fire({
            title: "✅ Đổi mật khẩu thành công!",
            text: "Bạn có thể đăng nhập lại với mật khẩu mới.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#10B981",
          });
          navigate("/signin");
        },
        (err) => toast.error(`❌ ${err}`, { toastId: "reset-password-error" })
      )
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-purple-100 to-blue-200">
      <div className="w-full max-w-md p-8 transition-all duration-300 transform bg-white shadow-xl rounded-2xl hover:shadow-2xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          {isOtpVerified ? "Đặt lại mật khẩu" : "Xác minh OTP"}
        </h2>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* OTP Input Section */}
          {!isOtpVerified && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Mã OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Nhập mã OTP từ email"
                    className="w-full px-4 py-3 text-sm transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3 font-medium text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Xác minh OTP
              </button>
            </div>
          )}

          {/* Password Reset Section */}
          {isOtpVerified && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-4 py-3 text-sm transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-1.1.9-2 2-2m-2 6v-2m-2-4c0-1.1.9-2 2-2s2 .9 2 2m0 0c0 1.1-.9 2-2 2s-2-.9-2-2zm0 0c0-1.1.9-2 2-2s2 .9 2 2m-6 5v-1a4 4 0 014-4h4a4 4 0 014 4v1m-10 0h6"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full px-4 py-3 text-sm transition-all duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-1.1.9-2 2-2m-2 6v-2m-2-4c0-1.1.9-2 2-2s2 .9 2 2m0 0c0 1.1-.9 2-2 2s-2-.9-2-2zm0 0c0-1.1.9-2 2-2s2 .9 2 2m-6 5v-1a4 4 0 014-4h4a4 4 0 014 4v1m-10 0h6"
                    />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 font-medium text-white transition-all duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Đặt lại mật khẩu
              </button>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/signin")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Quay lại đăng nhập
          </button>
        </div>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default VerifyOtpAndResetPassword;