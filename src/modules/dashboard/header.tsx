"use client";

import { useSession } from "@/hooks/use-session";
import Cards from "./cards";

export default function DashboardHeader({ atiradores, familyMembers }: { atiradores: any[], familyMembers: any[] }) {
  const { admin } = useSession();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Bem-vindo,{" "}
          {admin?.name
            ?.split("_")
            .join(" ")
            .split(" ")
            .map(
              (word: string) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
          !
        </h1>
      </div>

      <Cards atiradores={atiradores} familyMembers={familyMembers} />
    </>
  );
}
