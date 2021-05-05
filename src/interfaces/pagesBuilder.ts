import { API } from "vk-io";

import { PagesBuilder } from "../PagesBuilder";
import { IContext } from "./pagesManager";

export interface IPagesBuilderOptions {
    api?: API | null;
    context: IContext;
}

export type PagesStorage = Map<string, PagesBuilder>;
