import * as React from "react";
import { useHydrated } from "~/lib/remix-utils";

type Props = {
  children(): React.ReactNode;
  fallback?: React.ReactNode;
};

function once(fn: Props["children"]): Props["children"] {
  let ret: ReturnType<Props["children"]> | null = null;
  return () => {
    if (ret) return ret;
    ret = fn();
    return ret;
  };
}

export function ClientOnly({ children, fallback = null }: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const call = React.useCallback(once(children), [children]);
  return useHydrated() ? <>{call()}</> : <>{fallback}</>;
}
