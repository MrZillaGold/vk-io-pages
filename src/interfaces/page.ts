import { IMessageContextSendOptions } from "vk-io";

import { IPagesBuilderOptions } from "./pagesBuilder";

export type StringPage = string;
export type ObjectPage = IMessageContextSendOptions;
export type FunctionPage = (context: IPagesBuilderOptions["context"]) => StringPage | ObjectPage;

export type Page = StringPage | ObjectPage | FunctionPage;
export type PageSentMethod = "send_new" | "edit";
