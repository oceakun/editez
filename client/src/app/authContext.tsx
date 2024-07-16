"use client";

// src/app/authContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");
      console.log("accessToken : ", accessToken);
      console.log("storedUser : ", storedUser);
      if (storedUser && accessToken) {
        try {
          // Verify the token with your backend
          const response = await fetch("http://localhost:4000/auth/whoami", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            console.log("setting user : ", data.user);
          } else {
            // If verification fails, clear localStorage
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            setUser(null);
          }
        } catch (error) {
          console.error("Error verifying auth:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();

  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;
    console.log("AUTH_BASE_URL : ", AUTH_BASE_URL);

    try {
      console.log("Attempting to call /api/auth/login");
      const response = await fetch(`http://localhost:4000/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          localStorage.setItem("accessToken", data.tokens.access);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          router.push("/");
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError);
          throw new Error("Invalid response format");
        }
      } else {
        throw new Error(`Login failed: ${response.status} ${responseText}`);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      router.push("/");
    }
  };

  const logout = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("No access token found in local storage.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/auth/logout", {
        method: "GET", // Use GET since your endpoint uses @auth_bp.get('/logout')
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("username");
        router.push("/login");
      } else {
        console.error("Logout failed:", response.status, await response.text());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
