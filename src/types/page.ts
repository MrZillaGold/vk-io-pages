import { Context, IMessageContextSendOptions } from 'vk-io';

import { IPagesBuilderOptions } from './builder';
import { FunctionalKeyboard } from './keyboard';

export type ExtendedMessageContextOptions = IMessageContextSendOptions & {
    keyboard?: FunctionalKeyboard
};

export type StringPage = string;
export type ObjectPage = ExtendedMessageContextOptions;
export type FunctionPage<C extends Context = Context> = (context: IPagesBuilderOptions<C>['context']) => (
    StringPage
    | ObjectPage
    | Promise<ObjectPage | StringPage>
);

export type Page = StringPage | ObjectPage | FunctionPage;

export enum PageSendMethod {
    SEND = 'send',
    EDIT = 'editMessage'
}
export type PageSendMethodUnion = `${PageSendMethod}`;

export interface IAutoGeneratePagesOptions {
    items: (string | number)[];
    countPerPage?: number;
}
