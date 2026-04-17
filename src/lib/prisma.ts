import { PrismaClient } from "@gestao_formatura/prisma/generated";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

interface PrismaArguments {
  where?: Record<string, unknown>;
  data?: Record<string, unknown> | Record<string, unknown>[];
  create?: Record<string, unknown>;
  update?: Record<string, unknown>;
}

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
            const decoded = jwt.default.decode(token) as { role?: string; year?: number };
            role = decoded?.role;
            year = decoded?.year;

            if (role === "SUPER_ADMIN") {
              const activeYearCookie = cookieStore.get("active_year")?.value;
              if (activeYearCookie) {
                year = Number(activeYearCookie);
              } else {
                return query(args);
              }
            }
          }
        } catch {
          return query(args);
        }

        if (!year) {
          return query(args);
        }

        const typedArgs = args as PrismaArguments;

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
          typedArgs.where = { ...typedArgs.where, year };
        }

        if (operation === "create") {
          typedArgs.data = { ...(typedArgs.data as Record<string, unknown>), year };
        }

        if (operation === "createMany") {
          if (Array.isArray(typedArgs.data)) {
            typedArgs.data = typedArgs.data.map((item) => ({
              ...item,
              year,
            }));
          } else if (typedArgs.data) {
            typedArgs.data = { ...(typedArgs.data as Record<string, unknown>), year };
          }
        }

        if (operation === "upsert") {
          typedArgs.create = { ...typedArgs.create, year };
          typedArgs.update = { ...typedArgs.update, year };
        }

        return query(typedArgs);
      },
    },
  },
});

export { db };
export default db;

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = prisma;
}