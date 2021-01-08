import { IPagesBuilderOptions } from "./pagesBuilder";

export interface ITrigger {
    name: "string";
    callback: (context: IPagesBuilderOptions["context"]) => unknown;
}

export type TriggersMap = Map<ITrigger["name"], ITrigger["callback"]>;
