import React from 'react'

const AlChat = () => { 
  return (
       <div className="w-[70%] relative ">

            {/* Phân bên trên của đoạn tin nhắn  */}
            <div className="absolute z-[9999] top-0 flex items-center justify-between w-full px-6 py-1 bg-slate-300 header h-17 ">
              {/* Bên trái: Avatar và tên */}
              <div className="flex items-center space-x-4">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/anime-hay-nhat-10.jpg"
                  alt=""
                />
                <p className="font-medium">
                  AI CHAT 

                </p>
              </div>

              {/* Bên phải: Icon */}
              <div className="flex items-center space-x-4">
                <button className="cursor-pointer">
                  <img
                    src="src/assets/icon/search.png"
                    className="w-7 h-7"
                    alt="search"
                  />
                </button>
                <button className="cursor-pointer" >
                  <img
                    src="src/assets/icon/more.png"
                    className="w-7 h-7"
                    alt="more"
                  />
                </button>
              </div>
            </div>


        
            {/* Phần soạn tin nhắn giữa hai người */}
            <div className={`absolute w-full py-2 text-base bg-gray-400 footer bottom-0 ${infoChat ? "pr-[380px]" : ""}`}>
              <div className="flex items-center justify-between gap-2 px-4">
        
                <input
                  className="py-1.5 pl-3 bg-white border border-gray-200 rounded-md outline-none w-[80%] text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
                  type="text"
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type a message"
                  value={content}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreateNewMessage();
                      setContent("");
                    }
                  }}
                />           

              </div>
            </div>


          </div>
  )
}

export default AlChat