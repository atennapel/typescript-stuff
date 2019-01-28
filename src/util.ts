type Fn<A, B> = (val: A) => B;
type Op<A, B> = Fn<B, A>;
type Endo<T> = Fn<T, T>
