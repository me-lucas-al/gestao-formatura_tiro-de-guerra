import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@gestao_formatura/prisma/generated";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });

declare global {
  var sharedPrismaClient: PrismaClient | undefined;
}

const createPrismaClient = () => new PrismaClient({ adapter });

const resolvePrismaClient = () => {
  if (process.env.NODE_ENV === "production") {
    return createPrismaClient();
  }

  if (!global.sharedPrismaClient) {
    global.sharedPrismaClient = createPrismaClient();
  }

  return global.sharedPrismaClient;
};

export const prismaClient = resolvePrismaClient();
