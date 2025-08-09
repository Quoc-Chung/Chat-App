import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT , GET_FINAL_MESSAGE, CHAT_AI} from "./ActionType"

const initialState = {
  chats: [],
  createGroup: null,
  createChat: null,
  FinalChats: [],  
  /*- Câu trả lừi hiện tại của AI */ 
  chatAi: null, 

};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CHAT:
      return { ...state, createChat: action.payload };
    case CREATE_GROUP:
      return { ...state, createGroup: action.payload };
    case GET_USERS_CHAT:
      return { ...state, chats: action.payload };
    case GET_FINAL_MESSAGE:
      return { ...state, FinalChats: action.payload };
    case CHAT_AI: 
      return {...state, chatAi: action.payload}

    default:
      return state;
  }
};
