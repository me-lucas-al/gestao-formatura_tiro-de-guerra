export class MoneyValueObject {
  constructor(private readonly value: number) {
    if (!Number.isFinite(value)) {
      throw new Error("Money value must be finite");
    }

    if (value < 0) {
      throw new Error("Money value must not be negative");
    }
  }

  add(other: MoneyValueObject): MoneyValueObject {
    return new MoneyValueObject(this.value + other.value);
  }

  toPrimitive(): number {
    return this.value;
  }
}
