// witnesses a semigroup structure on type T
export default class Semigroup<T> {

  constructor(
    public readonly append: (a: T, b: T) => T,
  ) {}

}
