import { createContext, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Cookie from "js-cookie";
import { selectedUserData } from "@/store/slices/authSlice";
import { addMessage, selectedChatData, selectedChatMessage, selectedChatType } from "@/store/slices/chatSlice";
import { setOfflineStatus, setOnlineStatus } from "@/store/slices/usersSlice";

const HOST = "http://localhost:3000";
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {

  const socket = useRef();
  const userData = useSelector(selectedUserData);
  const chatData = useSelector(selectedChatData);
  const chatMessage = useSelector(selectedChatType);
  const chatType = useSelector(selectedChatMessage);
  const dispatch = useDispatch();
  const cookie = Cookie.get("jwt");
  // const trigger = useSelector(selectedTrigger);


  useEffect(() => {
    if (userData) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userData._id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket.current.on("userStatus", ({ userId, status }) => {
        if (status === "online") {
          dispatch(setOnlineStatus(userId));
        } else {
          dispatch(setOfflineStatus(userId));
        }
      });

      return () => {
        if (socket.current) {
          socket.current.off("userStatus");
          socket.current.disconnect();
          console.log("Socket disconnected");
        }
      };
    }
  }, [userData, cookie]);

  useEffect(()=>{
    if(chatData){
      const handleMessage = (message) => {
        if (
          chatType !== undefined &&
          (chatData._id === message.sender._id ||
            chatData._id === message.recipient._id)
        ) {
          dispatch(addMessage(message));
        }
        // dispatch(addContactInDmContactList({ userId: userData._id, message }));

      };
      
      socket.current.on("receiveMessage", handleMessage);
      return () => {
        socket.current.off("receiveMessage", handleMessage);
        
      };
    }


  },[chatData,chatType,chatMessage])
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
