import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../utils/type";

interface InitialStateType {
  user: UserType;
  userSearchResult: UserType[]
}

export const asyncLogout = createAsyncThunk("auth/asyncLogout", () => {
  fetch("http://localhost:5000/api/auth/logout", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href="/login"
  });
  return {
    _id: "",
    username: "",
    name: "",
    profilePic: "",
  };
});

export const asyncUserSearch = createAsyncThunk("auth/asyncUserSearch", async (search: string) => {
  const res = await fetch(
    `http://localhost:5000/api/search?username=${search}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await res.json();
  if(res.ok) return data
  else alert(data.message)
});

const initialState: InitialStateType = {
  user: {
    _id: "",
    username: "",
    name: "",
    profilePic: "",
  },
  userSearchResult: []
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initUser: (state: any, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    resetSearchUser: (state: any) => {
      state.userSearchResult = []
    }
  },
  extraReducers: {
    [asyncLogout.fulfilled.type]: (state, action) => {
      state.user = action.payload;
    },
    [asyncUserSearch.fulfilled.type]: (state, action) => {
      state.userSearchResult = action.payload;
    },
  },
});

export const { initUser, resetSearchUser } = authSlice.actions;

export default authSlice.reducer;
