export const renderObserver = (() => {
  let subscriber: (() => void) | undefined;

  return {
    update: () => {
      subscriber?.();
    },
    watch: (callback: () => void) => {
      subscriber = callback;
      callback();
    },
  };
})();
