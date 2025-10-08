"use client";
import { SessionProvider } from "@/hooks/use-session";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}