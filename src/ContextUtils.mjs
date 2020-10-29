export class ContextUtils {

    constructor(builder) {
        this.builder = builder;
    }

    _markAsRead(context) {
        const api = this.builder._api;

        if (api) {
            api.messages.markAsRead({
                peer_id: context.peerId
            })
                .catch(() => null);
        }
    }

    _editMessage(messageParams, event = "") {
        const context = this.builder.sentContext;

        if (context.id && this.builder.sendMethod !== "send_new") {
            return context.editMessage(messageParams)
                .catch((error) => {
                    if (error?.code === 909) {
                        return context.send(messageParams)
                            .then((context) => {
                                this.builder.sentContext = context;

                                this.builder._saveContext();
                            })
                    }

                    throw error;
                });
        } else {
            if (event !== "stop") {
                return context.send(messageParams);
            }
        }
    }

    _deleteMessage(context) {
        if (context.id) {
            context.deleteMessage({
                delete_for_all: 1
            })
                .catch(() => null);
        }
    }
}
