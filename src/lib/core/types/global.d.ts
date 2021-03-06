import type {
  VNode,
  VNodeChild,
  ComponentPublicInstance,
  FunctionalComponent,
  PropType as VuePropType
} from "vue";

declare global {
  // declare interface Window {
  //   // Global vue app instance
  // }

  // vue
  type PropType<T> = VuePropType<T>;
  type VueNode = VNodeChild | JSX.Element;

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  type Nullable<T> = T | null;
  //type NonNullable<T> = T extends null | undefined ? never : T;
  type Recordable<T = any> = Record<string, T>;
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T;
  };
  type Indexable<T = any> = {
    [key: string]: T;
  };
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  type TimeoutHandle = ReturnType<typeof setTimeout>;
  type IntervalHandle = ReturnType<typeof setInterval>;

  interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  interface WheelEvent {
    path?: EventTarget[];
  }

  function parseInt(s: string | number, radix?: number): number;

  function parseFloat(string: string | number): number;
}

declare module "vue" {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;
}
