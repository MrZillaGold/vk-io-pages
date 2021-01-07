import { API, MessageContext, MessageEventContext } from "vk-io";

import { PagesBuilder } from "../PagesBuilder";

export interface IPagesBuilderOptions {
    api?: API | null;
    context: MessageContext | MessageEventContext;
}

export type PagesStorage = Map<string, PagesBuilder>;
