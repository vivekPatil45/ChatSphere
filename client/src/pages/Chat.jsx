import ChatLayout from '@/components/layouts/ChatLayout';
import ContactLayout from '@/components/layouts/ContactLayout';
import EmptyChatLayout from '@/components/layouts/EmptyChatLayout';
import { selectedUserData } from '@/store/slices/authSlice.js'
import { selectedChatType } from '@/store/slices/chatSlice';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Chat = () => {

    const userData = useSelector(selectedUserData);
    const navigate = useNavigate();
    const chatType = useSelector(selectedChatType);

    useEffect(()=>{
        if(!userData.profileSetup){
            toast.error("Please setup profile to continue.");
            navigate("/profile")
        }
    },[userData,navigate])

    return (
        <main className="flex h-screen text-white overflow-hidden">
            <ContactLayout/>
            {chatType === undefined ? <EmptyChatLayout /> : <ChatLayout />}
            
        </main>
    )
}

export default Chat
