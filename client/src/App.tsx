import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import { initUser } from "./store/authSlice";
import { asyncChat } from "./store/chatSlice";
import { RootState } from "./store/store";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("http://localhost:5000/api/auth", {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
        navigate("/login", { replace: true });
      } else {
        dispatch(initUser(data));
        dispatch(asyncChat() as any)
      }
    };
    getUser();
  }, [dispatch, navigate]);

  return (
    <Routes>
      <Route
        element={
          !user._id ? <Register /> : <Navigate to={"/"} replace={true} />
        }
        path="/register"
      />
      <Route
        element={!user._id ? <Login /> : <Navigate to={"/"} replace={true} />}
        path="/login"
      />
      <Route
        element={
          user._id ? <Home /> : <Navigate to={"/login"} replace={true} />
        }
        path="/"
      />
    </Routes>
  );
}

export default App;
