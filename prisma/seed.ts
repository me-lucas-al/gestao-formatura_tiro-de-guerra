import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma";

const adminData = [
  {
    username: "victor",
    password: bcrypt.hashSync("admin123", 10),
  },
  {
    username: "de_souza",
    password: bcrypt.hashSync("admin123", 10),
  },
  {
    username: "assis",
    password: bcrypt.hashSync("admin123", 10),
  },
  {
    username: "muniz",
    password: bcrypt.hashSync("admin123", 10),
  },
];

async function main() {
  console.log(`Iniciando o seed de ${adminData.length} administradores...`);
  
  for (const admin of adminData) {
    const user = await prisma.admin.upsert({
      where: { username: admin.username }, 
      update: {},
      create: admin, 
    });
    console.log(`Administrador ${user.username} criado/verificado.`);
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