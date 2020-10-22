import { PageBuilder, pagesStorage } from "./PageBuilder";

export class PagesManager {

    get middleware() {
        return (context, next) => {
            context.pageBuilder = PageBuilder;

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
