import React from 'react'
import Logo from '../ui/Logo';
import Title from '../elements/Title';
import ProfileInfo from '../fragments/ProfileInfo';
import NewDm from '../fragments/NewDm';

const ContactLayout = () => {
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
