import VKIO from "vk-io";

import { PagesBuilder, pagesStorage } from "./PagesBuilder";

const { API } = VKIO;

export class PagesManager {

    /**
     * @description Обработчик страниц
     * @param {object} options
     * @param {API} options.api - Класс API
     */
    constructor({ api }) {
        this.api = api;

        this.fallbackHandler = null;
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
                } else {
                    if (this.fallbackHandler) {
                        return this.fallbackHandler(context, next);
                    }
                }
            }

            return next();
        }
    }

    /**
     * @description Метод для установки обработчика при отсутствии сборщика
     * @param {function} handler - Обработчик
     * @return this
     */
    onFallback(handler) {
        this.fallbackHandler = handler;

        return this;
    }
}

export { hasBuilder } from "./functions";
