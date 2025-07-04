import { useEffect } from "react";

export const useDebouncedEffect = (effect, deps, delay, returnFunc) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => {
      returnFunc && returnFunc();
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};
// 377880 oldm 27000
// 490200 oldm 36800
