import { Context } from "vk-io";

import { PagesBuilder } from "../PagesBuilder";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPagesManagerOptions {}

export type Middleware = (context: IContext, next: () => void) => unknown;
export type Fallback = ((context: IContext, next: () => void) => unknown) | null;

export interface IContext extends Context {
    pagesBuilder: () => PagesBuilder;
    /**
     * @deprecated Используйте pagesBuilder
     */
    pageBuilder: () => PagesBuilder;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
