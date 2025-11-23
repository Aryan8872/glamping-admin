"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BiLogOut, BiMenu, BiSolidReport } from "react-icons/bi";
import { BsBoxArrowLeft, BsFillRouterFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdDashboard, MdOutlinePayment } from "react-icons/md";
import { TbReport } from "react-icons/tb";import { TiTicket } from "react-icons/ti";
;
export default function SideBar() {
    const [activeLink, setActiveLink] = useState("/admin/dashboard");
    const sidebarLinks = [
        { label: "Dashboard", icons: <MdDashboard size={25} color={`${activeLink === "/admin/dashboard" ? "blue" : "black"}`} />, href: "/admin/dashboard" },
        { label: "Users", icons: <FaUsers size={25} color={`${activeLink === "/admin/users" ? "blue" : "black"}`} />, href: "/admin/users" },
        // { label: "Campsites", icons: <TbReport size={25} color={`${activeLink === "/admin/campsites" ? "blue" : "black"}`} />, href: "/admin/campsites" },
        { label: "Campsites", icons: <MdOutlinePayment size={25} color={`${activeLink === "/admin/camps" ? "blue" : "black"}`} />, href: "/admin/camps" },
        { label: "Bookings", icons: <TiTicket size={25} color={`${activeLink === "/admin/booking" ? "blue" : "black"}`} />, href: "/admin/booking" },
        { label: "About us", icons: <BsFillRouterFill size={25} color={`${activeLink === "/admin/about" ? "blue" : "black"}`} />, href: "/admin/about" },
        { label: "Contact us", icons: <BiSolidReport size={25} color={`${activeLink === "/admin/contact" ? "blue" : "black"}`} />, href: "/admin/contact" },
        { label: "Gallery", icons: <BsFillRouterFill size={25} color={`${activeLink === "/admin/about" ? "blue" : "black"}`} />, href: "/admin/gallery" },

    ]
    const [showSidebar,setShowSidebar] = useState(true)
    return (
        <>
            <div onClick={()=>setShowSidebar(!showSidebar)} className={`lg:hidden ${showSidebar?'hidden':'block'} fixed cursor-pointer  top-5 left-1 h-max rounded-lg bg-white shadow-md z-[100]`}>
                <BiMenu size={50} className=""/>
            </div>
        
            <div className={`${showSidebar?'translate-x-0':'-translate-x-full'} lg:translate-x-0 transition-all ease-in-out duration-300 fixed flex z-[90] h-screen flex-col lg:sticky top-0 left-0 w-72 px-3 py-5 bg-white shadow-md`}>
                <span className="relative text-blue-600 flex gap-2 text-2xl font-semibold"> 
                    <Image src={"/netwavelogo.png"} alt="Netwave Logo" width={180} height={70} />
                    <BsBoxArrowLeft onClick={()=>setShowSidebar(false)} className="block cursor-pointer lg:hidden absolute right-0 top-5" />
                </span>
                <div className="flex flex-col gap-3 mt-6">
                    {sidebarLinks.map((link, index) => (
                        <Link 
                        href={link.href} 
                        onClick={() => setActiveLink(link.href)} key={`${link.label}` + index} 
                        className={`flex gap-2 items-center font-medium  px-3 py-3 rounded-lg ${activeLink === link.href ? 'bg-[#D0E5FB] text-blue-600' : 'bg-none text-black'}`}>
                            {link.icons}
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col gap-3 absolute bottom-5">
                    <Link href={"/admin/settings"} key={`Settings`} className={`flex gap-2 items-center font-semibold px-3 py-3 rounded-lg text-black`}> <IoMdSettings size={25} color={'black'} />  Settings</Link>
                    <section className="py-3 border-black/10 border-t-[0.3px] flex gap-2 items-center">
                        <div className="flex gap-2 items-center">
                            <div className="h-10 w-10 rounded-full bg-black">
                            </div>
                            <p className="flex flex-col gap-1">
                                <span className=" font-semibold">Admin</span>
                                <span className="text-sm text-gray-500">admin@gmail.com</span>
                            </p>

                            <BiLogOut size={25} color={'black'} />

                        </div>
                    </section>

                </div>

            </div>
        </>
    )
}