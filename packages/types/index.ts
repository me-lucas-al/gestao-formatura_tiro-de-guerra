import { Prisma } from "@prisma/client";

export type AtiradorWithRelations = Prisma.AtiradorGetPayload<{
  include: {
    payment: true;
    familyMembers: {
      include: {
        payment: true;
      };
    };
    admin: true;
  };
}>;

export type FamilyMemberWithRelations = Prisma.FamilyMemberGetPayload<{
  include: {
    payment: true;
    atirador: true;
  };
}>;
