import { selectedChatData, selectedChatMessage, selectedChatType } from '@/store/slices/chatSlice';
import React, { useRef,useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import { selectedUserData } from '@/store/slices/authSlice';

const MessageFragment = () => {

    const fragmentRef = useRef();
    const dispatch = useDispatch();
    const chatMessages = useSelector(selectedChatMessage);
    const chatType = useSelector(selectedChatType);
    const chatData = useSelector(selectedChatData);
    const userData = useSelector(selectedUserData);
    const [showImage, setShowImage] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [showVideo, setShowVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [showMusic, setShowMusic] = useState(false);
    const [musicUrl, setMusicUrl] = useState("");

    useEffect(() => {
        if (fragmentRef.current) {
            fragmentRef.current.scrollTop = fragmentRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const renderMessages = () => {
        let lastDate = null;
    
        return chatMessages.map((message, index) => {
            const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
            const showDate = messageDate !== lastDate;
            lastDate = messageDate;
    
            return (
                <div key={index}>
                    {showDate && (
                        <div className="text-center text-sm text-gray-500 my-2">
                        {moment(message.timeStamp).format("LL")}
                        </div>
                    )}
                    {chatType === "contact" && renderDmMessages(message)}
                    {chatType === "channel" && renderChannelMessages(message)}
                </div>
            );
        });
    };
    const renderDmMessages = (message) => (
        <div
            className={`${
                message.sender === chatData._id ? "text-left" : "text-right"
            } mt-1`}
        >
            {message.messageType === "text" && (
                <div
                    className={`${
                        message.sender !== chatData._id
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                        : "bg-[#2e2b33]/5 text-white/80 border-[#ffffff]/20"
                    } border inline-block p-2.5 text-sm rounded my-1 max-w-[50%] break-wordss`}
                >
                    {message.content}
                </div>
            )}
            {/* {message.messageType === "file" && (
                <div
                    className={`${
                        message.sender !== chatData._id
                        ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                        : "bg-[#2e2b33]/5 text-white/80 border-[#ffffff]/20"
                    } border inline-block p-4 rounded my-1 max-w-[70%] md:max-w-[100%] lg:max-w-[50%] break-wordss`}
                >
                {checkIfImage(message.fileUrl) && (
                    <div
                    className="cursor-pointer"
                    onClick={() => {
                        setShowImage(true);
                        setImageUrl(message.fileUrl);
                    }}
                    >
                    <img src={message.fileUrl} height={200} width={200} alt="image" />
                    </div>
                )}
                {checkIfVideo(message.fileUrl) && (
                    <div
                    className="relative cursor-pointer"
                    onClick={() => {
                        setShowVideo(true);
                        setVideoUrl(message.fileUrl);
                    }}
                    >
                    <video width={220} height={220}>
                        <source src={message.fileUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Play className="text-white w-5 h-5" />
                    </div>
                    </div>
                )}
                {checkIfMusic(message.fileUrl) && (
                    <div
                    className="relative bg-none flex-center flex-col cursor-pointer"
                    onClick={() => {
                        setShowMusic(true);
                        setMusicUrl(message.fileUrl);
                    }}
                    >
                    <div>
                        <Music2
                        className="bg-none text-[#8417ff]"
                        width={50}
                        height={50}
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50">
                        <Play className="text-white w-5 h-5" />
                    </div>
                    <span className="text-sm mt-5">
                        {message.fileUrl.split("-").pop()}
                    </span>
                    </div>
                )}
        
                {checkIfDocument(message.fileUrl) && (
                    <div className="flex items-center justify-center gap-4">
                    <span className="text-white/8- text-3xl bg-black/20 rounded-full p-2">
                        <FileText height={16} width={16} />
                    </span>
                    <span className="text-sm">
                        {message.fileUrl.split("-").pop()}
                    </span>
                    <span
                        onClick={() => handleDownloadFile(message.fileUrl)}
                        className="bg-black/20 p-2  rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                    >
                        <Download height={16} width={16} />
                    </span>
                    </div>
                )}
        
                {checkIfArchive(message.fileUrl) && (
                    <div className="flex items-center justify-center gap-4">
                    <span className="text-white/8- text-3xl bg-black/20 rounded-full p-3">
                        <FileArchive height={16} width={16} />
                    </span>
                    <span className="text-sm">
                        {message.fileUrl.split("-").pop()}
                    </span>
                    <span
                        onClick={() => handleDownloadFile(message.fileUrl)}
                        className="bg-black/20 p-2 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                    >
                        <Download height={16} width={16} />
                    </span>
                    </div>
                )}
                </div>
            )} */}
    
            <div className="text-xs text-gray-600">
                {moment(message.timeStamp).format("LT")}
            </div>
        </div>
    );
    
    return (
        <div 
            className="flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full"
            ref={fragmentRef}
        >
            {renderMessages()}
        </div>
    )
}

export default MessageFragment
