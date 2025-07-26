import { CREATE_NEW_MESSAGE, GET_ALL_MESSAGE, DELETE_MESSAGE } from "./ActionType";

const initialState = {
  newMessage: null,
  messages: [],
};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NEW_MESSAGE:
      return {
        ...state,
        newMessage: action.payload,
        messages: [...state.messages, action.payload],
      };
    case GET_ALL_MESSAGE:
      return {
        ...state,
        messages: action.payload,
      };
    case DELETE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.payload),
      };
    default:
      return state;
  }
};

