import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoversationType, MessageType, UserType } from "../utils/type";

interface InitialStateType {
  conversations: CoversationType[];
  currentCoversation: CoversationType | undefined;
  openRightSection: boolean;
  curMessages: MessageType[],
  sent: MessageType | undefined
}

export const asyncChat = createAsyncThunk("chat/asyncChat", async () => {
  const res = await fetch("http://localhost:5000/api/chat/", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (res.ok) return data;
  else alert(data.message);
});

 
export const asyncChatCreate = createAsyncThunk(
  "chat/asyncChatCreate",
  async ({
    groupMember,
    groupName,
  }: {
    groupMember: UserType[];
    groupName: string;
  }) => {
    const memberId = groupMember.map((item) => item._id);

    const res = await fetch("http://localhost:5000/api/chat/group", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: memberId, name: groupName }),
    });

    const data = await res.json();
    if (res.ok) return data;
    else alert(data.message);
  }
);

export const asyncChatSingleCreate = createAsyncThunk(
  "chat/asyncChatSingleCreate",
  async (userId: string) => {

    const res = await fetch("http://localhost:5000/api/chat/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({userId}),
    });

    const data = await res.json();
    if (res.ok) return data;
    else alert(data.message);
  }
);

export const asyncSingleChatGet = createAsyncThunk(
  "chat/asyncSingleChatGet",
  async (id: string) => {
    const func1 = async () => {
      const res = await fetch(`http://localhost:5000/api/chat/${id}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json()
      return data
    };

    const func2 = async () => {
      const res = await fetch(`http://localhost:5000/api/message/${id}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json()
      return data
    };

    const res = await Promise.all([func1(), func2()]);
    return res
  }
);

export const asyncMessageSend = createAsyncThunk(
  "chat/asyncMessageSend",
  async ({ content, chatId }: { content: string; chatId: string }) => {
    const res = await fetch("http://localhost:5000/api/message", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, chatId }),
    });
    const data = await res.json();
    console.log("api call")
    if (!res.ok) alert(data.message);
    else return data;
  }
);

const initialState: InitialStateType = {
  conversations: [],
  currentCoversation: undefined,
  openRightSection: false,
  curMessages: [],
  sent: undefined
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleSidebar: (
      state: InitialStateType,
      action: PayloadAction<boolean>
    ) => {
      state.openRightSection = action.payload;
    },
    resetSent: (state: InitialStateType) => {
      state.sent = undefined
    },
    setMessages: (state: InitialStateType, action: PayloadAction<MessageType[]>) => {
      state.curMessages = action.payload
    }
  },
  extraReducers: {
    [asyncChat.fulfilled.type]: (state, action) => {
      state.conversations = action.payload;
    },
    [asyncChatCreate.fulfilled.type]: (state, action) => {
      state.conversations.unshift(action.payload);
      state.currentCoversation = action.payload;
    },
    [asyncChatSingleCreate.fulfilled.type]: (state: InitialStateType, action) => {
      const index = state.conversations.findIndex(item => item._id === action.payload._id)
      if(index === -1) state.conversations.unshift(action.payload)
      state.currentCoversation = action.payload;
    },
    [asyncSingleChatGet.fulfilled.type]: (state, action) => {
      state.currentCoversation = action.payload[0];
      state.curMessages = action.payload[1]
    },
    [asyncMessageSend.fulfilled.type]: (state, action) => {
      state.sent = action.payload
    },
  },
});

export const { toggleSidebar, resetSent, setMessages } = chatSlice.actions;

export default chatSlice.reducer;
