"use client";
import useSWR from "swr";
import NoteEditor from "./NoteEditor";
import Link from "next/link";
import ProtectedRoute from "@/app/ProtectedRoute";

export default function NotePage({ params }: { params: { id: string } }) {
  const fetcherWithAuth = (url: string) => {
    const token = localStorage.getItem("accessToken");
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error("An error occurred while fetching the data.");
      }
      return res.json();
    });
  };

  const { data, isLoading } = useSWR(
    `/api/notes/${params.id}`,
    fetcherWithAuth
  );

  if (params.id === "add") {
    return (
      <ProtectedRoute>
        <main className="flex flex-col p-10 text-center flex-grow bg-black">
          {/* <header className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl text-blue-400">
            Create a New File
            <span className="text-base mt-4 md:text-lg text-[#909090] italic font-light font-mono">
              Start a new Markdown file and save it with ease.
            </span>
          </h1>
        </header> */}

          <NoteEditor />
        </main>
      </ProtectedRoute>
    );
  }

  if (data?.error) {
    return (
      <ProtectedRoute>
        <main className="flex flex-col p-10 text-center flex-grow bg-[#090909]">
          <header className="mb-6">
            <h1 className="text-3xl font-bold md:text-4xl text-pink-400">
              Error loading file
            </h1>
            <p className="text-lg mt-4 mb-4 md:text-xl dark:text-white">
              An error occurred while loading the file. Please try again later.
            </p>
            <Link href="/notes/add">
              <button
                type="button"
                className="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
              >
                + New
              </button>
            </Link>
          </header>
        </main>
      </ProtectedRoute>
    );
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <main className="flex flex-col p-10 text-center flex-grow bg-[#090909]">
          <header className="mb-6">
            <h1 className="text-3xl font-bold md:text-4xl text-green-500 ">
              Loading note
            </h1>
            <p className="text-lg mt-4 md:text-xl dark:text-white">
              Please wait while we load the note for you.
            </p>
          </header>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="flex flex-col p-10 text-center flex-grow bg-[#090909]">
        <header className="mb-6">
          <h1 className="text-3xl font-bold md:text-4xl text-violet-400">
            Edit a note
          </h1>
          <p className="text-base mt-4 md:text-lg text-[#909090] italic font-light font-mono">
            Make changes to your note and save/reset.
          </p>
        </header>
        <NoteEditor
          id={Number(params.id)}
          title={data.title}
          content={data.content}
        />
      </main>
    </ProtectedRoute>
  );
}
