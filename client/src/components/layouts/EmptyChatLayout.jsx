import { animationDefaultOption } from '@/lib/utils'
import React from 'react'
import Lottie from 'react-lottie'
import { Link } from 'react-router-dom'

const EmptyChatLayout = () => {
    return (
        <div className="flex-1 md:bg-template md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
            <Link to={"https://github.com/vivekPatil45"}>
                <Lottie
                    isClickToPauseDisabled={true}
                    height={200}
                    width={200}
                    options={animationDefaultOption}
                />
            </Link>
            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-3xl text-2xl transition-all duration-300 text-center">
                <h3 className=" poppins-medium">
                    Welcome to
                <span className="text-purple-500"> ChatSphere</span> Chat App
                </h3>
                <small className="text-[0.75rem]">
                    Copyright <span className="text-purple-500">&copy;</span> 2024.
                    Created by{" "}
                    <Link
                        className="text-purple-500 underline"
                        to={"https://github.com/vivekPatil45"}
                        target="_blank"
                    >
                        Vivek Patil
                    </Link>
                </small>
            </div>
        </div>
    )
}

export default EmptyChatLayout
