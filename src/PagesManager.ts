import { PagesBuilder, pagesStorage } from "./PagesBuilder";

import { IPagesBuilderOptions, Middleware, Fallback } from "./interfaces";

export class PagesManager {

    fallbackHandler: Fallback;

    constructor() {
        this.fallbackHandler = null;
    }

    get middleware(): Middleware {
        return (context: IPagesBuilderOptions["context"], next: () => void) => {
            context.pagesBuilder = context.pageBuilder = (options: Record<string, unknown> = {}): PagesBuilder => new PagesBuilder({
                context,
                ...options
            });

            const builderId = context?.messagePayload?.builder_id || context?.eventPayload?.builder_id;

            if (builderId) {
                const pagesInstance = pagesStorage.get(builderId);

                if (pagesInstance) {
                    pagesInstance.messageMiddleware(context);
                } else {
                    if (this.fallbackHandler) {
                        return this.fallbackHandler(context, next);
                    }
                }
            }

            return next();
        };
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
};
