import React from "react";
import { NoteSlit } from "./NoteSlit";
import { Note } from "../api/models/note.model";
import { mutate } from "swr";

interface NoteListProps {
  sortedData: Note[];
  zoom: number;
  summaryModel: string;
}

export default function NoteList({
  sortedData,
  zoom,
  summaryModel,
}: NoteListProps) {
  return (
    <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}>
      <div className="flex flex-col w-full gap-14">
        {sortedData.map((note) => (
          <NoteSlit
            key={note.id}
            note={note}
            isLoading={false}
            summaryModel={summaryModel}
            onDelete={async () => {
              try {
                // Retrieve the token from localStorage
                const token = localStorage.getItem("accessToken");
                if (!token) {
                  throw new Error("Unauthorized: No token found");
                }

                const res = await fetch(`/api/notes/${note.id}`, {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request
                  },
                });

                if (res.ok) {
                  mutate("/api/notes");
                } else {
                  const errorData = await res.json();
                  throw new Error(errorData.error || "Failed to delete note");
                }
              } catch (error) {
                if (error instanceof Error) {
                  console.error("Error deleting note:", error.message);
                } else {
                  console.error("Unknown error occurred during deletion");
                }
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
