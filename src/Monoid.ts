import Semigroup from "./Semigroup";

// witnesses a monoid structure on type T
export default class Monoid<T> extends Semigroup<T> {

  constructor(
    public readonly append: (a: T, b: T) => T,
    public readonly unit: () => T,
  ) { super(append) }

  fold(a: T[]): T {
    return a.reduce(this.append, this.unit());
  }

}

export const addition = new Monoid((x, y) => x + y, () => 0);
export const multiplication = new Monoid((x, y) => x * y, () => 1);
