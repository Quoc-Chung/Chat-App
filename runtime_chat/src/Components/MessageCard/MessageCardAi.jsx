import React from "react";
import { getImageAspectType } from "../../utils/CheckSizeImage";
import { useState, useEffect } from "react";
const MessageCardAi = ({ isRequest, content, response, isTyping, image, file, audio }) => {
  const [aspectType, setAspectType] = useState("");

  useEffect(() => {
    getImageAspectType(image)
      .then(type => {
        setAspectType(type);

      })
      .catch(err => {
        console.error("Không đọc được ảnh:", err);
      });
  }, [image])
  return (
    <div
      className={`px-4 py-2 rounded-xl max-w-[60%] ${isRequest
          ? "self-start bg-blue-50 border border-blue-200 shadow-lg"
          : "self-end bg-gradient-to-br from-purple-100 to-indigo-100 shadow-lg"
        } my-2 mx-3 transition-all duration-300 hover:shadow-xl hover:scale-[1.03] transform-gpu`}
    >
      {/* Nội dung text */}
      {content && (
        <div className="leading-relaxed text-gray-900 break-words ">
          {content}
          {isTyping && (
            <span className="inline-flex ml-1">
              <span className="animate-bounce">.</span>
              <span className="delay-150 animate-bounce">.</span>
              <span className="delay-300 animate-bounce">.</span>
            </span>
          )}
        </div>
      )}

      {response && (
        <div className="leading-relaxed text-gray-900 break-words whitespace-pre-line">
          {response}
        </div>
      )}
      {/* Ảnh */}
      {image && (
        <div className="mt-2">
          <img
            src={image}
            alt="Attached"
            className={"max-w-full transition border border-gray-200 rounded-lg shadow-sm hover:shadow-md " + (
              (
                aspectType === "HORIZONTAL"
                  ? "w-[250px] h-[180px]"
                  : aspectType === "VERTICAL"
                    ? "w-[70px] h-[120px]"
                    : aspectType === "SQUARE"
                      ? "w-[70px] h-[70px]"
                      : "w-[120px] h-[70px]"
              )
            )}
          />
        </div>
      )}

      {/* Audio */}
      {audio && (
        <div className="flex items-center p-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <audio controls src={audio} className="w-full" />
        </div>
      )}

      {/* File */}
      {file && (
        <div className="flex items-center gap-2 p-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <span className="text-2xl">📄</span>
          <a
            href={file}
            download
            className="truncate max-w-[200px] text-sm font-medium text-blue-600 hover:underline"
          >
            {file.split("/").pop()}
          </a>
        </div>
      )}
    </div>
  );
};


export default MessageCardAi;