import Semigroup from "./Semigroup";
import List from "./List";
import Maybe from "./Maybe";
import Thunk from "./Thunk";

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
export const concatenation = <T>() => new Monoid<T[]>((a, b) => a.concat(b), () => []);
export const composition = <T>() => new Monoid<Endo<T>>((a, b) => x => a(b(x)), () => x => x);
export const appending = <T>() => new Monoid<List<T>>((a, b) => a.append(b), () => List.nil());
export const maybeFirst = <T>() => new Monoid<Maybe<T>>((a, b) => a.or(b), () => Maybe.nothing());
export const thunkMonoid = <T>(monT: Monoid<T>) => new Monoid<Thunk<T>>(
  (a, b) => a.map2((x, y) => monT.append(x, y), b),
  () => new Thunk(monT.unit)
);
