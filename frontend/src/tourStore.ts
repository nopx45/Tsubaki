// useTourRefStore.ts
import { create } from "zustand";
import { TourProps } from "antd";

type TourRefMap = Record<string, React.RefObject<HTMLElement>>;

export const useTourRefStore = create<{
  refs: TourRefMap;
  registerRef: (key: string, ref: React.RefObject<HTMLElement>) => void;
}>((set) => ({
  refs: {},
  registerRef: (key, ref) =>
    set((state) => ({
      refs: {
        ...state.refs,
        [key]: ref,
      },
    })),
}));

export const useTourStore = create<{
  open: boolean;
  steps: TourProps["steps"];
  startTour: (steps: TourProps["steps"]) => void;
  stopTour: () => void;
}>((set) => ({
  open: false,
  steps: [],
  startTour: (steps) => set({ open: true, steps }),
  stopTour: () => set({ open: false, steps: [] }),
}));
