import React, { useEffect, useRef, useState } from "react";
import { FiSend, FiVideo } from "react-icons/fi";
import { IoCallOutline, IoImagesOutline } from "react-icons/io5";
import { CgMoreO } from "react-icons/cg";
import { GrMicrophone } from "react-icons/gr";
import Message from "../Message/Message";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { asyncChat, asyncMessageSend, asyncSingleChatGet, setMessages, toggleSidebar } from "../../store/chatSlice";
import { MessageType } from "../../utils/type";

export default function Middleside() {
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<MessageType[]>([]);
  const messageDiv = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const sent = useSelector((state: RootState) => state.chat.sent);
  const curConversation = useSelector(
    (state: RootState) => state.chat.currentCoversation
  );
  const currentMessages = useSelector(
    (state: RootState) => state.chat.curMessages
  );

  const [otherUser, setOtherUser] = useState({
    _id: "",
    name: "",
    profilePic: "",
    username: "",
  });

  useEffect(() => {
    setAllMessages(currentMessages);
    if (messageDiv.current) {
      messageDiv.current.scrollTop = messageDiv.current.scrollHeight - 500;
    }
  }, [currentMessages]);

  useEffect(() => {
    if (!socket && curConversation) {
      setSocket(io("http://localhost:5000"));
    }
    if (socket) {
      socket.emit("join-room", curConversation?._id);
      socket.on("get-message", (msg, id) => {
        const tempMSG = [...allMessages, msg]
        if (messageDiv.current) {
          messageDiv.current.scrollTop = messageDiv.current.scrollHeight - 500;
        }
        setAllMessages(tempMSG)
        dispatch(setMessages(tempMSG) as any)
        dispatch(asyncSingleChatGet(id) as any)
        dispatch(asyncChat() as any)
      });
    }

  }, [socket, curConversation]);

  useEffect(() => {
    if (curConversation) {
      const tempUser = curConversation.users.filter(
        (item) => item._id !== user._id
      );
      setOtherUser(tempUser[0]);
      if (messageDiv.current) {
        messageDiv.current.scrollTop = messageDiv.current.scrollHeight - 500;
      }
    }
  }, [user, curConversation]);

  const openSidebar = () => {
    dispatch(toggleSidebar(true) as any);
  };

  const handleMessageSend = () => {
    dispatch(
      asyncMessageSend({
        content: message,
        chatId: curConversation?._id as string,
      }) as any
    );
  };

  useEffect(() => {
    if (sent && socket) {
      socket.emit("send-message", sent, curConversation?._id);
      setMessage("");
      if (messageDiv.current) {
        messageDiv.current.scrollTop = messageDiv.current.scrollHeight - 500;
      }
      dispatch(asyncChat() as any)
    }
  }, [sent, socket]);

  return (
    <div className="flex-grow flex flex-col bg-[whitesmoke] overflow-hidden">
      {curConversation ? (
        <>
          <div className="flex items-center p-4 bg-white sticky top-0 shadow-sm border-b">
            <div className="flex items-center flex-grow">
              {!curConversation?.isGroupChat && otherUser.profilePic ? (
                <img
                  src={otherUser.profilePic}
                  alt=""
                  className="rounded-full w-16 h-16 object-cover object-center"
                />
              ) : (
                <span className="rounded-full w-16 h-16 bg-neutral text-white font-bold grid place-items-center text-2xl capitalize">
                  {curConversation?.isGroupChat
                    ? curConversation?.chatName[0]
                    : otherUser.name[0]}
                </span>
              )}
              <h1 className="text-black font-bold text-xl ml-2 flex flex-col">
                <span>
                  {curConversation?.isGroupChat
                    ? curConversation?.chatName
                    : otherUser.name}
                </span>
                {!curConversation?.isGroupChat && (
                  <span className="text-sm text-gray-500">
                    @{otherUser.username}
                  </span>
                )}
              </h1>
            </div>
            <div className="flex items-center space-x-4 text-gray-500 text-lg">
              <FiVideo className="cursor-pointer" />
              <IoCallOutline className="cursor-pointer" />
              <CgMoreO className="cursor-pointer" onClick={openSidebar} />
            </div>
          </div>

          {/* Middle Section */}
          <div className="flex-grow overflow-y-auto" ref={messageDiv}>
            <div>
              {allMessages.map((message, index) => (
                <Message
                  key={index}
                  own={user._id === message.sender._id}
                  message={message}
                />
              ))}
            </div>
          </div>

          <div className="bg-white px-4 xl:px-12 py-4">
            <div className="flex items-center bg-gray-200 rounded-lg px-4 py-4">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") handleMessageSend();
                }}
                type="text"
                placeholder="Your message"
                className="outline-none border-none flex-grow bg-transparent text-gray-700"
              />
              <div className="text-black font-bold flex items-center text-xl space-x-4">
                <GrMicrophone className="cursor-pointer text-sm" />
                <IoImagesOutline className="cursor-pointer text-sm" />
                <FiSend
                  className="cursor-pointer text-primary ml-2"
                  onClick={handleMessageSend}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full text-3xl font-bold text-black h-full grid place-items-center">
          <h1>SELECT A CHAT</h1>
        </div>
      )}
    </div>
  );
}
