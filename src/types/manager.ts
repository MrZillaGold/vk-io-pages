import { Context } from 'vk-io';

import { PagesBuilder } from '../builder';

export interface IPagesManagerOptions {}

export type Middleware<C extends Context = Context> = (context: PagesContext<C>, next: () => void) => unknown;
export type Fallback<C extends Context = Context> = ((context: PagesContext<C>, next: () => void) => unknown) | null;

export type PagesContext<C extends Context = Context> = ({
    pagesBuilder: () => PagesBuilder;
} & C) | C;
