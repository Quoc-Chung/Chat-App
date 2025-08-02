import { BASE_API_URL } from "../../config/Api";
import {
  LOGIN,
  LOGIN_FAILURE,
  LOGOUT,
  REGISTER,
  REGISTER_FAILURE,
  REQUEST_USER,
  SEARCH_USER,
  UPDATE_USER,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,
    VERIFY_OTP_REQUEST,
    VERIFY_OTP_SUCCESS,
    VERIFY_OTP_FAILURE,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
} from "./ActionType";


export const register = (data, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      const res = await fetch(`${BASE_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Đăng ký thất bại");
      }

      if (resData.jwt) {
        localStorage.setItem("token", resData.jwt);
      }

      dispatch({ type: REGISTER, payload: resData });
      onSuccess?.(); 
    } catch (error) {
      dispatch({ type: REGISTER_FAILURE, payload: error.message });
      console.log("Error:", error.message);
      onError?.(error.message); 
    }
  };
};

export const login = (data, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      const res = await fetch(`${BASE_API_URL}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.message || "Đăng nhập thất bại");
      }

      if (resData.jwt) {
        localStorage.setItem("token", resData.jwt);
        onSuccess?.();
        dispatch({ type: LOGIN, payload: resData });
      
      } else {
        throw new Error("Tài khoản hoặc mật khẩu sai");
      }
    } catch (error) {
      dispatch({ type: LOGIN_FAILURE, payload: error.message });
      onError?.(error.message);
    }
  };
};


{/* lấy ra người dùng hiện tại */}
export const currentUser = (token) => {
  return async (dispatch) => {
    try {
      const finalToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const res = await fetch(`${BASE_API_URL}/api/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: finalToken,
        },
      });

      

      const resdata = await res.json();
      
      dispatch({ type: REQUEST_USER, payload: resdata });
    } catch (error) {
      
    }
  };
};


// Tìm kiếm người dùng
export const searchUser = (data) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_API_URL}/api/users/${data.keyword}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Tìm kiếm thất bại");
      }

      const resdata = await res.json();
      console.log("search:", resdata);
      dispatch({ type: SEARCH_USER, payload: resdata });
    } catch (error) {
      console.log("Error:", error.message);
    }
  };
};


// Cập nhật người dùng
export const updateUser = (formData, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_API_URL}/api/users/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Cập nhật user thất bại");
      }

      const resData = await res.json();
      dispatch({ type: UPDATE_USER, payload: resData.data });

      if (onSuccess) onSuccess(resData);
    } catch (error) {
      if (onError) onError(error.message);
    }
  };
};


export const logoutAction = () => async (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT, payload: null });
  dispatch({ type: REQUEST_USER, payload: null });
};




export const forgotPassword = (data, onSuccess, onError) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const res = await fetch(`${BASE_API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message);
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: resData });
    onSuccess?.(resData);
  } catch (error) {
    dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: error.message });
    onError?.(error.message);
  }
};

// Verify OTP
export const verifyOtp = (data, onSuccess, onError) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const res = await fetch(`${BASE_API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message);
    dispatch({ type: VERIFY_OTP_SUCCESS, payload: resData });
    onSuccess?.(resData);
  } catch (error) {
    dispatch({ type: VERIFY_OTP_FAILURE, payload: error.message });
    onError?.(error.message);
  }
};

// Reset Password
export const resetPassword = (data, onSuccess, onError) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const res = await fetch(`${BASE_API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.message);
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: resData });
    onSuccess?.(resData);
  } catch (error) {
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: error.message });
    onError?.(error.message);
  }
};