import { API } from "vk-io";

import { IPagesBuilderOptions } from "./pagesBuilder";

export interface IPagesManagerOptions {
    api?: API | null;
}

export type Middleware = (context: IPagesBuilderOptions["context"], next: () => void) => unknown;
export type Fallback = ((context: IPagesBuilderOptions["context"], next: () => void) => unknown) | null;
