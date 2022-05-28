import { useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { initUser } from "../../store/authSlice";

export default function Login() {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleClick = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        <label htmlFor="">Username</label>
        <input
          ref={usernameRef}
          type="text"
          placeholder="Enter your username"
          className="mb-4 mt-1 p-2 rounded-md border-none outline-none"
        />
        <label htmlFor="">Password</label>
        <input
          ref={passwordRef}
          type="password"
          placeholder="Enter your password"
          className="mb-4 mt-1 p-2 rounded-md border-none outline-none"
        />
        <button onClick={handleClick} className="btn">
          Login
        </button>
        <p className="text-neutral-content">
          Don't have an account?{" "}
          <Link to="/register" className="underline text-neutral">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
