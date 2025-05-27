// useRegisterTourRef.ts
import { useTourRefStore } from "../tourStore";
import { useEffect } from "react";

export const useRegisterTourRef = (
  key: string,
  ref: React.RefObject<HTMLElement>
) => {
  const { registerRef } = useTourRefStore();

  useEffect(() => {
    registerRef(key, ref);
  }, [key, ref, registerRef]);
};
