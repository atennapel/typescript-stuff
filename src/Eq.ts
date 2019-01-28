// witnesses that two types are equal
export default class Eq<A, B> {
  private constructor() {};

  static refl<T>(): Eq<T, T> {
    return new Eq<T, T>();
  }

  symm(): Eq<B, A> {
    return this as Eq<B, A>;
  }
  trans<C>(other: Eq<B, C>): Eq<A, C> {
    return this as Eq<A, C>;
  }
}
