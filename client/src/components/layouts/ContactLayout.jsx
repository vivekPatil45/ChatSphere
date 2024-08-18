import React, { useEffect } from 'react'
import Logo from '../ui/Logo';
import Title from '../elements/Title';
import ProfileInfo from '../fragments/ProfileInfo';
import NewDm from '../fragments/NewDm';
import { useDispatch, useSelector } from 'react-redux';
import { selectedDirectMessageContacts, setDirectMessagerContact } from '@/store/slices/chatSlice';
import ContactList from '../fragments/ContactList';

const ContactLayout = () => {

    const directMessageContaacts = useSelector(selectedDirectMessageContacts);
    const dispatch = useDispatch();
    useEffect(() => {
        const getContact = async () => {
            try {
                const res = await fetch("/api/contacts/get-contact-for-dm", {
                method: "GET",
                credentials: "include",
                });
        
                const data = await res.json();
        
                if (!res.ok) {
                    throw new Error(data.errors);
                }
        
                if (data.contacts) {
                    dispatch(setDirectMessagerContact(data.contacts));
                    console.log(data.contacts);
                }
            } catch (error) {
                console.log(error);
            }
        };
    
        getContact();
    }, []);

    return (
        <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-template border-r-2 border-[#2f303b] ">
            
            {/* logo */}
            <div className=''>
                <Logo/>
            </div>

            {/* Direct Messages */}
            <div className='my-5'>
                <div className="flex-between pr-10">
                    <Title text="Direct Messages" />
                    <NewDm/>
                </div>
                <div className="max-h-[30vh] xs:max-h-[38vh] overflow-y-auto scroll-h">
                    <ContactList contacts={directMessageContaacts} />
                </div>
            </div>
            {/* Channel */}
            <div className='my-5'>
                <div className="flex-between pr-10">
                    <Title text="Channel" />
                </div>
            </div>

            <ProfileInfo />
        </div>
    )
}

export default ContactLayout
