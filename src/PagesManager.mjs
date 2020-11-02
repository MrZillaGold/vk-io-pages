import VKIO from "vk-io";

import { PagesBuilder, pagesStorage } from "./PageBuilder";

const { API } = VKIO;

export class PagesManager {

    /**
     * @description Обработчик страниц
     * @param {object} options
     * @param {API} options.api - Класс API
     */
    constructor({ api }) {
        this.api = api;
    }

    get middleware() {
        return (context, next) => {
            context.pageBuilder = (options = {}) => new PagesBuilder({
                api: this.api,
                context,
                ...options
            });

            const builderId = context?.messagePayload?.builder_id || context?.eventPayload?.builder_id;

            if (builderId) {
                const pagesInstance = pagesStorage.get(builderId);

                if (pagesInstance) {
                    pagesInstance._messageMiddleware(context);
                }
            }

            return next();
        }
    }
}
