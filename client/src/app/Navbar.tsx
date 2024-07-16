"use client";
import { useState, useEffect, useRef } from "react";
import NavbarLink from "./NavbarLink";
import Link from "next/link";
import { useAuth } from "./authContext";

export default function Navbar() {
  const [isExpanded, setExpanded] = useState(false);
  const [username, setUsername] = useState("");
  const { logout } = useAuth();
  const usernameDivRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        if (userObject && userObject.username) {
          setUsername(userObject.username);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        usernameDivRef.current &&
        !usernameDivRef.current.contains(event.target as Node) &&
        svgRef.current &&
        !svgRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleUsername = () => {
    setExpanded(!isExpanded);
  };

  return (
    <nav className="bg-white dark:bg-black px-6">
      <div className="flex flex-col md:flex-row items-center justify-between mx-auto p-4 gap-4">
        <Link
          href="/"
          className="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 inline-block text-transparent bg-clip-text font-[20px] font-extrabold font-mono"
        >
          EditEz
        </Link>
        <div className="md:hidden flex flex-row gap-4 text-black items-center">
          <Link
            href="/notes"
            className="relative p-2 bg-gradient-to-r from-green-600/10 via-emerald-500/10 to-lime-400/10 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#86efac"
              className="w-6 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
          </Link>
          <Link
            href="/notes/add"
            className="relative p-2 bg-gradient-to-r from-green-600/10 via-emerald-500/10 to-lime-400/10 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#86efac"
              className="w-6 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </Link>
          {/* <NavbarLink href="/notes/add" title="+ New" btnType="special" /> */}

          <span
            className="relative p-2 bg-gradient-to-r from-green-600/10 via-emerald-500/10 to-lime-400/10 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="orange"
              className="w-6 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
          </span>
          <div className="relative p-2 bg-gradient-to-r from-green-600/10 via-emerald-500/10 to-lime-400/10 rounded-full">
            <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#86efac"
              className="w-6 cursor-pointer"
              onClick={toggleUsername}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <div
              ref={usernameDivRef}
              className={`absolute right-14 mt-[14px] transition-all duration-300 ease-in-out overflow-hidden bg-gradient-to-r from-green-600/50 via-emerald-500/50 to-lime-400/50 inline-block text-transparent bg-clip-text font-[20px] font-extrabold font-mono px-2 py-[4px] border-[1px] border-green-300/10 rounded-md italic ${
                isExpanded ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {username}
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-row gap-4 text-black items-center">
          <NavbarLink href="/notes" title="My Files" btnType="special" />
          <NavbarLink href="/notes/add" title="+ New" btnType="special" />
          {/* <div className="bg-gradient-to-r from-red-600/50 via-orange-500/50 to-yellow-400/50 p-[1px] rounded">
            <div className="bg-black rounded"> */}
          <button
            className="bg-gradient-to-r from-red-600/50 via-orange-500/50 to-yellow-400/50 inline-block text-transparent bg-clip-text font-[20px] font-extrabold font-mono px-2 py-[4px]"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            Logout
          </button>
          {/* </div>
          </div> */}
          <div className="bg-gradient-to-r from-green-600/30 via-emerald-500/30 to-lime-400/40 p-[1px] rounded">
            <div className="bg-black rounded px-[6px] py-[4px]">
              <span className=" text-green-300/70 italic font-mono">
                {username}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
