import { API, Context } from 'vk-io';

import { PagesBuilder } from '../builder';
import { PagesContext } from './manager';

export interface IPagesBuilderOptions<C extends Context = Context> {
    api?: API;
    context: PagesContext<C>;
}

export type PagesStorage = Map<string, PagesBuilder>;
