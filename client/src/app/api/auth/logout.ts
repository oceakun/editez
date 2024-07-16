import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;

    try {
      const response = await fetch(`${AUTH_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${req.cookies.access_token}`, // Assuming you store the token in a cookie
        },
      });

      if (response.ok) {
        res.status(200).json({ message: "Logged out" });
      } else {
        res.status(response.status).json({ error: "Logout failed" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
