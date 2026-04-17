export const dynamic = "force-dynamic";

import { SessionProvider } from "@/hooks/use-session";
import { getSession } from "@/actions/admin";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.success || !session.data) {
    redirect("/");
  }

  return <SessionProvider admin={session.data}>{children}</SessionProvider>;
}