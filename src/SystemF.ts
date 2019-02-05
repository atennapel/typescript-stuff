// minimal Hindley-Milner implementation
type Type = TConst | TVar | TMeta | TFun;
interface TConst { tag: 'TConst'; name: string }
interface TVar { tag: 'TVar'; id: number }
interface TMeta { tag: 'TMeta'; type: Type | null }
interface TFun { tag: 'TFun'; left: Type; right: Type }
const TConst = (name: string): TConst => ({ tag: 'TConst', name });
const TVar = (id: number): TVar => ({ tag: 'TVar', id });
const TMeta = (): TMeta => ({ tag: 'TMeta', type: null });
const TFun = (left: Type, right: Type): TFun => ({ tag: 'TFun', left, right });

const prune = (t: Type): Type => {
  if (t.tag === 'TMeta') {
    t.type = t.type && prune(t.type);
    return t.type || t;
  }
  if (t.tag === 'TFun') return TFun(prune(t.left), prune(t.right));
  return t;
};
const occurs = (a: TMeta, b: Type): boolean => {
  if (a === b) return true;
  if (b.tag === 'TFun') return occurs(a, b.left) || occurs(a, b.right);
  return false;
};
const bind = (a: TMeta, b: Type): void => {
  if (occurs(a, b)) throw new TypeError(`occurs check failed`);
  a.type = b;
};
const unify = (a_: Type, b_: Type): void => {
  const a = prune(a_);
  const b = prune(b_);
  if (a === b) return;
  if (a.tag === 'TMeta') return bind(a, b);
  if (b.tag === 'TMeta') return bind(b, a);
  if (a.tag === 'TFun' && b.tag === 'TFun') {
    unify(a.left, b.left);
    unify(a.right, b.right);
    return;
  }
  throw new TypeError(`failed to unify`);
};

type Expr = Var | Abs | App;
interface Var { tag: 'Var'; name: string }
interface Abs { tag: 'Abs'; arg: string; body: Expr }
interface App { tag: 'App'; left: Expr; right: Expr }
export const Var = (name: string): Var => ({ tag: 'Var', name });
export const Abs = (arg: string, body: Expr): Abs => ({ tag: 'Abs', arg, body });
export const App = (left: Expr, right: Expr): App => ({ tag: 'App', left, right });

type Env = Map<string, Type>;

const inst = (t: Type, m: Map<number, TMeta> = new Map()): Type => {
  if (t.tag === 'TVar') {
    const x = m.get(t.id);
    if (x) return x;
    const n = TMeta();
    m.set(t.id, n);
    return n;
  }
  if (t.tag === 'TFun') return TFun(inst(t.left, m), inst(t.right, m));
  return t;
};
const inferR = (env: Env, e: Expr): Type => {
  if (e.tag === 'Var') {
    const t = env.get(e.name);
    if (!t) throw new TypeError(`undefined var ${e.name}`);
    return inst(t);
  }
  if (e.tag === 'Abs') {
    const old = env.get(e.arg);
    const x = TMeta();
    env.set(e.arg, x);
    const y = inferR(env, e.body);
    if (old) env.set(e.arg, old);
    else env.delete(e.arg);
    return TFun(x, y);
  }
  if (e.tag === 'App') {
    const l = inferR(env, e.left);
    const r = inferR(env, e.right);
    const x = TMeta();
    unify(l, TFun(r, x));
    return x;
  }
  throw new TypeError('impossible');
};

const gen = (t: Type, m: Map<TMeta, TVar> = new Map(), i = { i: 0 }): Type => {
  if (t.tag === 'TMeta') {
    const x = m.get(t);
    if (x) return x;
    const n = TVar(i.i++);
    m.set(t, n);
    return n;
  }
  if (t.tag === 'TFun') return TFun(gen(t.left, m, i), gen(t.right, m, i));
  return t;
};
export const infer = (e: Expr, env: Env = new Map()): Type => gen(prune(inferR(env, e)));
