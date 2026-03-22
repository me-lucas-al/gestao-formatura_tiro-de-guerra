import { YearSchema } from "../dto/identity.schema";

export class YearValueObject {
  constructor(private readonly value: number) {
    YearSchema.parse(value);
  }

  isAfter(other: YearValueObject): boolean {
    return this.value > other.value;
  }

  toPrimitive(): number {
    return this.value;
  }
}
