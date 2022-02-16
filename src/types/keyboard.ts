import { KeyboardBuilder } from 'vk-io';

import { IPagesBuilderOptions } from './builder';

export enum DefaultButtonAction {
    FIRST = 'first',
    BACK = 'back',
    STOP = 'stop',
    NEXT = 'next',
    LAST = 'last'
}
export type DefaultButtonActionUnion = `${DefaultButtonAction}`;
export type DefaultButtonLabel = string;
export type DefaultButtonsMap = Map<DefaultButtonAction | DefaultButtonActionUnion, DefaultButtonLabel>;

export enum DefaultButtonsType {
    TEXT = 'text',
    CALLBACK = 'callback'
}
export type DefaultButtonsTypeUnion = `${DefaultButtonsType}`;

export interface ISetDefaultButtonsOptions {
    buttons?: (DefaultButtonAction | DefaultButtonActionUnion)[];
    type?: DefaultButtonsType | DefaultButtonsTypeUnion;
}

export type FunctionalKeyboard = KeyboardBuilder | ((context: IPagesBuilderOptions['context']) => KeyboardBuilder);
