import { renderObserver } from "./render/render-observer";

export type ComponentContext = {
  hookIndex: number;
  hooks: any[];
  effects: (() => void)[];
};

let currentContext: ComponentContext = {
  hookIndex: 0,
  hooks: [],
  effects: [],
};

export function setCurrentContext(newCurrentContext: ComponentContext) {
  currentContext = { ...newCurrentContext };
}

export function state<T>(initial: T): [T, (value: T) => void] {
  const idx = currentContext.hookIndex++;

  if (!currentContext.hooks[idx]) {
    currentContext.hooks[idx] = initial;
  }

  const setState = (newVal: T) => {
    currentContext.hooks[idx] = newVal;
    renderObserver.update();
  };

  return [currentContext.hooks[idx], setState] as const;
}

export function effect(fn: () => void | (() => void), deps?: any[]) {
  const idx = currentContext.hookIndex++;

  if (!currentContext.hooks[idx]) {
    currentContext.hooks[idx] = { deps: undefined, cleanup: undefined };
  }

  const effectState = currentContext.hooks[idx];
  const hasChanged =
    !deps || deps.some((dep, i) => dep !== effectState.deps?.[i]);

  if (hasChanged) {
    // Save the effect for later execution after render
    currentContext.effects.push(() => {
      // Run cleanup first
      if (typeof effectState.cleanup === "function") {
        effectState.cleanup();
      }

      const cleanup = fn();
      if (typeof cleanup === "function") {
        effectState.cleanup = cleanup;
      }

      effectState.deps = deps;
    });
  }
}
