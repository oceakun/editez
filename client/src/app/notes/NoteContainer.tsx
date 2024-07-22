"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Note } from "../api/models/note.model";
import { NoteCard } from "./NoteCard";
import useSWR, { mutate } from "swr";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import NoteGrid from "./NoteGrid";
import NoteList from "./NoteList";

const NoteContainer = () => {
  const [sortedData, setSortedData] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortNotesBy, setSortNotesBy] = useState("length");
  const [summaryModel, setSummaryModel] = useState(
    "Falconsai/text_summarization"
  );
  const [layoutStyle, setLayoutStyle] = useState("grid");
  const [zoom, setZoom] = useState<number>(1);

  const boxStyle =
    "bg-neutral-100 border-2 rounded-xl p-2 flex flex-col items-center justify-center";

  const defaultNote = {
    id: 1,
    title: "Note 1",
    content: `This is the content of note 1.

        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nemo quam
        libero quibusdam est voluptatem saepe praesentium rem tempore? Quia
        harum sequi incidunt odio ex, cum soluta aut ad nesciunt veniam.
    `,
    created_at: new Date(),
    embeddings: [],
  };

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

  const { data, isLoading } = useSWR("/api/notes", fetcherWithAuth);

  useEffect(() => {
    if (data) {
      const parsedData = data as Note[];
      const sorted = [...parsedData].sort((a, b) => {
        if (sortNotesBy === "date") {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        } else if (sortNotesBy === "length") {
          return a.content.length - b.content.length;
        }
        return 0;
      });
      setSortedData(sorted);
    }
  }, [data, sortNotesBy]);

  const handleSort = (event: SelectChangeEvent) => {
    setSortNotesBy(event.target.value as string);
  };

 const handleSearch = async () => {
   try {
     const DATA_BASE_URL = process.env.NEXT_PUBLIC_DATA_API_BASE_URL;
     const accessToken = localStorage.getItem("accessToken"); // Get the access token from localStorage

     if (!accessToken) {
       throw new Error("No access token found. Please log in.");
     }

     const response = await fetch(`${DATA_BASE_URL}/search`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${accessToken}`, // Include the JWT token
       },
       body: JSON.stringify({ query: searchText }),
     });

     const responseText = await response.text();
     console.log("Response Text:", responseText);

     if (!response.ok) {
       let errorMessage = "Failed to fetch search results";
       try {
         const errorData = JSON.parse(responseText);
         errorMessage = errorData.error || errorMessage;
       } catch (parseError) {
         console.error("Error parsing error response:", parseError);
       }
       throw new Error(errorMessage);
     }

     const searchResults = JSON.parse(responseText);
     console.log(searchResults); // Handle the search results as needed
     setSortedData(searchResults);
   } catch (error) {
     if (error instanceof Error) {
       console.error("Error:", error.message);
       // You might want to handle specific errors here, e.g., redirect to login if token is invalid
     } else {
       console.error("Unknown error occurred");
     }
   }
 };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col py-10 text-center flex-grow bg-black gap-4 w-full">
        <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-6 md:gap-4 mb-6  rounded w-full">
          <div className="flex flex-row justify-between items-center gap-4 ">
            <FormControl
              sx={{
                bgcolor: "#101010",
                minWidth: 170,
                color: "white",
                border: 1,
                borderColor: "#242424",
                borderRadius: 1,
                height: 46,
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
                Sort by
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={sortNotesBy}
                label="SortNotesBy"
                onChange={handleSort}
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
                <MenuItem value={"date"}>Date</MenuItem>
                <MenuItem value={"length"}>Length</MenuItem>8{" "}
              </Select>
            </FormControl>

            <FormControl
              sx={{
                bgcolor: "#101010",
                minWidth: 170,
                color: "white",
                border: 1,
                borderColor: "#242424",
                borderRadius: 1,
                height: 46,
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
                Summary Model
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={summaryModel}
                label="Summary Model"
                onChange={(e) => setSummaryModel(e.target.value)}
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
          </div>

          <div className=" flex flex-row justify-around items-center border border-gray-200 dark:border-[#171a18] rounded w-full">
            <div
              className="enter-query hover:cursor-pointer hover:bg-[#101010] border-[1px] border-[#101010] p-[10px]"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#cccccc"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="What ya looking for..."
              className="w-full focus:outline-none border-none dark:bg-[black] text-left text-[14px] font-mono italic py-[4px] px-4"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </div>

          <div className=" border-[1px] border-gray-200/10 px-[14px] py-[6px] flex flex-row justify-between items-center gap-8 rounded">
            <button
              className="text-[#cccccc] hover:text-emerald-500 text-sm p-[5px] bg-[#101010] hover:text-emerald-100 rounded font-medium  "
              onClick={() => {
                layoutStyle == "grid"
                  ? setLayoutStyle("list")
                  : setLayoutStyle("grid");
              }}
            >
              <span>
                {layoutStyle == "grid" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                )}
              </span>
            </button>

            <button
              className="text-[#cccccc] hover:text-emerald-500 text-sm p-[5px] bg-[#101010] hover:text-emerald-100 rounded font-medium  "
              onClick={() => {
                // router.push(`/notes/${note.id}`);
              }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>
              </span>
            </button>

            <input
              type="range"
              min="0.6"
              max="1"
              step="0.1"
              value={zoom}
              onChange={handleZoomChange}
              className="custom-range-slider"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold text-rose-800">No files found</h1>
        <p className="mt-4 mb-4 text-base md:text-lg text-[#909090] font-light font-mono">
          Take down a file to get started.
        </p>
        <Link href="/notes/add">
          <button
            type="button"
            className="text-white font-medium rounded-lg text-[16px] px-4 py-2 text-center bg-gradient-to-r from-rose-400 to-yellow-500 hover:from-pink-500 hover:to-yellow-500 font-extrabold"
          >
            Add note
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-10 text-center flex-grow bg-black gap-4 w-full">
      <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-6 md:gap-4 mb-6  rounded w-full">
        <div className="flex md:flex-row flex-col justify-between items-center gap-6 md:gap-4">
          <FormControl
            sx={{
              bgcolor: "#101010",
              minWidth: 170,
              color: "white",
              border: 1,
              borderColor: "#242424",
              borderRadius: 1,
              height: 46,
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
              Sort by
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={sortNotesBy}
              label="SortNotesBy"
              onChange={handleSort}
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
              <MenuItem value={"date"}>Date</MenuItem>
              <MenuItem value={"length"}>Length</MenuItem>8{" "}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              bgcolor: "#101010",
              minWidth: 170,
              color: "white",
              border: 1,
              borderColor: "#242424",
              borderRadius: 1,
              height: 46,
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
              Summary Model
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={summaryModel}
              label="Summary Model"
              onChange={(e) => setSummaryModel(e.target.value)}
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
              <MenuItem value={"Falconsai/text_summarization"}>
                Falconsai
              </MenuItem>
              <MenuItem value={"./trained_models/seq2seq"}>Seq2Seq</MenuItem>
              <MenuItem value={"./trained_models/rnn"}>RNN</MenuItem>
            </Select>
          </FormControl>

          <div className="md:hidden block border-[1px] border-gray-200/10 px-[8px] py-[6px] rounded flex flex-row gap-4">
            <button
              className="text-[#cccccc] hover:text-emerald-500 text-sm p-[5px] bg-[#101010] hover:text-emerald-100 rounded font-medium  "
              onClick={() => {
                layoutStyle == "grid"
                  ? setLayoutStyle("list")
                  : setLayoutStyle("grid");
              }}
            >
              <span>
                {layoutStyle == "grid" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                    />
                  </svg>
                )}
              </span>
            </button>
            <button
              className="text-[#cccccc] hover:text-emerald-500 text-sm p-[5px] bg-[#101010] hover:text-emerald-100 rounded font-medium  "
              onClick={() => {
                // router.push(`/notes/${note.id}`);
              }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <div className="hidden custom:flex flex-row justify-around items-center border border-gray-200 dark:border-[#171a18] rounded w-full">
          <div
            className="enter-query hover:cursor-pointer hover:bg-[#101010] border-[1px] border-[#101010] p-[10px]"
            onClick={handleSearch}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#cccccc"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>

          <input
            type="text"
            placeholder="What ya looking for..."
            className="w-full focus:outline-none border-none dark:bg-[black] text-left text-[14px] font-mono italic py-[4px] px-4"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>

        <div className="hidden border-[1px] border-gray-200/10 px-[14px] py-[6px] md:flex flex-row justify-between items-center gap-8 rounded">
          <button
            className="text-[#cccccc] hover:text-emerald-500 text-sm p-[5px] bg-[#101010] hover:text-emerald-100 rounded font-medium  "
            onClick={() => {
              layoutStyle == "grid"
                ? setLayoutStyle("list")
                : setLayoutStyle("grid");
            }}
          >
            <span>
              {layoutStyle == "grid" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                  />
                </svg>
              )}
            </span>
          </button>

          <button
            className="text-[#cccccc] hover:text-emerald-500 text-sm p-[5px] bg-[#101010] hover:text-emerald-100 rounded font-medium  "
            onClick={() => {
              // router.push(`/notes/${note.id}`);
            }}
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
            </span>
          </button>

          <input
            type="range"
            min="0.6"
            max="1"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
            className="custom-range-slider"
          />
        </div>
      </div>

      <div className="custom:hidden flex flex-row justify-around items-center border border-gray-200 dark:border-[#171a18] rounded w-full">
        <div
          className="enter-query hover:cursor-pointer hover:bg-[#101010] border-[1px] border-[#101010] p-[10px]"
          onClick={handleSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#cccccc"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>

        <input
          type="text"
          placeholder="What ya looking for..."
          className="w-full focus:outline-none border-none dark:bg-[black] text-left text-[14px] font-mono italic py-[4px] px-4"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      </div>
      {layoutStyle == "grid" ? (
        <NoteGrid
          sortedData={sortedData}
          zoom={zoom}
          summaryModel={summaryModel}
        />
      ) : (
        <NoteList
          sortedData={sortedData}
          zoom={zoom}
          summaryModel={summaryModel}
        />
      )}
    </div>
  );
};

export default NoteContainer;
