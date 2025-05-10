import { renderObserver } from "./render/render-observer";

// A global to track which computation is currently running
let currentComputation: (() => void) | null = null;

type Signal<T> = {
  get: () => T;
  set: (value: T) => void;
};

export function state<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<() => void>();

  function get() {
    if (currentComputation) {
      subscribers.add(currentComputation);
    }
    return value;
  }

  function set(newValue: T) {
    if (value !== newValue) {
      value = newValue;
      subscribers.forEach(fn => fn());
      renderObserver.update();
    }
  }

  return { get, set };
}

// Utility to create reactive computations
export function effect(fn: () => void) {
  const run = () => {
    currentComputation = run;
    fn();
    currentComputation = null;
  };
  run();
}