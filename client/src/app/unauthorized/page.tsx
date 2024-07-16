import React from 'react'
import Link from "next/link";

export default function page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <div className="flex items-center">
        <h1 className="inline-block mr-5 pr-6 text-2xl font-medium leading-[49px] border-r border-black/30 dark:border-white/30 text-black dark:text-white">
          401
        </h1>
        <div className="inline-block">
          <h2 className="text-sm font-normal leading-[49px] m-0 text-black dark:text-white">
            You do not have permission to view this page.
          </h2>
        </div>
      </div>
    </div>
  );
}
