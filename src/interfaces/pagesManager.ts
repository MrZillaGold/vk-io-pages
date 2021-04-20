import { IPagesBuilderOptions } from "./pagesBuilder";

export interface IPagesManagerOptions {}

export type Middleware = (context: IPagesBuilderOptions["context"], next: () => void) => unknown;
export type Fallback = ((context: IPagesBuilderOptions["context"], next: () => void) => unknown) | null;
