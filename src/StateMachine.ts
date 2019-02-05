interface State<T, D> {
  state: T;
  data: D;
}
type States<O> = { [K in keyof O]: State<K, O[K]> }[keyof O];

interface Action<T, P> {
  type: T;
  payload: P;
}
type Actions<O> = { [K in keyof O]: Action<K, O[K]> }[keyof O];

interface Command<T, P> {
  type: T;
  payload: P;
}
type Commands<O> = { [K in keyof O]: Command<K, O[K]> }[keyof O];

interface StateMachineDescription<Ss, As, Cs, P> {
  initial: (props: P) => States<Ss>;
  states:
    { [S in keyof Ss]:
      { [A in keyof As]:
        <R>(k: <NS extends keyof Ss>(
          val: [
            NS,
            (oldstate: State<S, Ss[S]>, action: Action<A, As[A]>) => Ss[NS],
            Commands<Cs>[]
          ]
        ) => R) => R } };
}

interface StateMachine<Ss, As> {
  state: States<Ss>;
  step: (action: Actions<As>) => void;
};
type Handler<As, Cs> = (com: Commands<Cs>, done: (action: Actions<As>) => void) => void;

const createMachine = <Ss = {}, As = {}, Cs = {}, P = void>(
  desc: StateMachineDescription<Ss, As, Cs, P>,
  props: P,
  handler: Handler<As, Cs>,
): StateMachine<Ss, As> => ({
  state: desc.initial(props),
  step: function(action) {
    const [ns, update, commands] = desc.states[this.state.state][action.type](
      val => val as [keyof Ss, (s: States<Ss>, a: typeof action) => Ss[keyof Ss], Commands<Cs>[]]);
    const newdata = update(this.state, action);
    console.log(`State change: ${this.state.state} => ${ns}, ${this.state.data} => ${newdata}`);
    this.state = { state: ns, data: newdata };
    const done = this.step.bind(this);
    for (let i = 0, l = commands.length; i < l; i++)
      handler(commands[i], done);
  },
});

interface BasicCommands<As> {
  Timeout: [number, Actions<As>];
}
const Timeout = <As>(amount: number, action: Actions<As>): Command<'Timeout', [number, Actions<As>]> =>
  ({ type: 'Timeout', payload: [amount, action] });

const basicCommandsHandler = <As>(com: Commands<BasicCommands<As>>, done: (action: Actions<As>) => void): void => {
  if (com.type === 'Timeout') {
    setTimeout(() => done(com.payload[1]), com.payload[0]);
  }
};

// testing
interface TestStates {
  Inc: number;
  Error: string;
}
interface TestActions {
  inc: void;
  fail: string;
}
const desc: StateMachineDescription<TestStates, TestActions, BasicCommands<TestActions>, number> = {
  states: {
    Inc: {
      inc: k => k(['Inc', st => st.data + 1, [Timeout(2000, { type: 'fail', payload: 'oops' })]]),
      fail: k => k(['Error', (_, a) => a.payload, []]),
    },
    Error: {
      inc: k => k(['Error', st => st.data, []]),
      fail: k => k(['Error', (_, a) => a.payload, []]),
    },
  },
  initial: n => ({ state: 'Inc', data: n }),
};
const m = createMachine(desc, 0, basicCommandsHandler);
m.step({ type: 'inc', payload: undefined });
