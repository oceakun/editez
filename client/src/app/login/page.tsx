"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../authContext";

export default function page() {
  const { login } = useAuth();
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await login(loginUsername, loginPassword); // Call the login function from auth context
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const togglePasswordVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <main className="flex flex-col p-10 text-center items-center flex-grow bg-black gap-4 w-full text-gray-500 font-mono">
      <div className="flex flex-row md:flex-row justify-center items-center md:items-center gap-6 md:gap-4 mb-6  rounded bg-gradient-to-r from-red-800 via-orange-500 to-yellow-500 p-[1px]">
        <form className="flex flex-col items-center rounded-lg p-8 bg-black gap-4 ">
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
              className="md:w-[300px] w-[250px] border border-black rounded-sm h-8 bg-[#141414] text-white text-left focus:outline-none focus:opacity-100 opacity-70 px-2"
            />
          </div>

          <div className="mb-2 w-full">
            <p className="text-gray-300 mb-2 text-left">Password</p>
            <div className="flex flex-row justify-around items-center border border-black rounded-sm h-8 bg-[#141414] text-white text-center focus:outline-none focus:opacity-100 ">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="..."
                onChange={handlePassword}
                value={loginPassword}
                name="password"
                required
                className="md:w-[250px] w-[200px] rounded-sm bg-[#141414] text-white text-left focus:outline-none focus:opacity-100 opacity-70"
              />
              <button onClick={togglePasswordVisibility}>
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="gray"
                    className="w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="gray"
                    className="w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col gap-10">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-[#141414] text-white w-full cursor-pointer h-8 text-center border border-gray-600 rounded-sm opacity-80 hover:opacity-100"
            >
              {"->"}
            </button>
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
