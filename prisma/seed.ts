import 'dotenv/config'
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const adminData = [
  {
    id: 1,
    name: "victor",
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD!, 10),
  },
  {
    id: 2,
    name: "de_souza",
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD!, 10),
  },
  {
    id: 3,
    name: "assis",
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD!, 10),
  },
  {
    id: 4,
    name: "muniz",
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD!, 10),
  },
];

const atiradorData = [
  { id: 1, number: 1, name: "Adriano", adminId: 1 },
  { id: 2, number: 2, name: "Adryan", adminId: 1 },
  { id: 3, number: 3, name: "Gomes", adminId: 1 },
  { id: 4, number: 4, name: "Alex", adminId: 1 },
  { id: 5, number: 5, name: "Picolotto", adminId: 1 },
  { id: 6, number: 6, name: "Allan", adminId: 1 },
  { id: 7, number: 7, name: "Muniz", adminId: 1 },
  { id: 8, number: 8, name: "Yago", adminId: 1 },
  { id: 9, number: 9, name: "Arthur", adminId: 1 },
  { id: 10, number: 10, name: "Bruno", adminId: 1 },
  { id: 11, number: 11, name: "Passos", adminId: 1 },
  { id: 12, number: 12, name: "Carlos", adminId: 1 },
  { id: 13, number: 13, name: "Assis", adminId: 1 },
  { id: 14, number: 14, name: "Fonseca", adminId: 1 },
  { id: 15, number: 15, name: "Dos Santos", adminId: 1 },
  { id: 16, number: 16, name: "Daniel", adminId: 1 },
  { id: 17, number: 17, name: "Davi", adminId: 1 },
  { id: 18, number: 18, name: "Silva", adminId: 1 },
  { id: 19, number: 19, name: "Junior", adminId: 1 },
  { id: 20, number: 20, name: "Dorta", adminId: 1 },
  { id: 21, number: 21, name: "Eduardo", adminId: 1 },
  { id: 22, number: 22, name: "Ribeiro", adminId: 1 },
  { id: 23, number: 23, name: "Levi", adminId: 1 },
  { id: 24, number: 24, name: "Flávio", adminId: 1 },
  { id: 25, number: 25, name: "Felipe", adminId: 1 },
  { id: 26, number: 26, name: "Reis", adminId: 1 },
  { id: 27, number: 27, name: "Montagnana", adminId: 1 },
  { id: 28, number: 28, name: "Araújo", adminId: 1 },
  { id: 29, number: 29, name: "Guilherme", adminId: 1 },
  { id: 30, number: 30, name: "Fuscaldo", adminId: 1 },
  { id: 31, number: 31, name: "Vasconcelos", adminId: 1 },
  { id: 32, number: 32, name: "Domingues", adminId: 1 },
  { id: 33, number: 33, name: "Almeida", adminId: 1 },
  { id: 34, number: 34, name: "Zanella", adminId: 1 },
  { id: 35, number: 35, name: "Gustavo", adminId: 1 },
  { id: 36, number: 36, name: "Higor", adminId: 1 },
  { id: 37, number: 37, name: "Isaac", adminId: 1 },
  { id: 38, number: 38, name: "Jadiel", adminId: 1 },
  { id: 39, number: 39, name: "Belarmino", adminId: 1 },
  { id: 40, number: 40, name: "Marcondes", adminId: 1 },
  { id: 41, number: 41, name: "Camargo", adminId: 1 },
  { id: 42, number: 42, name: "Modesto", adminId: 1 },
  { id: 43, number: 43, name: "Leme", adminId: 1 },
  { id: 44, number: 44, name: "Barbosa", adminId: 1 },
  { id: 45, number: 45, name: "Salles", adminId: 1 },
  { id: 46, number: 46, name: "Kayky", adminId: 1 },
  { id: 47, number: 47, name: "Kevin", adminId: 1 },
  { id: 48, number: 48, name: "Rocha", adminId: 1 },
  { id: 49, number: 49, name: "Santos", adminId: 1 },
  { id: 50, number: 50, name: "Rizzardo", adminId: 1 },
  { id: 52, number: 52, name: "Visentin", adminId: 1 },
  { id: 53, number: 53, name: "De Souza", adminId: 1 },
  { id: 54, number: 54, name: "Damaceno", adminId: 1 },
  { id: 55, number: 55, name: "Lucas", adminId: 1 },
  { id: 56, number: 56, name: "Da Silva", adminId: 1 },
  { id: 57, number: 57, name: "Amaral", adminId: 1 },
  { id: 58, number: 58, name: "Morales", adminId: 1 },
  { id: 59, number: 59, name: "Franco", adminId: 1 },
  { id: 60, number: 60, name: "Fernando", adminId: 1 },
  { id: 61, number: 61, name: "Dentello", adminId: 1 },
  { id: 62, number: 62, name: "Siqueira", adminId: 1 },
  { id: 63, number: 63, name: "Ikeda", adminId: 1 },
  { id: 64, number: 64, name: "Marcello", adminId: 1 },
  { id: 65, number: 65, name: "Kauã", adminId: 1 },
  { id: 66, number: 66, name: "Oliveira", adminId: 1 },
  { id: 67, number: 67, name: "Augusto", adminId: 1 },
  { id: 68, number: 68, name: "Góis", adminId: 1 },
  { id: 69, number: 69, name: "Cavalcante", adminId: 1 },
  { id: 70, number: 70, name: "Bonafá", adminId: 1 },
  { id: 71, number: 71, name: "Moraes", adminId: 1 },
  { id: 72, number: 72, name: "Rodrigues", adminId: 1 },
  { id: 73, number: 73, name: "Carvalho", adminId: 1 },
  { id: 74, number: 74, name: "Angrisanis", adminId: 1 },
  { id: 75, number: 75, name: "Souza", adminId: 1 },
  { id: 76, number: 76, name: "Galasso", adminId: 1 },
  { id: 77, number: 77, name: "Lopes", adminId: 1 },
  { id: 78, number: 78, name: "Nilton", adminId: 1 },
  { id: 79, number: 79, name: "Zambellini", adminId: 1 },
  { id: 80, number: 80, name: "Paulo", adminId: 1 },
  { id: 81, number: 81, name: "Miranda", adminId: 1 },
  { id: 82, number: 82, name: "Pedro", adminId: 1 },
  { id: 83, number: 83, name: "Vieira", adminId: 1 },
  { id: 84, number: 84, name: "Moreno", adminId: 1 },
  { id: 85, number: 85, name: "Pellicciaro", adminId: 1 },
  { id: 86, number: 86, name: "Ramon", adminId: 1 },
  { id: 87, number: 87, name: "Massoni", adminId: 1 },
  { id: 88, number: 88, name: "Renan", adminId: 1 },
  { id: 89, number: 89, name: "Ronaldo", adminId: 1 },
  { id: 90, number: 90, name: "Pereira", adminId: 1 },
  { id: 91, number: 91, name: "Nicodemos", adminId: 1 },
  { id: 92, number: 92, name: "Thiago", adminId: 1 },
  { id: 93, number: 93, name: "Pinheiro", adminId: 1 },
  { id: 94, number: 94, name: "Ferreira", adminId: 1 },
  { id: 95, number: 95, name: "Battaza", adminId: 1 },
  { id: 96, number: 96, name: "Victor", adminId: 1 },
  { id: 97, number: 97, name: "Latorre", adminId: 1 },
  { id: 98, number: 98, name: "Vinícius", adminId: 1 },
  { id: 99, number: 99, name: "Taka", adminId: 1 },
  { id: 100, number: 100, name: "Yuri", adminId: 1 },
];

async function main() {
  console.log("Iniciando seed de Administradores...");
  for (const admin of adminData) {
    const user = await prisma.admin.upsert({
      where: { id: admin.id },
      update: {},
      create: admin,
    });
    console.log(`-> Administrador ${user.name} criado/verificado.`);
  }

  console.log("\nIniciando seed dos atiradores...");
  for (const atirador of atiradorData) {
    const user = await prisma.atirador.upsert({
      where: { id: atirador.id },
      update: {},
      create: atirador,
    });
    console.log(`-> Atirador ${user.name} (ID: ${user.id}) criado/verificado.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("\nSeed finalizado.");
    await prisma.$disconnect();
  });