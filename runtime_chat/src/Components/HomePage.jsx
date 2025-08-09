import React, { use, useDebugValue, useEffect, useRef } from "react";
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
import ChatInfo from "./ChatCard/ChatInfo";
import { getAllChatFinal } from "../Redux/Chat/Action";
import MessageCardAi from "./MessageCard/MessageCardAi";
import { chatWithAi } from "../Redux/Chat/Action";
import { getImageAspectType } from "../utils/CheckSizeImage";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bottomRef = useRef(null);

  const [infoChat, setInfoChat] = useState(false);
  const [querys, setQuerys] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [content, setContent] = useState("");
  const [isProfile, setisProfile] = useState(false);
  const [isAlChat, setIsAiChat] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isgroup, setIsGroup] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  const auth = useSelector((state) => state.auth);
  const chat = useSelector((state) => state.chat);
  const message = useSelector((state) => state.message);

  const token = localStorage.getItem("token");
  const open = Boolean(anchorEl);

  const [messagesSocketSendIndividual, setmessagesSocketSendIndividual] = useState([]);
  const [messagesSocketSendGroup, setmessagesSocketSendGroup] = useState([]);
  const [messagesSocketReceiveIndividual, setmessagesSocketReceiveIndividual] = useState([]);
  const [messagesSocketReceiveGroup, setmessagesSocketReceiveGroup] = useState([]);
  const [allMessageSocket, setAllMessageSocket] = useState([]);
  const [FinalChats, setFinalChats] = useState([]);

  /*- Lưu trữ tin nhắn để hiển thị -*/
  const [AllAiChat, setAllAiChat] = useState([]);


  console.log("Dannh sach chat nguoi dung tham gia : ", chat.chats);






  useEffect(() => {
    if (messagesSocketSendIndividual.length === 0) return;

    const latest = messagesSocketSendIndividual[messagesSocketSendIndividual.length - 1];
    setAllMessageSocket(prev => [...prev, latest]);
  }, [messagesSocketSendIndividual]);

  useEffect(() => {
    if (messagesSocketSendGroup.length === 0) return;

    const latest = messagesSocketSendGroup[messagesSocketSendGroup.length - 1];
    setAllMessageSocket(prev => [...prev, latest]);
  }, [messagesSocketSendGroup]);


  useEffect(() => {
    if (messagesSocketReceiveIndividual.length === 0) return;

    const latest = messagesSocketReceiveIndividual[messagesSocketReceiveIndividual.length - 1];
    setAllMessageSocket(prev => [...prev, latest]);
  }, [messagesSocketReceiveIndividual]);

  useEffect(() => {
    if (messagesSocketReceiveGroup.length === 0) return;

    const latest = messagesSocketReceiveGroup[messagesSocketReceiveGroup.length - 1];
    setAllMessageSocket(prev => [...prev, latest]);
  }, [messagesSocketReceiveGroup]);




  useEffect(() => {

    setAllMessageSocket(message.messages);
  }, [message.messages]);


  useEffect(() => {
    if (token && token !== "undefined" && token !== "null") {
      dispatch(getAllChatFinal(token));
    }
    else {
      console.warn("Token không hợp lệ khi gọi API getAllChatFinal");
    }

  }, [token, allMessageSocket]);

  useEffect(() => {
    setFinalChats(chat.FinalChats);
  }, [chat.FinalChats])
  console.log("Danh sach tin nhan cuoi cung : ", FinalChats);


  useEffect(() => {
    setFinalChats(chat.FinalChats);
  }, [allMessageSocket]);



  const connectWebSocket = (token) => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => console.log("[STOMP]", str),
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log("✅ Connected:", frame);


        client.subscribe("/user/queue/messages", (msg) => {
          try {
            const messageData = JSON.parse(msg.body);
            console.log("Nhận tin nhắn:", messageData);
            setmessagesSocketReceiveIndividual(prev => [...prev, messageData]);
          } catch (error) {
            console.error("Lỗi khi parse tin nhắn:", error);
          }
        });

        chat.chats
          .filter(chat => chat.group)
          .forEach(groupChat => {
            client.subscribe(`/group/${groupChat.id}`, (msg) => {
              try {
                const messageData = JSON.parse(msg.body);
                console.log("Tin nhắn nhóm:", messageData);
                setmessagesSocketReceiveGroup(prev => [...prev, messageData]);
              } catch (error) {
                console.error("Lỗi parse nhóm:", error);
              }
            });
          });
        setStompClient(client);
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers['message']);
        console.error("Chi tiết:", frame.body);
      },
      onWebSocketClose: (event) => {
        console.warn("WebSocket bị đóng:", event.reason || event);
      },
      onDisconnect: () => {
        console.warn("WebSocket đã bị ngắt kết nối");
      }
    });
    client.activate();
  }

  useEffect(() => {
    console.log("🔁 useEffect chạy");
    if (token && token !== "undefined" && token !== "null") {
      connectWebSocket(token);
    }
  }, []);



  



  const handleCreateNewMessage = () => {
    if (!stompClient || !currentChat) return;

    const messageData = {
      content: content.trim(),
      user: auth.reqUser,
      timestamp: new Date().toISOString(),
      chat: currentChat,
    };
    const destination = currentChat.group
      ? "/app/group.message"
      : "/app/private.message";


    stompClient.publish({
      destination: destination,
      body: JSON.stringify(messageData)
    });
    dispatch(createMessage({
      token: token,
      data: {
        chatId: currentChat.id,
        content: content
      }
    }));
    if (currentChat.group) {
      setmessagesSocketSendGroup(prev => [...prev, messageData]);
    }
    else {
      setmessagesSocketSendIndividual(prev => [...prev, messageData]);
    }

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    setContent("");
  };


  const handleSearch = (keyword) => {
    dispatch(searchUser({ keyword, token }));
  };

  const handleNavigate = () => setisProfile(true);
  const handleOpenCloseProfile = () => setisProfile(false);
  const handleClose = () => setAnchorEl(null);
  const handleClickMenuMore = (event) => setAnchorEl(event.currentTarget);

  const ReturnHome = () => {
    setisProfile(false);
    setIsGroup(false);
    setAnchorEl(null);
  };

  const disconnectWebSocket = () => {
    if (stompClient && stompClient.connected) {
      stompClient.deactivate();
      console.log("🛑 WebSocket disconnected");
    }
  };

  const handleLogout = () => {
    disconnectWebSocket();
    dispatch(logoutAction());
    toast.success("Đăng xuất thành công");
    navigate("/signin");
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

  useEffect(() => {
    dispatch(getUserChat({ token }));
  }, [chat.createGroup, chat.createChat]);

  const handleCreateGroup = () => setIsGroup(true);

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


  const handleClickOnChatCart = (userId) => {
    dispatch(createChat({
      token, data: { userId }, onSuccess: (chatData) => {
        setCurrentChat(chatData);
      }
    }));
    setIsAiChat(!isAlChat);

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    setContent("");
  };

  const handleCurrentChat = (item) => {
    setIsAiChat(false);
    setCurrentChat(item);
    console.log("Current chat:", item);
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };


  useEffect(() => {
    if (currentChat?.id) {
      console.log("Current chat :", currentChat);
      dispatch(
        getAllMessage({
          chatId: currentChat.id,
          token: token,
        })
      );
    }
  }, [currentChat, message.newMessage]);

  const showInfoChat = () => {
    setInfoChat(!infoChat);
  }


  console.log("ALL CHAT : ", chat.chats);
  console.log("Nguoi dung hien tai : ", auth.reqUser);
  console.log(" Danh sach tim kiem : ", auth.searchUser)


  const [formMessage, setFormMessage] = React.useState({
    content: "",
    audio: null,
    image: null,
    file: null,
  });

  /*- gửi ghi âm bằng lời nói của cá nhân -*/
  const [previewUrlAudio, setPreviewUrlAudio] = useState(null);

  const [previewUrlImage, setPreviewUrlImage] = useState(null);
  const [aspectType, setAspectType] = useState(null);


  const [previewUrlFile, setPreviewUrlFile] = useState(null);


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormMessage((prev) => ({ ...prev, image: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrlImage(previewUrl);

      getImageAspectType(previewUrl)
        .then(type => {
          setAspectType(type);
          
        })
        .catch(err => {
          console.error("Không đọc được ảnh:", err);
        });
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormMessage((prev) => ({ ...prev, audio: file }));
      setPreviewUrlAudio(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormMessage((prev) => ({ ...prev, file: file }));
      setPreviewUrlFile(file.name);
    }
  };

  const removeImage = () => {
    setFormMessage((prev) => ({ ...prev, image: null }));
    setPreviewUrlImage(null);
  };

  const removeAudio = () => {
    setFormMessage((prev) => ({ ...prev, audio: null }));
    setPreviewUrlAudio(null);
  };

  const removeFile = () => {
    setFormMessage((prev) => ({ ...prev, file: null }));
    setPreviewUrlFile(null);
  };



  const handleCreateOnMessageAi = () => {
    if (
      !formMessage.content &&
      !formMessage.audio &&
      !formMessage.image &&
      !formMessage.file
    ) {
      return;
    }

    const formData = new FormData();
    if (formMessage.content) {
      formData.append("sendMessage", formMessage.content);
    }
    if (formMessage.audio instanceof File) {
      formData.append("audio", formMessage.audio);
    }
    if (formMessage.image instanceof File) {
      formData.append("image", formMessage.image);
    }
    if (formMessage.file instanceof File) {
      formData.append("file", formMessage.file);
    }

    // Gửi dạng string để Spring parse được
    formData.append("temperature", "0.7");
    formData.append("maxTokens", "500");

    setAllAiChat((prev) => [
      ...prev,
      {
        isRequest: false,
        content: formMessage.content,
        audio: formMessage.audio,
        image: previewUrlImage,
        file: formMessage.file,
      },
    ]);

    setFormMessage({ content: "", audio: null, image: null, file: null });
    setPreviewUrlAudio(null);
    setPreviewUrlImage(null);
    setPreviewUrlFile(null);
    dispatch(
      chatWithAi(
        formData,

        (resData) => {
          setAllAiChat((prev) => [
            ...prev,
            { isRequest: true, ...resData },
          ]);


        },
        (err) => {
          console.error("Gửi AI thất bại:", err);
        }
      )
    );

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };
  console.log("Tất cả tin nhắn gửi cho AI : ", AllAiChat)




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
                          ? auth.reqUser?.profilePicture
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


                  <button className="cursor-pointer" onClick={() => {
                    setIsAiChat(!isAlChat)
                  }

                  }>

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
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
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
                  filteredUsers.map((item) => {

                    return (
                      <div key={item.id} onClick={() => handleClickOnChatCart(item.id)}>
                        <hr />
                        <ChatCard
                          user={auth.reqUser.fullname}
                          name={item.fullname}
                          userImage={
                            item.profilePicture
                              ? item.profilePicture
                              : "https://i.pinimg.com/736x/81/4f/75/814f75414eda6651e2db3ee9a4e5efcf.jpg"
                          }
                        />
                      </div>
                    );
                  })
                ) : (
                  <div>
                    <h2 className="text-center font-extralight">Không có kết quả</h2>
                  </div>
                );
              })()}

              {/* Danh sách bạn bè  */}
              {chat.chats.length > 0 &&
                !querys &&
                chat.chats?.map((item) => (
                  <div key={item.id} onClick={() => handleCurrentChat(item)}>
                    {" "}
                    <hr />
                    {/* CHAT NHÓM */}
                    {item.group ? (
                      <ChatCard
                        tin_nhan_cuoi_cung={FinalChats?.find(itemx => itemx?.chat_id === item.id) || null}
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
                        tin_nhan_cuoi_cung={FinalChats?.find(itemx => itemx?.chat_id === item.id) || null}
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






        {/* Chat voi ai */}
        {isAlChat && (
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

            {/* Phần viết tin nhắn giữa AI và Người */}
            <div className={`px-10 h-[91vh] overflow-y-scroll pt-2 pb-15 ${infoChat ? "pr-[400px]" : ""}`}>

              <div className="flex flex-col justify-center py-2 mt-20 space-y-1 ">
                <MessageCard
                  key="ai_initial"
                  isReqMessage={true}
                  content={"Chào bạn! Tôi là AI Chat. Bạn cần giúp gì hôm nay?"}
                  isTyping={true}
                />
              </div>

              {/* Phần viết al giữa người dùng */}
              <div className="flex flex-col">
                {AllAiChat.map((msg, index) => (
                  <MessageCardAi
                    key={index}
                    isRequest={msg.isRequest}
                    content={msg.content}
                    response={msg.response}
                    image={msg.image}
                    audio={msg.audio}
                    file={msg.file}
                  />
                ))}
              </div>
              <div ref={bottomRef} />
            </div>




            {/* Phần soạn tin nhắn giữa Ai và Người */}
            <div className={`absolute w-full py-2 text-base bg-gray-400 footer bottom-0 ${infoChat ? "pr-[380px]" : ""}`}>
              <div className="flex flex-wrap gap-4 mb-5 ml-3">

                {/* Preview Image */}
                {previewUrlImage && (
                  <div className="relative overflow-hidden border border-gray-200 rounded-lg shadow-md">
                    <img
                      src={previewUrlImage}
                      alt="Preview"
                      className={
                        "z-0 " + 
                        (
                          aspectType === "HORIZONTAL"
                            ? "w-[120px] h-[70px]"
                            : aspectType === "VERTICAL"
                              ? "w-[70px] h-[120px]"
                              : aspectType === "SQUARE"
                                ? "w-[70px] h-[70px]"
                                : "w-[120px] h-[70px]"
                        )
                      }
                    />

                    <button
                      onClick={removeImage}
                      className="flex justify-center items-center absolute bg-amber-500 z-[10] w-4 h-4 top-0 right-0 rounded-full"
                      type="button"
                    >
                      &times;
                    </button>
                  </div>


                )}


                {/* Preview Audio */}
                {previewUrlAudio && (
                  <div className="relative flex items-center justify-center p-3 bg-white border border-gray-200 rounded-lg shadow-md">
                    <audio controls src={previewUrlAudio} className="w-[200px] h-10" />
                    <button
                      onClick={removeAudio}
                      className="absolute flex items-center justify-center w-5 h-5 text-xs text-white transition bg-red-500 rounded-full shadow -top-2 -right-2 hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                )}

                {/* Preview File */}
                {previewUrlFile && (
                  <div className="relative flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg shadow-md">
                    <span className="text-2xl">📄</span>
                    <span className="truncate max-w-[150px] text-sm font-medium text-gray-700">
                      {previewUrlFile}
                    </span>
                    <button
                      onClick={removeFile}
                      className="absolute flex items-center justify-center w-5 h-5 text-xs text-white transition bg-red-500 rounded-full shadow -top-2 -right-2 hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                )}

              </div>


              <div className="flex items-center justify-between gap-2 px-4">
                {/* Preview */}

                <div className="flex gap-2 mt-1">
                  {/* Nút chọn file */}
                  <label>
                    <input type="file" onChange={handleFileChange} hidden />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white cursor-pointer size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                    </svg>
                  </label>

                  {/* Nút chọn audio */}
                  <label>
                    <input type="file" accept="audio/*" onChange={handleAudioChange} hidden />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white cursor-pointer size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                    </svg>
                  </label>

                  {/* Nút chọn ảnh */}
                  <label>
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white cursor-pointer size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </label>
                </div>

                {/* Ô nhập text */}
                <input
                  className="py-1.5 pl-3 bg-white border border-gray-200 rounded-md outline-none w-full text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
                  type="text"
                  onChange={(e) => setFormMessage((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Type a message"
                  value={formMessage.content}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleCreateOnMessageAi();
                    }
                  }}
                />

                {/* Nút gửi */}
                <button onClick={handleCreateOnMessageAi}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-white size-5 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.25l13.5 6.75-13.5 6.75V5.25z" />
                  </svg>
                </button>
              </div>


            </div>


          </div>
        )}

        {/* Page trò chuyện khi nhấn vào một người dùng  */}
        {!currentChat && !isAlChat && (
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
        {currentChat && !isAlChat && (
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

                      auth.reqUser?.id === currentChat.users[0]?.id ? currentChat.users[1]?.profilePicture : currentChat.users[0]?.profilePicture
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
                <button className="cursor-pointer" onClick={showInfoChat

                }>
                  <img
                    src="src/assets/icon/more.png"
                    className="w-7 h-7"
                    alt="more"
                  />
                </button>
              </div>
            </div>

            {infoChat && (
              <ChatInfo currentChat={currentChat} auth={auth} setInfoChat={() => setInfoChat(false)} />
            )}


            {/* Phần viết tin nhắn giữa hai người */}
            <div className={`px-10 h-[91vh] overflow-y-scroll pt-2 pb-15 ${infoChat ? "pr-[400px]" : ""}`}>

              <div className="flex flex-col justify-center py-2 mt-20 space-y-1 ">
                {allMessageSocket
                  .filter((item) => item.chat?.id === currentChat?.id)
                  .map((item) => (
                    <MessageCard

                      key={item.timestamp}
                      isReqMessage={item.user?.id !== auth.reqUser.id}
                      content={item.content}
                      isTemp={item.isTemp}

                    />
                  ))}

              </div>
              <div ref={bottomRef} />
            </div>

            {/* Phần soạn tin nhắn giữa hai người */}
            <div className={`absolute w-full py-2 text-base bg-gray-400 footer bottom-0 ${infoChat ? "pr-[380px]" : ""}`}>
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
                <button

                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200">
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
    </div >
  );
};

export default HomePage;
