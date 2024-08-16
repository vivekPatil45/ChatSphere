import EmojiPicker from "emoji-picker-react";
import { Paperclip, SendHorizonal, Sticker } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MessageBar = () => {
    const emojiRef = useRef();

    const [message, setMessage] = useState("");
    const [isEmojiPicker, setIsEmojiPicker] = useState(false);

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                return setIsEmojiPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [emojiRef]);

    const handleSendMessage = () => {};

    return (
        <div className="h-[5vh] sm:h-[8vh] z-30 bg-[#1c1d25] flex-center  px-8 mb-2 gap-6">
            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center  md:gap-6 pr-5">
                <input
                    type="text"
                    className="w-full p-2.5 sm:p-3 text-sm bg-transparent rounded-md focus:border-none focus:outline-none"
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="text-neutral-500 rounded-sm p-1 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
                    <Paperclip className="w-5 h-5 sm:w-[23px] sm:h-[23px]"  />
                </button>
                <div className="relative">
                    <button
                        onClick={() => setIsEmojiPicker(true)}
                        aria-label="emoji picker"
                        className="text-neutral-500 rounded-sm p-1 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                    >
                        <Sticker className="w-6 h-6 sm:w-[25px] sm:h-[25px]" />
                    </button>
                    <div className="absolute bottom-16 -right-24 sm:right-0" ref={emojiRef}>
                        <EmojiPicker
                            theme="dark"
                            open={isEmojiPicker}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false}
                            searchDisabled={true}
                        />
                    </div>
                </div>
            </div>
            <button
                onClick={handleSendMessage}
                aria-label="send message"
                className="bg-[#8417ff] rounded-md flex-center p-2 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            >
                <SendHorizonal width={20} height={20} />
            </button>
        </div>
    );
};

export default MessageBar;