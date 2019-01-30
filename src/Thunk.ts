export type Trampoline<T> = T | { value: Trampoline<T> };

export default class Thunk<T> {

  private forced = false;
  public value!: T;

  constructor(
    private readonly thunk: () => T,
  ) {}

  static of<T>(val: T) { return new Thunk(() => val) }

  static trampoline<T>(fn: (val: T) => Trampoline<T>): (val: T) => T {
    return (val: T) => {
      let c = fn(val);
      while (c instanceof Thunk) {
        c = c.force();
      }
      return c as T;
    };
  }

  force(): T {
    if (!this.forced) {
      this.forced = true;
      this.value = this.thunk();
    }
    return this.value;
  }

  map<R>(fn: (val: T) => R): Thunk<R> {
    return new Thunk(() => fn(this.force()));
  }
  map2<T2, R>(fn: (val: T, val2: T2) => R, other: Thunk<T2>): Thunk<R> {
    return new Thunk(() => fn(this.force(), other.force()));
  }
  chain<R>(fn: (val: T) => Thunk<R>): Thunk<R> {
    return new Thunk(() => fn(this.force()).force());
  }

}
