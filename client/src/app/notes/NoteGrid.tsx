import React from "react";
import { NoteCard } from "./NoteCard";
import { Note } from "../api/models/note.model";
import { mutate } from "swr";

interface NoteGridProps {
  sortedData: Note[];
  zoom: number;
  summaryModel: string;
}

export default function NoteGrid({
  sortedData,
  zoom,
  summaryModel,
}: NoteGridProps) {
  return (
    <div className="w-full overflow-x-hidden">
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
        }}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 auto-cols-fr">
          {sortedData.map((note) => (
            <div key={note.id} className="w-full break-words">
              <NoteCard
                note={note}
                isLoading={false}
                summaryModel={summaryModel}
                onDelete={async () => {
                  try {
                    const token = localStorage.getItem("accessToken");
                    if (!token) {
                      throw new Error("Unauthorized: No token found");
                    }
                    const res = await fetch(`/api/notes/${note.id}`, {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    if (res.ok) {
                      mutate("/api/notes");
                    } else {
                      const errorData = await res.json();
                      throw new Error(
                        errorData.error || "Failed to delete note"
                      );
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
