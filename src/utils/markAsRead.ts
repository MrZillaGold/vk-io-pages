import { Context } from 'vk-io';

import { PagesContext } from '../types';

export function markAsRead<C extends Context = Context>(context: PagesContext<C>): Promise<
    Awaited<ReturnType<PagesContext['api']['messages']['markAsRead']>>
    | null
    > {
    return context['api'].messages.markAsRead({
        peer_id: context.peerId
    })
        .catch(() => null);
}
