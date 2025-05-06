import { JSX } from "react/jsx-runtime";

export interface ActivitiesInterface {
    [x: string]: any;
    slice(arg0: number): unknown;
    map(arg0: (activity: any) => JSX.Element): import("react").ReactNode | Iterable<import("react").ReactNode>;
    ID?: number;
    title?: string;
    content?: string;
    Image?: string;
    image?: string;
    created_at?: string;
  }