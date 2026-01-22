"use client";

import { toast } from "react-toastify";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BiLogOut, BiMenu, BiPhone } from "react-icons/bi";
import { BsBoxArrowLeft } from "react-icons/bs";
import { FaCampground, FaMountain, FaUsers } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdDashboard, MdDiscount } from "react-icons/md";
import { TiTicket } from "react-icons/ti";
import { usePathname } from "next/navigation";
import { GrGallery } from "react-icons/gr";
import { FcAbout } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";

export default function SideBar() {
  const pathname = usePathname();
  const activeLink = pathname;
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarLinks = [
    {
      label: "Dashboard",
      icons: (
        <MdDashboard
          size={21}
          color={`${activeLink === "/" ? "blue" : "black"}`}
        />
      ),
      href: "/",
    },
    {
      label: "Users",
      icons: (
        <FaUsers
          size={21}
          color={`${activeLink === "/users" ? "blue" : "black"}`}
        />
      ),
      href: "/users",
    },
    // { label: "Campsites", icons: <TbReport size={25} color={`${activeLink === "/campsites" ? "blue" : "black"}`} />, href: "/campsites" },
    {
      label: "Campsites",
      icons: (
        <FaCampground
          size={21}
          color={`${activeLink === "/camps" ? "blue" : "black"}`}
        />
      ),
      href: "/camps",
    },
    {
      label: "Bookings",
      icons: (
        <TiTicket
          size={21}
          color={`${activeLink === "/booking" ? "blue" : "black"}`}
        />
      ),
      href: "/booking",
    },

    {
      label: "Discount",
      icons: (
        <MdDiscount
          size={21}
          color={`${activeLink === "/discounts" ? "blue" : "black"}`}
        />
      ),
      href: "/discounts",
    },
    {
      label: "Adventures",
      icons: (
        <FaMountain
          size={21}
          color={`${activeLink === "/adventures" ? "blue" : "black"}`}
        />
      ),
      href: "/adventures",
    },
    {
      label: "About us",
      icons: (
        <FcAbout
          size={21}
          color={`${activeLink === "/about" ? "blue" : "black"}`}
        />
      ),
      href: "/about",
    },
    {
      label: "Contact us",
      icons: (
        <BiPhone
          size={21}
          color={`${activeLink === "/contact" ? "blue" : "black"}`}
        />
      ),
      href: "/contact",
    },
    {
      label: "Experiences",
      icons: (
        <FaMountain
          size={21}
          color={`${activeLink === "/experiences" ? "blue" : "black"}`}
        />
      ),
      href: "/experiences",
    },
    {
      label: "Destinations",
      icons: (
        <FaMountain // You might want a different icon like FaMapMarkedAlt
          size={21}
          color={`${activeLink === "/destinations" ? "blue" : "black"}`}
        />
      ),
      href: "/destinations",
    },
    {
      label: "Gallery",
      icons: (
        <GrGallery
          size={21}
          color={`${activeLink === "/gallery" ? "blue" : "black"}`}
        />
      ),
      href: "/gallery",
    },
  ];

  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-[80] shadow-sm">
        <Link href="/" className="relative flex items-center h-8">
          <Image
            src={"/logo.svg"}
            alt="Campora Logo"
            width={40}
            height={40}
            priority
          />
        </Link>
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Open Menu"
        >
          <BiMenu size={28} className="text-gray-700" />
        </button>
      </div>

      {/* Mobile Backdrop */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:sticky top-0 left-0 flex flex-col h-screen w-72 bg-white shadow-xl lg:shadow-none border-r border-gray-100 z-[110] lg:z-auto`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-6 flex-shrink-0">
          <Link
            href="/"
            onClick={() => setShowSidebar(false)}
            className="flex items-center"
          >
            <Image
              src={"/logo.svg"}
              alt="Campora Logo"
              width={120}
              height={120}
              priority
            />
          </Link>
          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BsBoxArrowLeft size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hidden">
          {sidebarLinks.map((link, index) => {
            const isActive = activeLink === link.href;
            return (
              <Link
                href={link.href}
                key={`${link.label}-${index}`}
                onClick={() => setShowSidebar(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {link.icons}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-50 space-y-4">
          <Link
            href="/admin/settings"
            onClick={() => setShowSidebar(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all group"
          >
            <IoMdSettings
              size={21}
              className="text-gray-400 group-hover:text-gray-600 transition-colors"
            />
            <span>Settings</span>
          </Link>

          <div className="px-4 py-4 rounded-2xl bg-gray-50 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-inner overflow-hidden">
              {user?.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt={user.fullName}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <FaUsers size={20} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.fullName || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "admin@gmail.com"}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                toast.success("Logged out successfully");
              }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <BiLogOut size={21} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
