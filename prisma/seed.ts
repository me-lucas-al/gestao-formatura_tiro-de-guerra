import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const adminData = [
  {
    id: 1,
    name: "victor",
    password: bcrypt.hashSync("admin123", 10),
  },
  {
    id: 2,
    name: "de_souza",
    password: bcrypt.hashSync("admin123", 10),
  },
  {
    id: 3,
    name: "assis",
    password: bcrypt.hashSync("admin123", 10),
  },
  {
    id: 4,
    name: "muniz",
    password: bcrypt.hashSync("admin123", 10),
  },
];

async function main() {
  for (const admin of adminData) {
    const user = await prisma.admin.upsert({
      where: { id: admin.id },
      update: {},
      create: admin,
    });
    console.log(`Administrador ${user.name} criado/verificado.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seed finalizado.");
    await prisma.$disconnect();
  });
