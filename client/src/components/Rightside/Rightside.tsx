import { useEffect, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineUsergroupDelete } from "react-icons/ai";
import { BiImage } from "react-icons/bi";
import { IoIosRemoveCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/chatSlice";
import { RootState } from "../../store/store";

export default function Rightside() {
  const dispatch = useDispatch()
  const curConversation = useSelector(
    (state: RootState) => state.chat.currentCoversation
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const openSide = useSelector((state: RootState) => state.chat.openRightSection)
  const [otherUser, setOtherUser] = useState({
    _id: "",
    name: "",
    profilePic: "",
    username: "",
  });

  useEffect(() => {
    if (curConversation) {
      const tempUser = curConversation.users.filter(
        (item) => item._id !== user._id
      );
      setOtherUser(tempUser[0]);
    }
  }, [user, curConversation]);

  const handleClose = () => {
    dispatch(toggleSidebar(!openSide) as any)
  }

  return (
    <div className={`relative ${!openSide && 'overflow-hidden'}`}>
      <div className={`absolute overflow-y-auto scrollbar-thin bg-white h-full shadow p-4 ${openSide ? "w-64 -translate-x-[100%]": "w-0 translate-x-[100%]"} transition-all duration-300 ease-in-out`}>
      <div className="flex flex-col items-center py-1 pb-2 border-b shadow-sm sticky top-0">
        <AiOutlineCloseCircle className="absolute text-black top-0 right-0 text-2xl cursor-pointer" onClick={handleClose} />
        {!curConversation?.isGroupChat && otherUser.profilePic ? (
          <img
            src={otherUser.profilePic}
            alt=""
            className="rounded-full w-12 h-12 object-cover object-center"
          />
        ) : (
          <span className="rounded-full w-12 h-12 bg-neutral text-white font-bold grid place-items-center text-xl capitalize">
            {curConversation?.isGroupChat
              ? curConversation?.chatName[0]
              : otherUser.name[0]}
          </span>
        )}
        <h1 className="text-black font-semibold text-md capitalize">
          {curConversation?.isGroupChat
            ? curConversation?.chatName
            : otherUser.name}
        </h1>
      </div>

      <div className="mt-4">
        {curConversation?.isGroupChat && (
          <div>
            <div className="flex items-center justify-between text-sm text-gray-400 font-semibold mb-2">
              <h1 className="flex items-center text-xs">
                <span className="mr-2">
                  <AiOutlineUsergroupDelete />
                </span>{" "}
                MEMBERS ({curConversation.users.length})
              </h1>
            </div>
            <div className="max-h-60 overflow-y-auto scrollbar-none">
              {curConversation.users.map((item, index) => (
                <div key={index} className="flex items-center mb-2 p-1">
                  {item.profilePic ? (
                    <img
                      src={item.profilePic}
                      className="w-8 h-8 rounded-full object-cover object-center mr-2"
                      alt=""
                    />
                  ) : (
                    <span className="rounded-full w-8 h-8 bg-neutral text-white font-bold grid place-items-center mr-2 text-sm capitalize">
                      {item.name[0]}
                    </span>
                  )}
                  <h1 className="flex-grow font-bold text-sm text-black">
                    {item.name}
                  </h1>
                  {user._id === curConversation.groupAdmin._id && (
                    <IoIosRemoveCircle className="text-red-500 text-xl cursor-pointer" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-gray-400 font-semibold">
          <h1 className="flex items-center text-xs">
            <span className="mr-2">
              <BiImage />
            </span>{" "}
            MEDIA
          </h1>
          <a href="##" className="text-primary underline">
            SEE ALL
          </a>
        </div>
      </div>
    </div>
    </div>
  );
}
