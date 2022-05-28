import { IoChatbubblesSharp } from "react-icons/io5";
import { FiSettings } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import ProfileModal from "../ProfileModal/ProfileModal";
import { Button } from "@nextui-org/react";
import React from "react";
import { useDispatch } from "react-redux";
import { asyncLogout } from "../../store/authSlice";

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    dispatch(asyncLogout() as any)
  };

  return (
    <div className="navbar text-[whitesmoke] bg-primary px-3 lg:px-10">
      <div className="flex-1 px-2 lg:flex-none">
        <a href="/" className="flex items-center  text-2xl font-bold">
          <span>
            <IoChatbubblesSharp />
          </span>{" "}
          <span className="ml-2">ChatApp</span>
        </a>
      </div>
      <div className="flex justify-end flex-1 px-2">
        <div className="flex items-center">
          <a
            href="##"
            className="btn btn-ghost text-2xl rounded-btn hidden sm:inline-flex"
          >
            <IoMdNotificationsOutline />
          </a>
          <a
            href="##"
            className="btn btn-ghost text-2xl rounded-btn hidden sm:inline-flex"
          >
            <FiSettings />
          </a>
          <div className="dropdown dropdown-end p-0">
            <label tabIndex={0} className="btn btn-ghost rounded-btn p-0">
              <div className="avatar placeholder">
                <div className="w-12 rounded-full">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="" />
                  ) : (
                    <span className="text-xl bg-neutral w-full h-full flex items-center justify-center">
                      {user.name[0]}
                    </span>
                  )}
                </div>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content text-primary bg-gray-100 shadow-lg rounded-box w-52 mt-4"
            >
              <li>
                <ProfileModal />
              </li>
              <li>
                <Button onClick={handleLogout} color={"error"}>
                  Logout
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
