export class ContextUtils {

    _markAsRead(context) {
        const api = this._api;

        if (api) {
            api.messages.markAsRead({
                peer_id: context.peerId
            })
                .catch(() => null);
        }
    }

    _editMessage(messageParams, event = "") {
        const context = this.sentContext;

        if (context.id && this.sendMethod !== "send_new") {
            return context.editMessage(messageParams);
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
