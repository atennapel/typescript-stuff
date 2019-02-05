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

interface Command<T, P, A> {
  type: T;
  payload: P;
  action: A;
}

interface StateMachineDescription<Ss, As, Cs> {
  states:
    { [S in keyof Ss]:
      { [A in keyof As]:
        <R>(k: <NS extends keyof Ss>(
          val: [
            NS,
            (oldstate: State<S, Ss[S]>, action: Action<A, As[A]>) => Ss[NS],
            Cs[]
          ]
        ) => R) => R } };
  initial: States<Ss>;
}

interface StateMachine<Ss, As> {
  state: States<Ss>;
  step: (action: Actions<As>) => void;
};

const createMachine = <Ss, As, Cs>(desc: StateMachineDescription<Ss, As, Cs>): StateMachine<Ss, As> => ({
  state: desc.initial,
  step: function(action) {
    const [ns, update, commands] = desc.states[this.state.state][action.type]((
      val: [
        keyof Ss,
        (oldstate: States<Ss>, action: Actions<As>) => Ss[keyof Ss],
        Cs[]
      ]
    ): [keyof Ss, (oldstate: States<Ss>, action: Actions<As>) => Ss[keyof Ss], Cs[]] => val);
    const newdata = update(this.state, action);
    this.state = { state: ns, data: newdata };
  },
});

// testing
interface TestStates {
  Inc: number;
  Error: string;
}
interface TestActions {
  inc: void;
  fail: string;
}
interface TestCommands {
  Timeout: number;
}
type SMD = StateMachineDescription<TestStates, TestActions, TestCommands>;
type SM = StateMachine<TestStates, TestActions>;
const desc: SMD = {
  states: {
    Inc: {
      inc: k => k(['Inc', st => st.data + 1, []]),
      fail: k => k(['Error', (_, a) => a.payload, []]),
    },
    Error: {
      inc: k => k(['Error', st => st.data, []]),
      fail: k => k(['Error', (_, a) => a.payload, []]),
    },
  },
  initial: { state: 'Inc', data: 0 },
};
const m: SM = createMachine(desc);
console.log(m);
m.step({ type: 'inc', payload: undefined });
console.log(m);
m.step({ type: 'inc', payload: undefined });
console.log(m);
m.step({ type: 'fail', payload: 'FAIL!' });
console.log(m);
