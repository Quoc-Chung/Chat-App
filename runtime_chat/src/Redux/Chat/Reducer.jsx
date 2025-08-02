import { CREATE_CHAT, CREATE_GROUP, GET_USERS_CHAT } from "./ActionType"

const initialState = {
  chats: [],
  createGroup: null,
  createChat: null,

};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CHAT:
      return { ...state, createChat: action.payload };
    case CREATE_GROUP:
      return { ...state, createGroup: action.payload };
    case GET_USERS_CHAT:
      return { ...state, chats: action.payload };
 

    
    default:
      return state;
  }
};
