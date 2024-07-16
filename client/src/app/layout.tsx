import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import Navbar from "./Navbar";
import { AuthProvider } from "./authContext";
import React from "react";
import ClientLayoutContent from "./ClientLayoutContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EditEz, an Innovative Editing App",
  description:
    "EditEz is a comprehensive editor application that allows users to create, edit, delete, and download markdown files. It also offers powerful features like file summarization using LLMs and vector search to efficiently search through files.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${inter.className} flex flex-col h-screen`}>
          <ClientLayoutContent>{children}</ClientLayoutContent>
        </body>
      </AuthProvider>
    </html>
  );
}
