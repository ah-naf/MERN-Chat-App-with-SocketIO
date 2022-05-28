import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { MessageType } from "../../utils/type";

export default function Message({ own, message }: PropsType) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div
      className={`flex items-start mt-6 ${own && "flex-row-reverse"} px-4 pb-2`}
    >
      {own ? (
        user.profilePic ? (
          <img
            src={user.profilePic}
            className={`w-12 h-12 rounded-full object-cover object-center ${
              own ? "ml-2" : "mr-2"
            }`}
            alt=""
          />
        ) : (
          <span className="w-12 h-12 rounded-full bg-neutral grid place-items-center ml-2">
            {user.name[0].toUpperCase()}
          </span>
        )
      ) : 
      message.sender.profilePic ? (
        <img
          src={message.sender.profilePic}
          className={`w-12 h-12 rounded-full object-cover object-center mr-2`}
          alt=""
        />
      ) : (
        <span className="w-12 h-12 text-xl font-bold rounded-full bg-neutral grid place-items-center capitalize mr-2">
          {message.sender.name[0]}
        </span>
      )}
      <div>
        <h1
          className={`text-black font-semibold mb-2 ${
            own && "flex flex-row-reverse items-center"
          }`}
        >
          <span className="">{own ? "You" : message.sender.name}</span>
          <span className={`text-gray-400 text-xs ${own ? "mr-2" : "ml-2"}`}>
            {moment(
              new Date(message.updatedAt as string),
              "YYYYMMDD"
            ).fromNow()}
          </span>
        </h1>
        <p
          className={`text-black  ${
            own
              ? "rounded-tr-none bg-primary-focus text-white"
              : "rounded-tl-none bg-gray-300"
          } rounded-2xl p-4 max-w-md`}
        >
          {message.content}
        </p>
      </div>
    </div>
  );
}

interface PropsType {
  own: boolean;
  message: MessageType;
}
