"use client";
import { useState } from "react";
import NavbarLink from "./NavbarLink";
import Link from "next/link";

export default function Navbar() {
  const [isExpanded, setExpanded] = useState(false);
  return (
    <nav className="bg-white dark:bg-black px-6">
      <div className="flex flex-wrap items-center justify-between mx-auto p-4 ">
        <Link
          href="/"
          className="bg-gradient-to-r from-green-600 via-emerald-500 to-lime-400 inline-block text-transparent bg-clip-text font-[20px] font-extrabold font-mono"
        >
          EditEz
        </Link>
        <div className="flex flex-row gap-4 text-black">
          <NavbarLink href="/login" title="Log in" btnType="normal" />
        </div>
      </div>
    </nav>
  );
}
