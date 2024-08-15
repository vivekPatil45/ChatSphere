import React from 'react'
import Logo from '../ui/Logo';
import Title from '../elements/Title';

const ContactLayout = () => {
    return (
        <div className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-template border-r-2 border-[#2f303b] ">
            <div className=''>
                <Logo/>
            </div>

            <div className='my-5'>
                <div className="flex-between pr-10">
                    <Title text="Direct Messages" />
                </div>
            </div>

            <div className='my-5'>
                <div className="flex-between pr-10">
                    <Title text="Channel" />
                </div>
            </div>
        </div>
    )
}

export default ContactLayout
