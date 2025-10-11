"use client";

import { createContext, useContext } from "react";
import { useGetAdmin } from "./admin/use-get-admin";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

type SessionContextType = {
  admin: Admin | undefined;
  isLoading: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: admin, isLoading, isError } = useGetAdmin();

  console.log("admin: ", admin)
  useEffect(() => {
    if (!isLoading && isError) {
      router.replace("/");
      toast.error("Sessão expirada. Faça login novamente.");
    }
  }, [isLoading, isError, router]);

  return (
    <SessionContext.Provider value={{ admin, isLoading }}>
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