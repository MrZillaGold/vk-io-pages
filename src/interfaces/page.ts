import { IMessageContextSendOptions } from "vk-io";

import { IPagesBuilderOptions } from "./pagesBuilder";
import { FunctionalKeyboard } from "./keyboard";

type ExtendedMessageContextOptions = IMessageContextSendOptions & {
    keyboard?: FunctionalKeyboard
};

export type StringPage = string;
export type ObjectPage = ExtendedMessageContextOptions;
export type FunctionPage = (context: IPagesBuilderOptions["context"]) => StringPage | ObjectPage | Promise<ObjectPage | StringPage>;

export type Page = StringPage | ObjectPage | FunctionPage;
export type PageSentMethod = "send_new" | "edit";

export interface IAutoGeneratePagesOptions {
    items: string[];
    countPerPage?: number;
}
