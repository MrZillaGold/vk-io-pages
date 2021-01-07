import { PagesBuilder } from "./PagesBuilder";

import { IMessageContextSendOptions, MessageContext } from "vk-io";
import { IPagesBuilderOptions } from "./interfaces/pagesBuilder";

export class ContextUtils {

    builder: PagesBuilder;

    constructor(builder: PagesBuilder) {
        this.builder = builder;
    }

    _markAsRead(context: MessageContext) {
        const api = this.builder._api;

        if (api) {
            api.messages.markAsRead({
                peer_id: context.peerId
            })
                .catch(() => {});
        }
    }

    _editMessage(messageParams: IMessageContextSendOptions, event = "") {
        const context: IPagesBuilderOptions["context"] | null = this.builder.sentContext;

        if (context) {
            if (this.builder.sendMethod !== "send_new") {
                return context.editMessage(messageParams)
                    .catch((error: any) => {
                        if (error?.code === 909) {
                            return context.send(messageParams)
                                .then((context: MessageContext) => {
                                    this.builder.sentContext = context;

                                    this.builder._saveContext();
                                });
                        }

                        throw error;
                    });
            } else {
                if (event !== "stop") {
                    return context.send(messageParams)
                        .then((context: MessageContext) => {
                            this.builder.sentContext = context;

                            this.builder._saveContext();
                        });
                }
            }
        }
    }
}
