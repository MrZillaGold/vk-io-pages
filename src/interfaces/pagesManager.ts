import { IPagesBuilderOptions } from "./pagesBuilder";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPagesManagerOptions {}

export type Middleware = (context: IPagesBuilderOptions["context"], next: () => void) => unknown;
export type Fallback = ((context: IPagesBuilderOptions["context"], next: () => void) => unknown) | null;
