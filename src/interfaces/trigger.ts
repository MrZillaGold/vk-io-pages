import { IPagesBuilderOptions } from "./pagesBuilder";

export interface ITrigger {
    name: "string";
    callback: (context: IPagesBuilderOptions["context"]) => void;
}

export type TriggersMap = Map<ITrigger["name"], ITrigger["callback"]>;
