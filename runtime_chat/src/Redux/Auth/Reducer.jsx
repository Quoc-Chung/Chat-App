import {
  REGISTER,
  LOGIN,
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

const initialValue = {
  signup: null,
  signin: null,
  reqUser: null,
  searchUser: [],
  updateDataUser: null,

  forgotPassword: {
    loading: false,
    data: null,
    error: null,
  },

  verifyOtp: {
    loading: false,
    data: null,
    error: null,
  },

  resetPassword: {
    loading: false,
    data: null,
    error: null,
  },
};

export const authReducer = (state = initialValue, { type, payload }) => {
  switch (type) {
    // ----- AUTH -----
    case REGISTER:
      return { ...state, signup: payload };

    case LOGIN:
       
      return { ...state, signin: payload };

    // ----- USER INFO -----
    case REQUEST_USER:
      console.log("current hien tai : ", payload)
      return { ...state, reqUser: payload };

    case SEARCH_USER:
      return {
        ...state,
        searchUser: Array.isArray(payload) ? payload : [payload],
      };

    case UPDATE_USER:
      return {
        ...state,
        updateDataUser: payload,
        reqUser: {
          ...state.reqUser,
          ...payload, 
        },
      };


    // ----- FORGOT PASSWORD -----
    case FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        forgotPassword: { loading: true, data: null, error: null },
      };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPassword: { loading: false, data: payload, error: null },
      };

    case FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        forgotPassword: { loading: false, data: null, error: payload },
      };

    // ----- VERIFY OTP -----
    case VERIFY_OTP_REQUEST:
      return {
        ...state,
        verifyOtp: { loading: true, data: null, error: null },
      };

    case VERIFY_OTP_SUCCESS:
      return {
        ...state,
        verifyOtp: { loading: false, data: payload, error: null },
      };

    case VERIFY_OTP_FAILURE:
      return {
        ...state,
        verifyOtp: { loading: false, data: null, error: payload },
      };

    // ----- RESET PASSWORD -----
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        resetPassword: { loading: true, data: null, error: null },
      };

    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: { loading: false, data: payload, error: null },
      };

    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        resetPassword: { loading: false, data: null, error: payload },
      };

    default:
      return state;
  }
};
