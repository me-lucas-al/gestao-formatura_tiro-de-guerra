"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Admin } from "@prisma/client";

type SessionContextType = {
  admin: Admin | undefined;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children, admin }: { children: React.ReactNode, admin: Admin | undefined }) {
  const router = useRouter();

  useEffect(() => {
    if (!admin) {
      router.replace("/");
    }
  }, [admin, router]);

  return (
    <SessionContext.Provider value={{ admin, isLoading: false }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};