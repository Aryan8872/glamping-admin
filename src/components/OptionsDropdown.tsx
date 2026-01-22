"use client"

import { useState } from "react";
import { SlOptions } from "react-icons/sl";

interface OptionsDropdownProps {
    label: string;
    icon:React.ReactNode
    function: () => void;
}

export default function OptionsDropdown({ options }: { options: OptionsDropdownProps[] }) {
    const [open, setOpen] = useState(false);
    console.log(options)
    return (
        <div className="relative">
            <div  onClick={() => setOpen(!open)} className="bg-gray-800 relative text-white flex flex-row gap-3 cursor-pointer items-center text-black px-3 py-2 rounded-md">

                Options <SlOptions color="white" />

            </div>
            {open && (
                <div className="flex flex-col gap-1 w-[130px] bg-gray-800 text-white  absolute top-10 right-2 border-white border-[0.5px] z-[40]  items-start rounded-md shadow-xl">
                    {options.map((option, index) => (
                        <button key={index} className="border-b-[0.1px] items-center flex flex-row gap-2 text-start px-2 border-black/20 py-1 w-full" onClick={option.function}>
                            {option.icon}{option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}