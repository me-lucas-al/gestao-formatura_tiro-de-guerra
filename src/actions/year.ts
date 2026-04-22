"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";

const isNumberYear = (value: number | null): value is number => value !== null;

export async function setActiveYear(year: number) {
  const cookieStore = await cookies();
  cookieStore.set("active_year", year.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  revalidatePath("/");
}

export async function getAvailableYears() {
  const yearRows = await db.$queryRaw<Array<{ year: number | null }>>`
    SELECT DISTINCT year FROM "Atirador"
    UNION
    SELECT DISTINCT year FROM "Admin"
  `;

  const mergedYears = new Set<number>([
    ...yearRows.map((item) => item.year).filter(isNumberYear),
  ]);

  return Array.from(mergedYears).sort((first, second) => second - first);
}
