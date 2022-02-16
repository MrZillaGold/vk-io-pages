import { APIError, APIErrorCode, IMessageContextSendOptions, MessageContext } from 'vk-io';

import { PagesBuilder } from '../builder';

import { PagesContext, PageSendMethod } from '../types';

export function editMessage(builder: PagesBuilder, messageParams: IMessageContextSendOptions, isStop?: boolean): Promise<Awaited<any> | void> {
    const context = builder.sent;

    const isSendMethod = builder.sendMethod === PageSendMethod.SEND;

    if (!context || (isSendMethod && isStop)) {
        return Promise.resolve();
    }

    return context[builder.sendMethod](messageParams)
        .then((context) => {
            if (isSendMethod && typeof context !== 'number') {
                builder.sent = context as PagesContext<MessageContext>;

                builder.saveContext();
            }

            return context;
        })
        .catch((error?: APIError) => {
            if (error?.code === APIErrorCode.MESSAGES_EDIT_EXPIRED) {
                return context.send(messageParams)
                    .then((context) => {
                        builder.sent = context;
                        builder.saveContext();

                        return context;
                    });
            }

            throw error;
        });
}
