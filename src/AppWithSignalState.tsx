import { MouseEventHandler } from "react";
import { effect, state } from "../nebula/signal";

export const AppWithSignalState = () => {
  const name = state("");
  const count = state(0);

  const handleCount: MouseEventHandler<HTMLButtonElement> = () => {
    count.set(count.get() + 1);
  };

  return (
    <div style={{ padding: 10 }}>
      <div>
        <input
          type="text"
          placeholder="Set your name"
          onInput={(event) => {
            name.set(event.currentTarget.value);
          }}
          value={name.get()}
        >
          Hi
        </input>
        <button onClick={handleCount}>Increase Counter</button>
      </div>
      <div>
        <div>Hi my name is {name.get()}</div>
        <div>Counter: {count.get()}</div>
        {count.get() > 10 && <div>Fuck you!</div>}
      </div>
      <ChildApp name={name.get()} count={count.get()} />
    </div>
  );
};

const ChildApp = ({ name, count }: { name: string; count: number }) => {
  return (
    <div>
      <div>Hi my name is {name}</div>
      <div>Counter: {count}</div>
      {count > 10 && <div>Fuck you!</div>}
    </div>
  );
};
