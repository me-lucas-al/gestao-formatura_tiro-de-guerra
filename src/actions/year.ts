"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";

export async function setActiveYear(year: number) {
  const cookieStore = await cookies();
  cookieStore.set("active_year", year.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  revalidatePath("/");
}

export async function getAvailableYears() {
  const years = await db.atirador.findMany({
    select: { year: true },
    distinct: ["year"],
    orderBy: { year: "desc" },
  });

  return years.map((y) => y.year);
}
