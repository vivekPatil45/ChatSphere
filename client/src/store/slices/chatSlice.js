import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatType: undefined,
    chatData: undefined,
    chatMessage: [],
    directMessagerContacts: [],
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
        setDirectMessagerContact: (state, action) => {
            state.directMessagerContacts = action.payload;
        },
        addMessage: (state, action) => {
            const { chatType } = state;
            const message = action.payload;
      
            const newMessage = {
                ...message,
                recipient:chatType === "channel" ? message.recipient : message.recipient._id,
                sender: chatType === "channel" ? message.sender : message.sender._id,
            };

            state.chatMessage.push(newMessage);
        },
        closeChat: (state) => {
            state.chatType = undefined;
            state.chatMessage = undefined;
            state.chatMessage = [];
        },
    },
});

export const { 
    setChatType, 
    closeChat, 
    setChatData, 
    setChatMessages ,
    setDirectMessagerContact,
    addMessage
} = chatSlice.actions;
export default chatSlice.reducer;

export const selectedChatData = (state) => state.chat.chatData;
export const selectedChatType = (state) => state.chat.chatType;
export const selectedChatMessage = (state) => state.chat.chatMessage;
export const selectedDirectMessageContacts = (state) =>state.chat.directMessagerContacts;