"use client";

import React from "react";
import { useAuth } from "./authContext";
import Navbar from "./Navbar";
import TempNavbar from "./TempNavbar";

const ClientLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex flex-col items-center p-10 text-center flex-grow bg-black gap-10 pt-40"></main>
    )
  }

  return (
    <>
      {user ? <Navbar /> : <TempNavbar />}
      {children}
    </>
  );
};

export default ClientLayoutContent;
