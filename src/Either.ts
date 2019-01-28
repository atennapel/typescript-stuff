export default abstract class Either<E, T> {

  static left<E, T>(err: E) { return new Left<E, T>(err) }
  static right<E, T>(val: T) { return new Right<E, T>(val) }
  static of<E, T>(val: T | null | undefined, err: E): Either<E, T> {
    return typeof val === 'undefined' || val === null ?
      Either.left<E, T>(err) : Either.right(val);
  }

  abstract toString(): string;

  abstract map<R>(fn: (val: T) => R): Either<E, R>;

}

export class Left<E, T> extends Either<E, T> {

  constructor(public readonly error: E) { super() }

  toString() { return `Left(${this.error})` }

  map<R>(fn: (val: T) => R): Either<E, R> {
    return this as any as Either<E, R>;
  }

}

export class Right<E, T> extends Either<E, T> {

  constructor(public readonly value: T) { super() }

  toString() { return `Right(${this.value})` }

  map<R>(fn: (val: T) => R): Either<E, R> {
    return new Right(fn(this.value));
  }

}
