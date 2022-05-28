import React, { useState } from "react";
import { Modal, Button, Loading } from "@nextui-org/react";
import { AiOutlineCamera } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export default function ProfileModal() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user.name);

  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
  };

  const editHandler = async () => {
    const res = await fetch(`https://mern-chat-app-socketio.herokuapp.com/api/auth/${user._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.message);
    setVisible(false);
    window.location.href = "/";
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    const files = e.target.files as FileList;
    const formData = new FormData();
    formData.append("image", files[0]);
    const res = await fetch(`https://mern-chat-app-socketio.herokuapp.com/api/auth/${user._id}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) alert(data.message);
    setLoading(false);
    window.location.href = "/";
  };

  return (
    <div className="p-0 flex">
      <Button onClick={handler} light className="flex-grow text-black">
        Profile
      </Button>
      <Modal
        closeButton
        blur
        preventClose
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <h1 className="text-lg font-bold">
            Edit Your <span className="text-xl text-primary">Profile</span>
          </h1>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="flex items-center justify-center mb-4">
              {loading ? (
                <Loading color={"success"} type="points" />
              ) : (
                <>
                  <label htmlFor="image" className="relative">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        className="w-20 h-20 rounded-full object-cover object-center"
                        alt=""
                      />
                    ) : (
                      <span className="text-xl bg-neutral w-16 h-16 rounded-full text-white  flex items-center justify-center">
                        {user.name[0]}
                      </span>
                    )}
                    <AiOutlineCamera className="absolute bottom-0 right-0 translate-x-3 bg-white rounded-full p-1 text-3xl" />
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    hidden
                    onChange={handleChange}
                  />
                </>
              )}
            </div>
            <div>
              <label htmlFor="" className="text-xs font-semibold">
                FULL NAME
              </label>
              <input
                type="text"
                className="w-full bg-gray-100 p-2 rounded-lg outline-none border-none mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="" className="text-xs font-semibold">
                USERNAME
              </label>
              <input
                type="text"
                className="w-full bg-gray-100 p-2 rounded-lg outline-none border-none mt-1 cursor-not-allowed text-gray-700"
                disabled
                value={"@ahnaf"}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
          <Button auto onClick={editHandler}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
