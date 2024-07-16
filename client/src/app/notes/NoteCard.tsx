"use client";

import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Note } from "../api/models/note.model";
import Markdown from "react-markdown";
import { useRouter } from "next/navigation";
import CardDropdown from "./CardDropdown";

export function NoteCard({
  note,
  isLoading,
  onDelete,
  summaryModel,
}: {
  note: Note;
  isLoading: boolean;
  onDelete: () => void;
  summaryModel:string;
}) {
  let content = note.content;
  const router = useRouter();
  const tempBgClr = "bg-black";

  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string>("");
  const [summaryOrContent, setSummaryOrContent] = useState<string>("content");
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [displayMarkdownMenu, setDisplayMarkdownMenu] = useState(false);

  const handleFileSummarization = async (noteId: number) => {
    setSummaryOrContent("summary");
    setIsSummaryVisible(true);
    setLoadingSummary(true);
    setSummaryError("");
    setSummary("");

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Unauthorized: No token found");
      }

      const response = await fetch(`/api/notes/${noteId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
        body: JSON.stringify({ summaryModel }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to summarize note");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error: any) {
      setSummaryError(error.message || "Unknown error occurred");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleFileEditing = (noteId: number) => {
    router.push(`/notes/${noteId}`);
  };

  const handleFileDownload = async (noteId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching the data.");
      }

      const data = await response.json();

      const blob = new Blob([data.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.title;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  const handleDropdownToggle = () => {
    displayMarkdownMenu
      ? setDisplayMarkdownMenu(false)
      : setDisplayMarkdownMenu(true);
  };

  return (
    <div className=" w-full break-words shadow-[0_35px_60px_-15px_rgba(100,100,100,0.3)]  ">
      <div className={`w-full rounded-[5px] font-mono rounded`}>
        <div className="py-6 px-4 flex items-center justify-between bg-[#101010]">
          <div className="text-gray-300 text-[20px] italic  ">
            {isLoading ? <Skeleton width={300} /> : note.title}
          </div>

          <button
            className="text-emerald-600 hover:text-emerald-100 text-sm bg-black rounded-full font-medium p-[4px] inline-flex space-x-1 items-center"
            onClick={() => handleDropdownToggle()}
          >
            <span>
              {displayMarkdownMenu ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              )}
            </span>
          </button>
        </div>

        <CardDropdown
          loadingSummary={loadingSummary}
          handleFileEditing={handleFileEditing}
          handleFileDeletion={onDelete}
          handleFileDownload={handleFileDownload}
          handleFileSummarization={handleFileSummarization}
          noteId={note.id}
          displayMarkdownMenu={displayMarkdownMenu}
        />

        {summaryOrContent === "content" ? (
          <>
            {isLoading ? (
              <Skeleton count={3} className="p-4" />
            ) : (
              <Markdown
                className={`card-markdown-content prose text-left p-4 font-mono text-white dark:${tempBgClr}`}
              >
                {content}
              </Markdown>
            )}
          </>
        ) : (
          <>
            {loadingSummary && (
              <div className="flex flex-row justify-center items-center space-x-2 pt-10 pb-20">
                <p className="text-center italic text-white-500">Summarizing</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="54"
                  height="12"
                  className="flex-shrink-0"
                >
                  <rect x="0" y="0" width="12" height="12" fill="#34d399">
                    <animate
                      attributeName="opacity"
                      values="1;0;1"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <rect x="21" y="0" width="12" height="12" fill="#4ade80">
                    <animate
                      attributeName="opacity"
                      values="1;0;1"
                      dur="2s"
                      begin="0.66s"
                      repeatCount="indefinite"
                    />
                  </rect>
                  <rect x="42" y="0" width="12" height="12" fill="#a3e635">
                    <animate
                      attributeName="opacity"
                      values="1;0;1"
                      dur="2s"
                      begin="1.33s"
                      repeatCount="indefinite"
                    />
                  </rect>
                </svg>
              </div>
            )}
            {summaryError && (
              <div className="p-4 text-red-600">{summaryError}</div>
            )}
            {summary && isSummaryVisible && (
              <div
                className={`w-full p-4 text-white transition-all duration-300 ease-in-out ${
                  isSummaryVisible
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-full"
                }`}
              >
                <p
                  className={`card-markdown-content prose text-left p-4 font-mono text-[#9ca3af] dark:${tempBgClr}`}
                >
                  {summary}
                </p>
                <button
                  className="w-full flex flex-row justify-center text-rose-400 hover:text-red-500 text-sm bg-black hover:text-emerald-100 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
                  onClick={() => {
                    setIsSummaryVisible(false);
                    setTimeout(() => setSummaryOrContent("content"), 300); // Wait for transition to complete
                  }}
                  disabled={loadingSummary}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* <p className="font-mono text-orange-400/60 bg-orange-400/10 border-[0px] border-b-0 border-orange-400/30  rounded-b p-2  text-right w-full date-container">
        {note.created_at.toLocaleString()}{" "}
      </p> */}
    </div>
  );
}
