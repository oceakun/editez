// import { noteDto } from "../dto/note.dto";
// import prisma from "../../../../lib/prism";
import { NextRequest, NextResponse } from "next/server";

const DATA_BASE_URL = process.env.NEXT_PUBLIC_DATA_API_BASE_URL;
console.log("DATA_BASE_URL : ", DATA_BASE_URL);

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const response = await fetch(`${DATA_BASE_URL}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch notes");
    }

    const notes = await response.json();
    return Response.json(notes);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log("entered api/note post");
  try {
    // Extract the token from the request headers
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    console.log("data : ", data);

    const response = await fetch(`${DATA_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the request to your data API
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create note");
    }

    const createdNote = await response.json();
    return NextResponse.json(createdNote);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in POST /api/notes:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 400 }
    );
  }
}
