import React from "react";

const MessageCard = ({ isReqMessage, content }) => {
  return (
    <div
      className={`px-4 py-2 rounded-xl max-w-[60%] ${
        isReqMessage
          ? "self-start bg-blue-50 border border-blue-200 shadow-lg"
          : "self-end bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg"
      } my-2 mx-3 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] transform-gpu`}
    >
      <p className="leading-relaxed text-gray-900 break-words font-mdsemibold text-">
        {content}
      </p>
    </div>
  );
};

export default MessageCard;