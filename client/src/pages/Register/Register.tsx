import { useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { initUser } from "../../store/authSlice";

export default function Register() {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = async () => {
    const res = await fetch("https://mern-chat-app-socketio.herokuapp.com/api/auth/register", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameRef.current?.value,
        username: usernameRef.current?.value,
        password: passwordRef.current?.value,
      }),
    });
    const data = await res.json();
    if (!res.ok) alert(data.message);
    else {
      dispatch(initUser(data));
      navigate('/', {replace: true})
    }
  };

  return (
    <div className="h-screen grid place-items-center bg-gray-200">
      <div className="flex flex-col text-neutral font-bold bg-primary p-8 shadow-lg rounded-md">
        <label htmlFor="">Full Name</label>
        <input
          ref={nameRef}
          type="text"
          placeholder="Enter your full name"
          className="mb-4 mt-1 p-2 rounded-md border-none outline-none"
          required
        />
        <label htmlFor="">Username</label>
        <input
          ref={usernameRef}
          type="text"
          placeholder="Enter your username"
          className="mb-4 mt-1 p-2 rounded-md border-none outline-none"
          required
        />
        <label htmlFor="">Password</label>
        <input
          ref={passwordRef}
          type="password"
          placeholder="Enter your password"
          className="mb-4 mt-1 p-2 rounded-md border-none outline-none"
          required
        />
        <button onClick={handleClick} className="btn">
          Sign Up
        </button>
        <p className="text-neutral-content">
          Already have an account?{" "}
          <Link to={"/login"} className="underline text-neutral">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
