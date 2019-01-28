// witnesses that two types are isomorphic
export default class Iso<A, B> {
  constructor(
    public readonly to: (val: A) => B,
    public readonly from: (val: B) => A,
  ) {};

  static refl<T>(): Iso<T, T> {
    return new Iso<T, T>(x => x, x => x);
  }

  symm(): Iso<B, A> {
    return new Iso<B, A>(this.from, this.to);
  }
  trans<C>(other: Iso<B, C>): Iso<A, C> {
    return new Iso<A, C>(
      x => other.to(this.to(x)),
      x => this.from(other.from(x))
    );
  }
}
