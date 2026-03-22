import { IdentifierSchema } from "../dto/identity.schema";

export class IdentifierValueObject {
  constructor(private readonly value: number) {
    IdentifierSchema.parse(value);
  }

  equals(other: IdentifierValueObject): boolean {
    return this.value === other.value;
  }

  toPrimitive(): number {
    return this.value;
  }
}
