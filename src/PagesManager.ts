import { API } from "vk-io";

import { PagesBuilder, pagesStorage } from "./PagesBuilder";

import { IPagesManagerOptions, IPagesBuilderOptions, Middleware, Fallback } from "./interfaces";

export class PagesManager {

    api: API | null;
    fallbackHandler: Fallback;

    constructor({ api = null }: IPagesManagerOptions = {}) {
        this.api = api;

        this.fallbackHandler = null;
    }

    get middleware(): Middleware {
        return (context: IPagesBuilderOptions["context"], next: () => void) => {
            context.pageBuilder = (options: object = {}): PagesBuilder => new PagesBuilder({
                api: this.api,
                context,
                ...options
            });

            const builderId: string | null = context?.messagePayload?.builder_id || context?.eventPayload?.builder_id;

            if (builderId) {
                const pagesInstance: PagesBuilder | undefined = pagesStorage.get(builderId);

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
     * Функция для проверки наличия сборщика
     */
    static hasBuilder(builderId: string): boolean {
        return pagesStorage.has(builderId);
    }


    /**
     * Метод для установки обработчика при отсутствии сборщика
     */
    onFallback(handler: Fallback): this {
        this.fallbackHandler = handler;

        return this;
    }
}

export {
    PagesBuilder,
    pagesStorage
}
