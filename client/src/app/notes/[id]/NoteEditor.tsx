"use client";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { useWindowSize } from "@uidotdev/usehooks";
import MarkdownButton from "./MarkdownButton";
import { useRouter } from "next/navigation";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function NoteEditor({
  title,
  content,
  id,
}: {
  title?: string;
  content?: string;
  id?: number;
}) {
  const [embeddingModel, setEmbeddingModel] = useState("default");

  const size = useWindowSize();
  const isMobile = (size.width ?? 0) < 768;
  const defaultMarkdown = `
# Welcome to EditEz! ✏️

Welcome to EditEz, an innovative editing app powered by LLMs. 🚀

You can create and edit files in **Markdown**. 🎉

Check out the [Markdown guide](https://www.markdownguide.org/cheat-sheet). 📚

`;

  const router = useRouter();

  const [form, setForm] = useState({
    title: title ?? "",
    content: content ?? defaultMarkdown,
    embeddings: [],
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:mb-6">
        <FormControl
          sx={{
            bgcolor: "#101010",
            minWidth: 170,
            color: "white",
            border: 1,
            borderColor: "#181818",
            borderRadius: 1,
            height: 48,
            boxShadow: 0,
          }}
        >
          <InputLabel
            id="demo-simple-select-helper-label"
            sx={{
              color: "#cccccc",
              fontSize: 17,
            }}
          >
            Embedding model
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={embeddingModel}
            label="embeddingModel"
            onChange={(e) => setEmbeddingModel(e.target.value)}
            sx={{
              color: "#cccccc",
              boxShadow: 0,
              height: 46,
            }}
            inputProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    backgroundColor: "#090909",
                    color: "white",
                  },
                },
              },
            }}
          >
            <MenuItem value={"default"}>Default</MenuItem>
            <MenuItem value={"custom1"}>Custom 1</MenuItem>
            <MenuItem value={"custom2"}>Custom 2</MenuItem>
          </Select>
        </FormControl>
        <input
          type="text"
          placeholder="Title..."
          className="hidden md:block w-full focus:outline-none border-[1px] border-[#181818] dark:bg-[black] text-left text-[14px] font-mono italic p-[13px] rounded"
          value={form.title}
          onChange={(e) => {
            setForm({ ...form, title: e.target.value });
          }}
        />
        <div className="flex flex-row justify-between items-center gap-6">
          <MarkdownButton
            role="secondary"
            onClick={() => {
              setForm({ title: "", content: defaultMarkdown, embeddings: [] });
            }}
          >
            <span>Clear</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-[18px] "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </MarkdownButton>
          <MarkdownButton
            role="primary"
            onClick={async () => {
              const url = id != null ? `/api/notes/${id}` : "/api/notes";
              const method = id != null ? "PATCH" : "POST";
              const accessToken = localStorage.getItem("accessToken"); // Get the access token

              try {
                const res = await fetch(url, {
                  method,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`, // Include the access token
                  },
                  body: JSON.stringify(form),
                });

                if (res.ok) {
                  const data = await res.json();
                  router.push(`/notes`);
                } else {
                  const errorData = await res.json();
                  console.error("Error response:", errorData);
                  alert("Failed to save note: " + errorData.error);
                }
              } catch (error) {
                console.error("Error:", error);
                alert("Failed to save note. Please try again.");
              }
            }}
          >
            <span>Save</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-[18px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </MarkdownButton>
        </div>
      </div>
      <input
        type="text"
        placeholder="Title..."
        className="w-full md:hidden focus:outline-none border-[1px] border-[#181818] dark:bg-[black] text-left text-[14px] font-mono italic p-[13px] rounded"
        value={form.title}
        onChange={(e) => {
          setForm({ ...form, title: e.target.value });
        }}
      />

      <MDEditor
        className="w-full"
        value={form.content}
        onChange={(value) => {
          setForm({ ...form, content: value ?? "" });
        }}
        height={isMobile ? 400 : 600}
        preview={isMobile ? "edit" : "live"}
        toolbarBottom={isMobile}
      />
    </div>
  );
}
