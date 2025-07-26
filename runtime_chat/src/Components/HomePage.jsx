import React, { useEffect, useRef } from "react";
import ChatCard from "./ChatCard/ChatCard";
import { useState } from "react";
import MessageCard from "./MessageCard/MessageCard";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile/Profile";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CreateGroup from "./Group/CreateGroup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { currentUser, logoutAction, searchUser } from "../Redux/Auth/Action";
import "react-toastify/dist/ReactToastify.css";
import { createChat, getUserChat } from "../Redux/Chat/Action";
import WelcomeProfileSetup from "./Profile/WelcomeProfileSetup";
import { BASE_API_URL } from "../config/Api";
import { createMessage, getAllMessage } from "../Redux/Message/Action";
import EmojiPicker from "emoji-picker-react";
import { Client } from "@stomp/stompjs";


const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const clientRef = useRef(null);

  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);

  /* - Nội dung tin nhắn -*/
  const [content, setContent] = useState("");

  const [isProfile, setisProfile] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const open = Boolean(anchorEl);
  const { auth, chat, message } = useSelector((state) => state);
  const token = localStorage.getItem("token");
  /*- hiển thị icon  -*/
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  /* - hiển thị group true  thì hiển thị , còn false thì không hiển thị */
  const [isgroup, setIsGroup] = useState(false);


  const [isConnect, setIsConnect] = useState(false);
  const [messagesSocket, setMessagesSocket] = useState([]);
  

  const connectWebSocket = () => {
    if (!token || token.trim() === "") {
      console.error("Không có token hợp lệ, không kết nối WebSocket");
      return;
    }
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    client.onConnect = (frame) => {
      console.log('WebSocket Connected!');
      setIsConnect(true)

    };

    client.onStompError = (frame) => {
      console.error('WebSocket Error:', frame.headers.message);
      setIsConnect(false);
    };

    client.activate();
    clientRef.current = client;
  };


  useEffect(() => {
    if (!token || token === "undefined" || token === "null") {
      console.warn("Token không hợp lệ. Không gọi connectWebSocket.");
      return;
    }
    connectWebSocket();
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);


  const disconnectWebSocket = () => {
    if (clientRef.current) {
      console.log('Manually disconnecting WebSocket...');
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnect(false);
    }
  };



  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };
  const handleNavigate = () => {
    setisProfile(true);
  };
  const handleOpenCloseProfile = () => {
    setisProfile(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickMenuMore = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const ReturnHome = () => {
    setisProfile(false);
    setIsGroup(false);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    disconnectWebSocket();
    dispatch(logoutAction());
    toast.success("logout thành công");
    navigate("/signin");

  };

  /*- Hiển thị ra chatCart hiện tại -*/
  const handleClickOnChatCart = (userId) => {
    dispatch(createChat({ token, data: { userId } }));
  };

  useEffect(() => {
    const isNewUser = localStorage.getItem("newlyRegistered");
    if (
      isNewUser === "true" &&
      auth.reqUser &&
      (!auth.reqUser.profilePicture || !auth.reqUser.birthday)
    ) {
      setTimeout(() => {
        setShowWelcome(true);
      }, 3000);
    }
  }, [auth.reqUser]);

  /*- Lấy ra danh sách các  đoạn chat mà người dùng tham gia -*/
  useEffect(() => {
    dispatch(getUserChat({ token }));
  }, [chat.createGroup, chat.createChat]);



  const handleCreateGroup = () => {
    setIsGroup(true);
  };

  const handleUpdateInfoUser = () => {
    setShowWelcome(false);
    localStorage.removeItem("newlyRegistered");
  };

  useEffect(() => {
    if (!token || token === "undefined" || token === "null") {
      console.warn("❌ Token không hợp lệ. Không gọi connectWebSocket.");
      return;
    }
    dispatch(currentUser(token));
  }, [token]);

  useEffect(() => {
    if (!auth.reqUser) {
      navigate("/signin");
    }
  }, [auth.reqUser]);


  const handleCurrentChat = (item) => {
    setCurrentChat(item);
  }


  /*- Tạo tin nhắn, chạy khi nhấn enter -*/
  const handleCreateNewMessage = () => {
    if (!currentChat || !content.trim()) return;
    dispatch(createMessage({
      token: token,
      data: {
        chatId: currentChat.id,
        content: content
      }
    }));
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    setContent("");

  };

  useEffect(() => {
    if (currentChat?.id) {
      console.log("Current chat : ", currentChat)

      dispatch(getAllMessage({

        chatId: currentChat.id,
        token: token,
      }));
    }
  }, [currentChat, message.newMessage])



  return (
    <div className="relative bg-blue-200 ">
      <div className="top-0 w-full shadow-md py-14 animate-color-change"> </div>
      <div className="w-full shadow-md mt-122 py-14 animate-color-change -z-20 ">
        {" "}
      </div>

      {showWelcome && (
        <WelcomeProfileSetup
          handleUpdateInfoUser={handleUpdateInfoUser}
          onFinish={() => {
            setShowWelcome(false);
            dispatch(currentUser(token));
          }}
        />
      )}

      <div className="flex bg-[#e1e1e1] h-[96vh] absolute top-6 left-6 right-6 ">
        <div className="left w-[30%] bg-[#c9c9cc] h-full   ">
          {isProfile && (
            <div className="w-full h-full">
              {" "}
              <Profile
                handleOpenCloseProfile={handleOpenCloseProfile}
                user={auth.reqUser}
              />
            </div>
          )}

          {!isProfile && !isgroup && (
            /* Thanh giao diện phía trên cùng của người dùng */
            <div className=" flex items-center justify-between w-full px-1 py-1.5 bg-gradient-to-r from-gray-600 to-gray-800  ">
              {/* */}
              <div className="flex items-center justify-between gap-33">
                <div
                  onClick={handleNavigate}
                  className="flex items-center justify-start "
                >
                  <div className="w-10 h-10 m-2 overflow-hidden rounded-full">
                    <img
                      className="object-cover object-center w-full h-full"
                      src={
                        auth.reqUser?.profilePicture
                          ? `${BASE_API_URL}/uploads/${auth.reqUser.profilePicture}`
                          : "https://i.pinimg.com/736x/81/4f/75/814f75414eda6651e2db3ee9a4e5efcf.jpg"
                      }
                      alt="Profile Picture"
                    />
                  </div>
                  <p className="font-bold text-white whitespace-nowrap appearance-auto w-30">
                    {auth.reqUser ? auth.reqUser.fullname : ""}
                  </p>
                </div>


                <div className="flex items-center gap-3.5 ">
                  <button className="cursor-pointer" onClick={() => {
                    return navigate("/status");
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-white size-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>

                  </button>


                  <button className="cursor-pointer">
                    {" "}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-white size-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>

                  </button>


                  <div>
                    <button
                      className="cursor-pointer"
                      id="basic-button"
                      aria-controls={open ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClickMenuMore}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-white size-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>

                    </button>

                    <div>
                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                          list: {
                            "aria-labelledby": "basic-button",
                          },
                        }}
                      >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleCreateGroup}>
                          Create Group
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {isgroup && <CreateGroup ReturnHome={ReturnHome} />}

          {/* Thanh tìm kiếm bạn bè  */}
          {!isProfile && !isgroup && (
            <div className="relative flex items-center justify-between gap-2 px-3 py-4 bg-white">
              <input
                className="border-none rounded-md outline-none bg-slate-200 w-[93%] px-9 py-2"
                type="text"
                placeholder="   Search or state new chat..."
                value={querys}
                onChange={(e) => {
                  setQuerys(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              <img
                className="absolute w-6 h-6 top-6 left-5"
                src="/src/assets/icon/search.png"
              ></img>
              <button>
                {" "}
                <img
                  className="h-7 w-7"
                  src="/src/assets/icon/filter.png"
                />{" "}
              </button>
            </div>
          )}

          {/* Danh sách người dùng sau khi tìm kiếm */}
          {!isProfile && !isgroup && (
            <div className="overflow-y-scroll bg-white h-[75vh] px-4">
              {querys && (() => {
                const filteredUsers = Array.isArray(auth.searchUser)
                  ? auth.searchUser.filter((item) => item.id !== auth.reqUser?.id)
                  : [];

                return filteredUsers.length > 0 ? (
                  filteredUsers.map((item) => (
                    <div key={item.id} onClick={() => handleClickOnChatCart(item.id)}>
                      <hr />
                      <ChatCard
                        name={item.fullname}
                        userImage={
                          item.profilePicture ||
                          "https://i.pinimg.com/736x/81/4f/75/814f75414eda6651e2db3ee9a4e5efcf.jpg"
                        }
                      />
                    </div>
                  ))
                ) : (
                  <div>
                    <h2 className="text-center font-extralight">Không có kết quả</h2>
                  </div>
                );
              })()}


              {/* const ChatCard = ({ name, userImage}) */}
              {/* Lay ra ca doan chat nhom nua */}
              {chat.chats.length > 0 &&
                !querys &&
                chat.chats?.map((item) => (
                  <div key={item.id} onClick={() => handleCurrentChat(item)}>
                    {" "}
                    <hr />

                    {/* CHAT NHÓM */}
                    {item.group ? (
                      <ChatCard
                        isChat={true}
                        name={
                          item.chatName

                        }
                        userImage={
                          item.chatImage
                        }
                      />

                    ) : (
                      // CHAT CA NHAN
                      <ChatCard
                        name={
                          auth.reqUser?.id === item.users[0]?.id ? item.users[1]?.fullname : item.users[0]?.fullname
                        }
                        userImage={
                          auth.reqUser?.id === item.users[0]?.id ? item.users[1]?.profilePicture : item.users[0]?.profilePicture
                        }
                      />
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Page trò chuyện khi nhấn vào một người dùng  */}
        {!currentChat && (
          <div className="flex items-center justify-center h-full mr-6 right">
            <div className="w-[70%] text-center">
              <img
                className="mx-auto mb-4"
                src="/src/assets/images/bg.png"
                alt=""
              />
              <h1 className="text-4xl text-gray-500">
                PROJECT CHAT APP ONLINE
              </h1>
              <p className="my-9">
                Kết nối mọi người mọi lúc, mọi nơi – trò chuyện không giới hạn,
                ngay trong tầm tay bạn. Trò chuyện an toàn, tốc độ tức thì nơi
                cảm xúc được sẻ chia liền mạch.
              </p>
            </div>
          </div>
        )}

        {/* Header của người bạn */}
        {currentChat && (
          <div className="w-[70%] relative ">

            {/* Nút mở emoji picker */}
            {showEmojiPicker && (

              <div className="absolute z-[9999] top-37 left-7 w-10 h-10">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setContent((prev) => prev + emojiData.emoji);
                  }}
                />
              </div>
            )}
            {/* Phân bên trên của đoạn tin nhắn  */}
            <div className="absolute z-[9999] top-0 flex items-center justify-between w-full px-6 py-1 bg-slate-300 header h-17 ">
              {/* Bên trái: Avatar và tên */}
              <div className="flex items-center space-x-4">
                <img
                  className="w-10 h-10 rounded-full"
                  src={

                    currentChat.group ? (
                      `${BASE_API_URL}/uploads/${currentChat.chatImage}`

                    ) : (

                      auth.reqUser?.id === currentChat.users[0]?.id ? `${BASE_API_URL}/uploads/${currentChat.users[1]?.profilePicture}` : `${BASE_API_URL}/uploads/${currentChat.users[0]?.profilePicture}`
                    )

                  }
                  alt=""
                />
                <p className="font-medium">
                  {
                    currentChat.group ? (
                      currentChat.chatName
                    ) : (

                      auth.reqUser?.id === currentChat.users[0]?.id ? currentChat.users[1]?.fullname : currentChat.users[0]?.fullname
                    )
                  }

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
                <button className="cursor-pointer">
                  <img
                    src="src/assets/icon/more.png"
                    className="w-7 h-7"
                    alt="more"
                  />
                </button>
              </div>
            </div>

            {/* Phần viết tin nhắn giữa hai người */}
            <div className="px-10 h-[91vh] overflow-y-scroll pt-2 pb-15">
              <div className="flex flex-col justify-center py-2 mt-20 space-y-1 ">
                {message.messages?.map((item, i) => (
                  <MessageCard key={i} isReqMessage={item.user.id !== auth.reqUser.id} content={item.content} />
                ))}

              </div>
              <div ref={bottomRef} />
            </div>

            {/* Phần soạn tin nhắn giữa hai người */}
            <div className="absolute w-full py-2 text-base bg-gray-100 footer bottom-1">
              <div className="flex items-center justify-between gap-2 px-4">
                <div className="flex items-center justify-center gap-1.5">

                  {/* Nút icon   */}
                  <button onClick={() => {

                    return setShowEmojiPicker(!showEmojiPicker)

                  }} className="p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="text-gray-600 size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                      />
                    </svg>
                  </button>

                  {/* Nút tệp đính kèm  */}
                  <button className="p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="text-gray-600 size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                      />
                    </svg>
                  </button>
                </div>
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
                {/* Nút ghi âm gửi âm thanh  */}
                <button className="p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="text-gray-600 size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;
