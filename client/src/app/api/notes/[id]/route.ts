const DATA_BASE_URL = process.env.NEXT_PUBLIC_DATA_API_BASE_URL;

// PATCH method to update a note
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const noteId = params.id;
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const response = await fetch(`${DATA_BASE_URL}/notes/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(await req.json()),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      return new Response(JSON.stringify(errorData), {
        status: response.status,
      });
    }

    const updatedNote = await response.json();
    return new Response(JSON.stringify(updatedNote), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
      status: 500,
    });
  }
}

// DELETE method to delete a note
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const noteId = params.id;

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const response = await fetch(`${DATA_BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete note");
    }

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
      status: 500,
    });
  }
}

// GET method to retrieve a note
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const noteId = params.id;

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const response = await fetch(`${DATA_BASE_URL}/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Note not found");
    }

    const note = await response.json();
    return new Response(JSON.stringify(note), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
      status: 500,
    });
  }
}

// POST method to summarize note content
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const noteId = params.id;
  const { summaryModel } = await req.json();

  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Fetch the note content
    const noteResponse = await fetch(`${DATA_BASE_URL}/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!noteResponse.ok) {
      const errorData = await noteResponse.json();
      throw new Error(errorData.error || "Note not found");
    }

    const note = await noteResponse.json();

    // Send the note content to the Flask API to get the summary
    const summaryResponse = await fetch(`${DATA_BASE_URL}/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: note.content,
        model: summaryModel,
      }),
    });

    if (!summaryResponse.ok) {
      const errorData = await summaryResponse.json();
      throw new Error(errorData.error || "Failed to summarize note");
    }

    const summaryData = await summaryResponse.json();
    return new Response(JSON.stringify(summaryData), { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: "Unknown error occurred" }), {
      status: 500,
    });
  }
}
