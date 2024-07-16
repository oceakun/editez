import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("making a call to login endpoint");
  if (req.method === "POST") {
    const { username, password } = req.body;
    const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;
    try {
      const response = await fetch(`${AUTH_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        res.status(200).json({
          user: { username: data.user.username, email: data.user.email },
        });
        
      } else {
        res.status(response.status).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
