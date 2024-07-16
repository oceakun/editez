import React from "react";

interface CardDropdownProps {
  loadingSummary: boolean;
  displayMarkdownMenu: boolean;
  noteId: number;
  handleFileEditing: (noteId: number) => void;
  handleFileDeletion: (noteId: number) => void;
  handleFileSummarization: (noteId: number) => void;
  handleFileDownload: (noteId: number) => void;
}

export default function CardDropdown({
  loadingSummary,
  displayMarkdownMenu,
  noteId,
  handleFileEditing,
  handleFileDeletion,
  handleFileSummarization,
  handleFileDownload,
}: CardDropdownProps) {
  return (
    <div
      className={`${displayMarkdownMenu ? "flex" : "hidden"} flex-row justify-center items-center bg-gradient-to-r from-green-600/10 via-emerald-500/10 to-lime-400/10 border-t-[2px] border-black w-full`}
    >
      <div className="p-4">
        <button
          className="text-emerald-500 hover:text-emerald-100 text-sm bg-black hover:text-emerald-100 rounded-l-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
          onClick={() => handleFileEditing(noteId)}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </span>
          {/* <span>{isLoading ? <Skeleton width={50} /> : ""}</span> */}
        </button>
        <button
          className="text-emerald-500 hover:text-emerald-100 text-sm bg-black hover:text-emerald-100 font-medium px-4 py-2 inline-flex space-x-1 items-center"
          onClick={() => handleFileDeletion(noteId)}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </span>
          {/* <span>{isLoading ? <Skeleton width={50} /> : ""}</span> */}
        </button>
        <button
          className="text-emerald-500 hover:text-emerald-100 text-sm bg-black hover:text-emerald-100  font-medium px-4 py-2 inline-flex space-x-1 items-center"
          onClick={() => handleFileSummarization(noteId)}
          disabled={loadingSummary}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
              />
            </svg>
          </span>
        </button>
        <button
          className="text-emerald-500 hover:text-emerald-100 text-sm bg-black hover:text-emerald-100 font-medium rounded-r-lg px-4 py-2 inline-flex space-x-1 items-center"
          onClick={() => handleFileDownload(noteId)}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </span>
        </button>
        {/* <button
          className="text-emerald-500 hover:text-emerald-100 text-sm bg-black hover:text-emerald-100 rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center"
          onClick={() => handleFileDownload(noteId)}
        >
          <span>
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
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          </span>
        </button> */}
      </div>
    </div>
  );
}
