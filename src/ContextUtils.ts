import { IMessageContextSendOptions, MessageContext } from "vk-io";

import { PagesBuilder } from "./PagesBuilder";

import { IPagesBuilderOptions, IContext } from "./interfaces";

export class ContextUtils {

    builder: PagesBuilder;

    constructor(builder: PagesBuilder) {
        this.builder = builder;
    }

    markAsRead(context: IContext): void {
        context["api"].messages.markAsRead({
            peer_id: context.peerId
        })
            .catch(() => null);
    }

    editMessage(messageParams: IMessageContextSendOptions, event = ""): void | Promise<MessageContext> {
        const context: IPagesBuilderOptions["context"] | null = this.builder.sentContext;

        if (context) {
            if (this.builder.sendMethod !== "send_new") {
                return context.editMessage(messageParams)
                    .catch((error: any) => {
                        if (error?.code === 909) {
                            return context.send(messageParams)
                                .then((context: IContext) => {
                                    this.builder.sentContext = context;

                                    this.builder.saveContext();

                                    return context;
                                });
                        }

                        throw error;
                    });
            } else {
                if (event !== "stop") {
                    return context.send(messageParams)
                        .then((context: IContext) => {
                            this.builder.sentContext = context;

                            this.builder.saveContext();

                            return context;
                        });
                }
            }
        }
    }
}
