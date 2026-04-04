import { PrismaClient } from "@gestao_formatura/prisma/generated";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { tenantContext } from "./tenant-context";

neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });

declare global {
  var cachedPrisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({ adapter });
  }
  prisma = global.cachedPrisma;
}

const db = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (process.env.IS_SEEDING === "true") {
          return query(args);
        }
        const tenantModels = ["Atirador", "Admin", "Payment", "FamilyMember"];
        if (!tenantModels.includes(model)) {
          return query(args);
        }

        let year: number | null | undefined = undefined;
        let role: string | null | undefined = undefined;

        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const token = cookieStore.get("token")?.value;

          if (token) {
            const jwt = await import("jsonwebtoken");
            const decoded = jwt.default.decode(token) as any;
            role = decoded?.role;
            year = decoded?.year;

            if (role === "SUPER_ADMIN") {
              const activeYearCookie = cookieStore.get("active_year")?.value;
              if (activeYearCookie) {
                year = Number(activeYearCookie);
              } else {
                // For SUPER_ADMIN without active_year cookie, we don't apply the filter here
                // to avoid recursion if we were to query the DB for the latest year.
                // The getSession action will handle setting the default activeYear.
                return query(args);
              }
            }
          }
        } catch (e) {
          // Not in a request context (e.g., seeding, build)
          return query(args);
        }

        if (!year) {
          return query(args);
        }

        // Apply year filter to 'where' clauses
        if (
          [
            "findFirst",
            "findFirstOrThrow",
            "findMany",
            "update",
            "updateMany",
            "delete",
            "deleteMany",
            "count",
            "aggregate",
            "groupBy",
          ].includes(operation)
        ) {
          (args as any).where = { ...(args as any).where, year };
        }

        // Inject year into 'create' data
        if (operation === "create") {
          (args as any).data = { ...(args as any).data, year };
        }

        // Inject year into 'createMany' data
        if (operation === "createMany") {
          if (Array.isArray((args as any).data)) {
            (args as any).data = (args as any).data.map((item: any) => ({
              ...item,
              year,
            }));
          } else if ((args as any).data) {
            (args as any).data = { ...(args as any).data, year };
          }
        }

        // Inject year into 'upsert' data
        if (operation === "upsert") {
          (args as any).create = { ...(args as any).create, year };
          (args as any).update = { ...(args as any).update, year };
        }

        return query(args);
      },
    },
  },
});

export { db };
export default db;

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = prisma;
}
