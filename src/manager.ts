import { Context } from 'vk-io';

import { PagesBuilder, pagesStorage } from './builder';

import { Middleware, Fallback, PagesContext } from './types';

export class PagesManager<C extends Context = Context> {

    fallbackHandler: Fallback;

    constructor() {
        this.fallbackHandler = null;
    }

    get middleware(): Middleware<C> {
        return (context: PagesContext<C>, next: () => void) => {
            context.pagesBuilder = () => new PagesBuilder<C>({
                context
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

export * from './builder';

export * from './types';
