"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AdminEntity } from "@/schemas/admin";

type SessionContextType = {
  admin: AdminEntity | undefined;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: AdminEntity | undefined;
}) {
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
