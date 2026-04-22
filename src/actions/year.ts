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
  const atiradorYears = await db.atirador.findMany({
    select: { year: true },
    distinct: ["year"],
    orderBy: { year: "desc" },
  });

  const adminYears = await db.admin.findMany({
    select: { year: true },
    distinct: ["year"],
    orderBy: { year: "desc" },
  });

  const mergedYears = new Set<number>([
    ...atiradorYears.map((item) => item.year).filter(isNumberYear),
    ...adminYears.map((item) => item.year).filter(isNumberYear),
  ]);

  return Array.from(mergedYears).sort((first, second) => second - first);
}
