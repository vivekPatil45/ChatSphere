import { createContext, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Cookie from "js-cookie";
import { selectedUserData } from "@/store/slices/authSlice";

const HOST = "http://localhost:3000";
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useRef();
  const userData = useSelector(selectedUserData);
  const dispatch = useDispatch();
  const cookie = Cookie.get("jwt");

  useEffect(() => {
    if (userData?._id) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userData._id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      return () => {
        if (socket.current) {
          socket.current.disconnect();
          console.log("Socket disconnected");
        }
      };
    }
  }, [userData, cookie]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
