import { JSX as LocalJSX } from "@ionic/core";
import { JSX as IoniconsJSX } from "ionicons";
import { HTMLAttributes, ReactText } from "react";
import IonicIntrinsicElements = LocalJSX.IntrinsicElements;
import IoniconsIntrinsicElements = IoniconsJSX.IntrinsicElements;

type ToReact<T> = {
  [P in keyof T]?: T[P] &
    Omit<HTMLAttributes<Element>, "className"> & {
      class?: string;
      key?: ReactText;
    };
};

declare global {
  export namespace JSX {
    interface IntrinsicElements
      extends ToReact<IonicIntrinsicElements & IoniconsIntrinsicElements> {
      key?: string;
    }
  }
}
