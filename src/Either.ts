export default abstract class Either<E, T> {

  static left<E, T>(err: E) { return new Left<E, T>(err) }
  static right<E, T>(val: T) { return new Right<E, T>(val) }
  static of<E, T>(val: T | null | undefined, err: E): Either<E, T> {
    return typeof val === 'undefined' || val === null ?
      Either.left<E, T>(err) : Either.right(val);
  }

  abstract toString(): string;

  abstract map<R>(fn: (val: T) => R): Either<E, R>;
  abstract map2<E2, T2, R>(fn: (val: T, val2: T2) => R, other: Either<E2, T2>): Either<E | E2, R>;
  abstract chain<E2, R>(fn: (val: T) => Either<E2, R>): Either<E | E2, R>;

  abstract or<E2, T2>(other: Either<E2, T2>): Either<E | E2, T | T2>;

}

export class Left<E, T> extends Either<E, T> {

  constructor(public readonly error: E) { super() }

  toString() { return `Left(${this.error})` }

  map<R>(fn: (val: T) => R): Either<E, R> {
    return this as any as Either<E, R>;
  }
  map2<E2, T2, R>(fn: (val: T, val2: T2) => R, other: Either<E2, T2>): Either<E | E2, R> {
    return this as any as Either<E | E2, R>;

  }
  chain<E2, R>(fn: (val: T) => Either<E2, R>): Either<E | E2, R> {
    return this as any as Either<E | E2, R>;
  }

  or<E2, T2>(other: Either<E2, T2>): Either<E | E2, T | T2> {
    return other;
  }

}

export class Right<E, T> extends Either<E, T> {

  constructor(public readonly value: T) { super() }

  toString() { return `Right(${this.value})` }

  map<R>(fn: (val: T) => R): Either<E, R> {
    return new Right(fn(this.value));
  }
  map2<E2, T2, R>(fn: (val: T, val2: T2) => R, other: Either<E2, T2>): Either<E | E2, R> {
    return other instanceof Left ?
      other as any as Either<E | E2, R> :
      new Right(fn(this.value, (other as any).value));

  }
  chain<E2, R>(fn: (val: T) => Either<E2, R>): Either<E | E2, R> {
    return fn(this.value);
  }

  or<E2, T2>(other: Either<E2, T2>): Either<E | E2, T | T2> {
    return this;
  }

}
