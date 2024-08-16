import { Plus } from "lucide-react";
import {
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,

} from "../ui/tooltip";
import {
    ResponsiveModal,
    ResponsiveModalContent,
    ResponsiveModalDescription,
    ResponsiveModalHeader,
    ResponsiveModalTitle,
} from '../ui/responsive-modal'

import { useState } from "react";
import { Input } from "../ui/input";
import Lottie from "react-lottie";
import { animationDefaultOption } from "@/lib/utils";
import { Avatar, AvatarImage } from "../ui/avatar";

const NewDm = () => {

    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [search, setSearch] = useState("");
    const [searchedContacts, setSearchedContacts] = useState([]);

    const handleSearch = async (e) => {
        setSearch(e.target.value);
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Plus
                            onClick={() => setOpenNewContactModal(true)}
                            className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mt-2 p-3 text-white">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <ResponsiveModal
                open={openNewContactModal}
                onOpenChange={setOpenNewContactModal}
                className="bg-none"
            >
                <ResponsiveModalContent
                    side="bottom"
                    className="bg-[#181920] backdrop-blur-sm border-none text-white w-full md:max-w-[400px] min-h-[400px] flex flex-col"
                >
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle className={"text-center text-white"}>
                            Please select a contact
                        </ResponsiveModalTitle>
                        <ResponsiveModalDescription></ResponsiveModalDescription>
                    </ResponsiveModalHeader>
                    <div className="mb-4">
                        <Input
                            placeholder="Search contacts..."
                            className="rounded-lg p-4 text-xs bg-[#2c2e3b] border-none"
                            onChange={handleSearch}
                            value={search}
                        />
                    </div>

                    {searchedContacts.length <= 0 ? (
                        <div>
                            <div className="flex-1 flex flex-col mt-5 justify-center items-center  duration-1000 transition-all">
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={100}
                                    width={100}
                                    options={animationDefaultOption}
                                />
                                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
                                    <h3 className="text-sm poppins-medium">
                                        Search new
                                        <span className="text-purple-500"> contacts.</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ScrollArea className="h-[230px]">
                            <div className="flex flex-col gap-5">
                                {searchedContacts.map((contact) => (
                                    <div
                                        key={contact._id}
                                        className="flex gap-3 items-center cursor-pointer"
                                        onClick={() => selectNewContact(contact)}
                                    >
                                        <div className="w-12 h-12 rounded-full relative">
                                            <Avatar className={"w-12 h-12 rounded-full"}>
                                                {contact.image ? (
                                                    <AvatarImage
                                                        src={contact.image}
                                                        alt="profile"
                                                        className={
                                                        "object-cover w-full h-full rounded-full bg-black"
                                                        }
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div
                                                        className={`uppercase h-12 w-12  text-xs border flex-center rounded-full ${getColor(
                                                        contact.color
                                                        )}`}
                                                    >
                                                        {contact.firstName && contact.lastName
                                                        ? splitName(contact.firstName, contact.lastName)
                                                        : contact.email.split("").shift()}
                                                    </div>
                                                )}
                                            </Avatar>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="">
                                                {contact.firstName && contact.lastName
                                                ? `${contact.firstName} ${contact.lastName}`
                                                : contact.email}
                                            </span>
                                            <span>
                                                <span className="text-xs">{contact.email}</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </ResponsiveModalContent>

            </ResponsiveModal>
        </>
    )
}

export default NewDm
