import { KeyboardBuilder } from "vk-io";

import { IPagesBuilderOptions } from "./pagesBuilder";

export type DefaultButtonAction = "first" | "back" | "stop" | "next" | "last";
export type DefaultButtonLabel = "⏪" | "◀️" | "⏹" | "▶️" | "⏩";
export type DefaultButtonsMap = Map<DefaultButtonAction, DefaultButtonLabel>;

export interface ISetDefaultButtonsOptions {
    buttons?: DefaultButtonAction[];
    type?: "text" | "callback";
}

export type FunctionalKeyboard = KeyboardBuilder | ((context: IPagesBuilderOptions["context"]) => KeyboardBuilder);
