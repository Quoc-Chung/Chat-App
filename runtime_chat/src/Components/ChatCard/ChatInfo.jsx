import React from 'react'

const ChatInfo = ({ currentChat, auth, setInfoChat }) => {
  return (
    <div className="absolute top-0 right-0 z-[9999] w-[370px]  h-full bg-white shadow-lg border-l border-gray-300 overflow-y-auto transition-all duration-300">
      <div className="flex items-center justify-between px-4 border-b py-[18px]">
        <h2 className="text-lg font-semibold text-gray-800">Thông tin cuộc trò chuyện</h2>
        <button
          onClick={setInfoChat}
          className="text-gray-500 transition hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>

        </button>
      </div>

      <div className="flex flex-col items-center p-4 text-center">
        <img
          className="object-cover w-20 h-20 mb-2 rounded-full"
          src={
            currentChat.group
              ? `${BASE_API_URL}/uploads/${currentChat.chatImage}`
              : auth.reqUser?.id === currentChat.users[0]?.id
                ? currentChat.users[1]?.profilePicture
                : currentChat.users[0]?.profilePicture
          }
          alt="avatar"
        />
        <h3 className="text-xl font-medium text-gray-900">
          {currentChat.group
            ? currentChat.chatName
            : auth.reqUser?.id === currentChat.users[0]?.id
              ? currentChat.users[1]?.fullname
              : currentChat.users[0]?.fullname}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {currentChat.group ? "Nhóm trò chuyện" : "Đối thoại cá nhân"}
        </p>
      </div>

      {/* Danh sách thành viên nếu là nhóm */}
      {currentChat.group && (
        <div className="px-4 py-2">
          <h4 className="mb-2 text-sm font-semibold text-gray-700">Thành viên</h4>
          <ul className="space-y-2">
            {currentChat.users.map((user) => (
              <li key={user.id} className="flex items-center space-x-2">
                <img
                  className="object-cover w-8 h-8 rounded-full"
                  src={user.profilePicture}
                  alt={user.fullname}
                />
                <span className="text-sm text-gray-800">{user.fullname}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Các nút tùy chọn */}
      <div className="px-4 py-4 mt-auto border-t">
        {currentChat.group && (
          <button className="block w-full mb-2 text-sm text-left text-indigo-600 hover:underline">
            ➕ Thêm thành viên
          </button>
        )}
        <button className="block w-full text-sm text-left text-purple-800 hover:underline">
          🗑️ Xóa cuộc trò chuyện
        </button>

        <button className="flex w-full mt-2 text-sm text-left text-red-600 hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          Hủy kết bạn
        </button>
      </div>
    </div>
  )
}

export default ChatInfo