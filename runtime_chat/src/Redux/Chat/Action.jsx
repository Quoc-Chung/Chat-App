import { BASE_API_URL } from "../../config/Api";
import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT , GET_FINAL_MESSAGE, CHAT_AI} from "./ActionType";


export const createChat = (chatData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chats/singlechat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatData.token}`,
      },
      body: JSON.stringify(chatData.data),
    });

    const data = await res.json();
    dispatch({ type: CREATE_CHAT, payload: data });
    chatData.onSuccess?.(data);
  } catch (error) {
    console.error("Error creating chat:", error);
  }
};

export const createGroupChat = ({ form, token }) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chats/group`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
       
      },
      body: form,
    });

    const data = await res.json();

    dispatch({ type: CREATE_GROUP, payload: data });
    return { payload: data }; 
  } catch (error) {
    console.error("Error creating group chat:", error);
    return { payload: { status: false, message: "Lỗi mạng!" } };
  }
};



/**
 * Lấy ra một danh sách các đoạn chat mà user tham gia 
 * @param {} chatData 
 * @returns một List<Chat> 
 */
export const getUserChat = (chatData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chats/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatData.token}`,
      },
    });

    const data = await res.json();
    dispatch({ type: GET_USERS_CHAT, payload: data });
  } catch (error) {
    console.error("Error getting user chats:", error);
  }
};

export const getAllChatFinal = (token) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/chats/listmessagefinal`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    dispatch({ type: GET_FINAL_MESSAGE , payload: data });
  } catch (error) {
    console.error("Error getting all chats:", error);
  }
}

export const chatWithAi = (formData, onSuccess, onError) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");

      const res = await fetch(`${BASE_API_URL}/api/chats/chat_ai`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });

      if (!res.ok) {
        let errMsg = "Lỗi mạng hoặc server.";
        try {
          const errData = await res.json();
          errMsg = errData.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const resData = await res.json();
      dispatch({ type: CHAT_AI, payload: resData });

      if (typeof onSuccess === "function") onSuccess(resData);
    } catch (error) {
      console.error("Lỗi khi chat với AI:", error);
      if (typeof onError === "function") onError(error.message);
    }
  };
};
