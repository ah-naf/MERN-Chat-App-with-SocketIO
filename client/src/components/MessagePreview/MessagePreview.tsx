import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { CoversationType } from "../../utils/type";
import moment from "moment";
import { asyncSingleChatGet, resetSent } from "../../store/chatSlice";

export default function MessagePreview({ chat }: PropsType) {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [otherUser, setOtherUser] = useState({
    _id: "",
    name: "",
    profilePic: "",
    username: "",
  });

  useEffect(() => {
    const temp = chat.users.filter((item) => item._id !== user._id);
    setOtherUser(temp[0]);
  }, [user, chat]);

  const handleClick = () => {
    dispatch(asyncSingleChatGet(chat._id) as any);
    dispatch(resetSent() as any)
  };

  return (
    <div
      className="cursor-pointer group hover:bg-primary p-2 rounded-md mt-1 transition-all duration-200"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-2">
        {!chat.isGroupChat && otherUser.profilePic ? (
          <img
            src={otherUser.profilePic}
            alt=""
            className="rounded-full w-12 h-12 object-cover object-center"
          />
        ) : (
          <span className="rounded-full w-12 h-12 bg-neutral text-white font-bold grid place-items-center text-xl capitalize">
            {chat.isGroupChat ? chat.chatName[0] : otherUser.name[0]}
          </span>
        )}
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h1 className="text-sm flex-grow font-bold capitalize">
              {chat.isGroupChat ? chat.chatName : otherUser.name}
            </h1>
            <p className="text-xs text-gray-400 group-hover:text-gray-300 ">
              {moment(new Date(chat.updatedAt as string), "YYYYMMDD").fromNow()}
            </p>
          </div>
          {chat.latestMessage?.content && (
            <p className="text-xs text-gray-500 group-hover:text-gray-100">
              {chat.latestMessage.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface PropsType {
  chat: CoversationType;
}
