import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE } from "./ActionType";
import { BASE_API_URL } from "../../config/Api";
import { DELETE_MESSAGE } from "./ActionType";
export const createMessage = (messageData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/messages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${messageData.token}`,
      },
      body: JSON.stringify(messageData.data),
    });

    if (!res.ok) throw new Error("Gửi tin nhắn thất bại!");

    const data = await res.json();
    console.log("Tin nhan duoc gui di dang: ", data); 
    dispatch({ type: CREATE_NEW_MESSAGE, payload: data });
  } catch (error) {
    console.error("Error creating message:", error.message);
  }
};

export const getAllMessage = (messageData) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/messages/chat/${messageData.chatId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${messageData.token}`,
      },
    });

    if (!res.ok) throw new Error("Lấy tin nhắn thất bại!");

    const data = await res.json();
    console.log("All message: ",data);
    dispatch({ type: GET_ALL_MESSAGE, payload: data });
  } catch (error) {
    console.error("Error getting messages:", error.message);
  }
};


export const deleteMessage = ({ messageId, token }) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/messages/${messageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Xóa tin nhắn thất bại");

    dispatch({ type: DELETE_MESSAGE, payload: messageId });
  } catch (error) {
    console.error("Lỗi khi xóa tin nhắn:", error.message);
  }
};
