import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatType: undefined,
    chatData: undefined,
    chatMessage: [],
    
};
const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChatType: (state, action) => {
            state.chatType = action.payload;
        },
        setChatData: (state, action) => {
            state.chatData = action.payload;
        },
        setChatMessages: (state, action) => {
            state.chatMessage = action.payload;
        },
        closeChat: (state) => {
            state.chatType = undefined;
            state.chatMessage = undefined;
            state.chatMessage = [];
        },
    },
});

export const { setChatType, closeChat, setChatData, setChatMessages } = chatSlice.actions;
export default chatSlice.reducer;

export const setSelectedChatData = (state) => state.chat.chatData;
export const setSelectedChatType = (state) => state.chat.chatType;
export const setSelectedChatMessage = (state) => state.chat.chatMessage;