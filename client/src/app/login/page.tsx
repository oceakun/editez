"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../authContext";

export default function page() {
  const { login } = useAuth(); // Destructure the login function from the auth context
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEmail = (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    setLoginUsername(val);
  };

  const handlePassword = (e: any) => {
    e.preventDefault();
    const val = e.target.value;
    setLoginPassword(val);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleSubmit");
    e.preventDefault();
    setError(null);

    try {
      await login(loginUsername, loginPassword); // Call the login function from auth context
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <main className="flex flex-col p-10 text-center items-center flex-grow bg-black gap-4 w-full text-gray-500 font-mono">
      <div className="flex flex-row md:flex-row justify-center items-center md:items-center gap-6 md:gap-4 mb-6  rounded bg-gradient-to-r from-red-800 via-orange-500 to-yellow-500 p-[1px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center rounded-lg p-8 bg-black gap-4 "
        >
          <h3 className="text-2xl font-normal text-white mb-4">Log-In</h3>
          <div className="mb-0 w-full">
            <p className="text-gray-300 mb-2 text-left">Username</p>
            <input
              type="text"
              placeholder="..."
              onChange={handleEmail}
              value={loginUsername}
              name="email"
              required
              className="md:w-[300px] w-[250px] border border-black rounded-sm h-8 bg-[#141414] text-white text-center focus:outline-none focus:opacity-100 opacity-70"
            />
          </div>

          <div className="mb-2 w-full">
            <p className="text-gray-300 mb-2 text-left">Password</p>
            <input
              type="password"
              placeholder="..."
              onChange={handlePassword}
              value={loginPassword}
              name="password"
              required
              className="md:w-[300px] w-[250px] border border-black rounded-sm h-8 bg-[#141414] text-white text-center focus:outline-none focus:opacity-100 opacity-70"
            />
          </div>

          <div className="w-full flex flex-col gap-10">
            <button
              type="submit"
              className="bg-[#141414] text-white w-full cursor-pointer h-8 text-center border border-gray-600 rounded-sm opacity-80 hover:opacity-100"
            >
              {"->"}
            </button>
            {/* <button
              type="submit"
              onClick={logIn}
              className="bg-gray-900 text-white w-full cursor-pointer h-8 text-center border border-gray-600 rounded-sm opacity-80 hover:opacity-100"
            >
              Google
            </button> */}
          </div>

          <p className="text-gray-300 mt-10">
            New to EditEz?{" "}
            <Link
              href="/register"
              className="border-b text-gray-300 cursor-pointer"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
