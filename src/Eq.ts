// witnesses that two types are equal
export default class Eq<A, B> {
  private constructor() {};

  static refl<T>(): Eq<T, T> {
    return new Eq<T, T>();
  }

  cast(val: A): B {
    return val as any as B;
  }

  symm(): Eq<B, A> {
    return this as any as Eq<B, A>;
  }
  trans<C>(other: Eq<B, C>): Eq<A, C> {
    return this as any as Eq<A, C>;
  }
}
