import { PersonNameSchema } from "../dto/identity.schema";

export class PersonNameValueObject {
  constructor(private readonly value: string) {
    PersonNameSchema.parse(value);
  }

  equals(other: PersonNameValueObject): boolean {
    return this.value === other.value;
  }

  toPrimitive(): string {
    return this.value;
  }
}
