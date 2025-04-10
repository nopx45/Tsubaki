import { JSX } from "react/jsx-runtime";

export interface ActivitiesInterface {
    slice(arg0: number): unknown;
    map(arg0: (activity: any) => JSX.Element): import("react").ReactNode | Iterable<import("react").ReactNode>;
    ID?: number;
    title?: string;
    content?: string;
    Image?: string;
    created_at?: string;
  }