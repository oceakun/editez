"use client";

import { useAuth } from "./authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        setIsAuthorized(true);
      } else {
        router.push("/unauthorized");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <main className="flex flex-col items-center p-10 text-center flex-grow bg-black gap-10 pt-40"></main>
  }

  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;
