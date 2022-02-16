import { EventEmitter } from 'events';
import {
    Context,
    IMessageContextSendOptions,
    Keyboard,
    KeyboardBuilder,
    KeyboardButton,
    MessageContext,
    MessageEventContext
} from 'vk-io';

import { chunk, editMessage, markAsRead, randomString } from './utils';

import {
    DefaultButtonAction,
    DefaultButtonActionUnion,
    DefaultButtonsMap,
    DefaultButtonsType,
    FunctionalKeyboard,
    IAutoGeneratePagesOptions,
    IPagesBuilderOptions,
    IResetListenTimeoutOptions,
    ISetDefaultButtonsOptions,
    ITrigger,
    Page,
    PagesContext,
    PageSendMethod,
    PageSendMethodUnion,
    PagesStorage,
    TriggersMap
} from './types';

export const pagesStorage: PagesStorage = new Map();

export class PagesBuilder<C extends Context = Context> extends EventEmitter {

    /**
     * Builder ID
     *
     * @private
     */
    readonly #id = randomString(6);
    /**
     * Received message context
     *
     * @private
     */
    #context: IPagesBuilderOptions<C>['context'];

    /**
     * Pages collection
     *
     * @private
     */
    #pages: Page[] = [];
    /**
     * Pages header
     *
     * @private
     */
    #header = '';
    /**
     * Pages footer
     *
     * @private
     */
    #footer = '';
    /**
     * Current page
     *
     * @private
     */
    #currentPage = 1;
    /**
     * Infinite pages switching
     *
     * @private
     */
    #infinityLoop = true;
    /**
     * Auto reset timeout after page change
     *
     * @private
     */
    #resetTimeout = false;
    /**
     * Pagination format for pages
     *
     * @private
     */
    #pagesPaginationFormat = '%c / %m';
    /**
     * Method for send messages
     *
     * @private
     */
    #sendMethod: PageSendMethod | PageSendMethodUnion = PageSendMethod.SEND;

    /**
     * Updates listen time
     *
     * @private
     */
    #listenTime = 5 * 60 * 1_000;
    /**
     * Listen timeout context
     *
     * @private
     */
    #listenTimeout?: ReturnType<typeof setTimeout>;
    /**
     * Updates listen users
     *
     * @private
     */
    #listenUsers: number[] = [];

    /**
     * Triggers collection
     *
     * @private
     */
    #triggers: TriggersMap = new Map();

    /**
     * Sent message context
     *
     * @private
     */
    #sent?: PagesContext<MessageContext>;

    /**
     * Builder keyboard
     *
     * @private
     */
    #keyboard: KeyboardBuilder = Keyboard.builder()
        .inline();

    constructor({ context }: IPagesBuilderOptions<C>) {
        super();

        this.#context = context;

        this.setDefaultButtons();
    }

    /**
     * Method for initial pages setup
     */
    setPages(pages: Page | Page[]): this {
        this.#pages = !Array.isArray(pages) ?
            [pages]
            :
            pages;

        return this;
    }

    /**
     * Method for adding pages to end of collection
     */
    addPages(pages: Page | Page[]): this {
        this.#pages = this.#pages.concat(pages);

        return this;
    }

    /**
     * Method for auto generate pages
     */
    autoGeneratePages({ items, countPerPage = 10 }: IAutoGeneratePagesOptions): this {
        const chunks = chunk(items, countPerPage);

        this.setPages(
            chunks.map((chunk) => ({
                message: chunk.join('\n')
            }))
        );

        return this;
    }

    /**
     * Method for open page
     */
    async setPage(pageNumber = this.#currentPage): Promise<MessageContext> {
        this.#currentPage = pageNumber;

        if (this.#resetTimeout) {
            this.resetListenTimeout();
        }

        this.saveContext();

        const page = await this.getPage(pageNumber);

        this.emit('page_set', pageNumber);

        return editMessage(this, page);
    }

    /**
     * Method for auto reset timeout after page change
     */
    autoResetTimeout(status = true): this {
        this.#resetTimeout = status;

        this.saveContext();

        return this;
    }

    /**
     * Method for set pages pagination format
     */
    setPagesPaginationFormat(format = '%c / %m'): this {
        this.#pagesPaginationFormat = format;

        this.saveContext();

        return this;
    }

    /**
     * Method for set infinite pages switching
     */
    setInfinityLoop(status = true): this {
        this.#infinityLoop = status;

        this.saveContext();

        return this;
    }

    /**
     * Method for set pages header
     */
    setPagesHeader(header = ''): this {
        this.#header = header;

        this.saveContext();

        return this;
    }

    /**
     * Method for set pages footer
     */
    setPagesFooter(footer = ''): this {
        this.#footer = footer;

        this.saveContext();

        return this;
    }

    /**
     * Method for set send pages method
     */
    setSendMethod(method: PageSendMethod | PageSendMethodUnion = PageSendMethod.SEND): this {
        this.#sendMethod = method;

        this.saveContext();

        return this;
    }

    private async getPage(pageNumber = this.#currentPage): Promise<IMessageContextSendOptions> {
        let page = this.#pages[pageNumber - 1];

        if (typeof page === 'function') {
            page = await page(this.#context);
        }

        if (typeof page === 'string') {
            page = {
                message: page
            };
        }

        let keyboard = page.keyboard ?? this.#keyboard as FunctionalKeyboard;

        if (typeof keyboard === 'function') {
            keyboard = await keyboard(this.#context);
        }

        if (!this.#infinityLoop) {
            keyboard = this.#cleanUpKeyboard(keyboard as KeyboardBuilder);
        } else {
            keyboard = JSON.parse(keyboard.toString());
        }

        const pagePagination = this.#pagesPaginationFormat
            .replace('%c', String(pageNumber))
            .replace('%m', String(this.#pages.length));

        const hasKeyboardButtons = (keyboard as Record<string, any>).buttons.length;

        return {
            ...page,
            message: `${this.#header}${page.message}${this.#footer}\n\n${pagePagination}`,
            keyboard: hasKeyboardButtons ?
                JSON.stringify(keyboard)
                :
                undefined
        };
    }

    /**
     * Method for set updates listen time
     */
    setListenTime(time = 5 * 60 * 1_000): this {
        this.#listenTime = time;

        this.saveContext();

        return this;
    }

    /**
     * Method for reset current updates listen timeout
     */
    resetListenTimeout({ isFirstBuild = false }: IResetListenTimeoutOptions = {}): void {
        if (this.#listenTimeout || isFirstBuild) {
            clearTimeout(this.#listenTimeout as NodeJS.Timeout);

            this.#listenTimeout = setTimeout(this.stopListen.bind(this), this.#listenTime);

            this.saveContext();

            this.emit('listen_reset_timeout');
        }
    }

    /**
     * Method for set updates listen users
     */
    setListenUsers(users: number | number[] = []): this {
        if (!Array.isArray(users)) {
            users = [users];
        }

        this.#listenUsers = users;

        this.saveContext();

        return this;
    }

    /**
     * Method for add updates listen users
     */
    addListenUsers(users: number | number[] = []): this {
        this.#listenUsers = this.#listenUsers.concat(users);

        this.saveContext();

        return this;
    }

    /**
     * Method for stop listen updates
     */
    async stopListen(): Promise<void> {
        if (this.#listenTimeout) {
            clearTimeout(this.#listenTimeout);
            pagesStorage.delete(this.#id);

            this.emit('listen_stop', this.#currentPage);

            const page = await this.getPage(this.#currentPage);

            editMessage(this, {
                ...page,
                keyboard: JSON.stringify({})
            }, true);
        }
    }

    /**
     * Method for set default buttons
     */
    setDefaultButtons({
        buttons = [
            DefaultButtonAction.FIRST,
            DefaultButtonAction.BACK,
            DefaultButtonAction.STOP,
            DefaultButtonAction.NEXT,
            DefaultButtonAction.LAST
        ],
        type = DefaultButtonsType.TEXT
    }: ISetDefaultButtonsOptions = {}): this {
        const keyboard = Keyboard.builder()
            .inline(true);

        const defaultButtons: DefaultButtonsMap = new Map([
            [DefaultButtonAction.FIRST, '⏪'],
            [DefaultButtonAction.BACK, '◀️'],
            [DefaultButtonAction.STOP, '⏹'],
            [DefaultButtonAction.NEXT, '▶️'],
            [DefaultButtonAction.LAST, '⏩']
        ]);

        buttons.forEach((button) => {
            const label = defaultButtons.get(button);

            if (label) {
                const buttonObject = {
                    label,
                    payload: {
                        builder_action: button,
                        builder_id: this.#id
                    }
                };

                keyboard[`${type}Button`](buttonObject);
            }
        });

        keyboard.row();

        this.#keyboard = keyboard;

        this.saveContext();

        return this;
    }

    /**
     * Method for update keyboard
     */
    updateKeyboard(keyboard?: KeyboardBuilder): this {
        this.#keyboard = keyboard ?? Keyboard.builder()
            .inline(true);

        this.saveContext();

        return this;
    }

    /**
     * Method for initial triggers setup
     */
    setTriggers(triggers: ITrigger | ITrigger[]): this {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        this.#triggers = new Map(
            triggers.map(({ name, callback }) => [name, callback])
        );

        this.saveContext();

        return this;
    }

    /**
     * Method for add triggers
     */
    addTriggers(triggers: ITrigger | ITrigger[]): this {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        triggers.forEach(({ name, callback }) => {
            this.#triggers.set(name, callback);
        });

        this.saveContext();

        return this;
    }

    /**
     * @private
     */
    executeTrigger(trigger: ITrigger['name']): ReturnType<ITrigger['callback']> {
        const triggerAction = this.#triggers.get(trigger);

        if (triggerAction) {
            this.emit('trigger_execute', trigger);

            return triggerAction(this.#context);
        }

        return Promise.resolve();
    }

    /**
     * Method for build & send pages
     */
    build(loader?: MessageContext | PagesContext<MessageContext>): Promise<this> {
        return new Promise(async (resolve, reject) => {
            if (this.#pages.length === 0) {
                return reject(
                    new Error('Pages not set')
                );
            }

            if (loader) {
                this.#sent = loader;

                if (this.#sendMethod === PageSendMethod.SEND) {
                    loader.deleteMessage({
                        delete_for_all: 1
                    })
                        .catch(() => null);
                }
            }

            const page = await this.getPage(1);

            (
                loader ?
                    editMessage(this, page)
                    :
                    this.#context.send(page)
            )
                .then((context: PagesContext<MessageContext>) => {
                    if (typeof context === 'object') {
                        this.#sent = context;
                        this.saveContext();
                    }

                    this.emit('listen_start');

                    this.resetListenTimeout({
                        isFirstBuild: true
                    });

                    resolve(this);
                })
                .catch(reject);
        });
    }

    /**
     * Context getter
     */
    get context() {
        return this.#context;
    }
    /**
     * Id getter
     */
    get id() {
        return this.#id;
    }

    /**
     * Pages collection getter
     */
    get pages() {
        return this.#pages;
    }
    /**
     * Header getter
     */
    get header() {
        return this.#header;
    }
    /**
     * Footer getter
     */
    get footer() {
        return this.#footer;
    }
    /**
     * Current page getter
     */
    get currentPage() {
        return this.#currentPage;
    }
    /**
     * Infinity loop status getter
     */
    get infinityLoop() {
        return this.#infinityLoop;
    }
    /**
     * Auto reset timeout status getter
     */
    get resetTimeout() {
        return this.#resetTimeout;
    }
    /**
     * Pages pagination format getter
     */
    get pagesPaginationFormat() {
        return this.#pagesPaginationFormat;
    }
    /**
     * Send method getter
     */
    get sendMethod() {
        return this.#sendMethod;
    }

    /**
     * Listen time getter
     */
    get listenTime() {
        return this.#listenTime;
    }
    /**
     * Listen users getter
     */
    get listenUsers() {
        return this.#listenUsers;
    }

    /**
     * Sent message context getter
     */
    get sent() {
        return this.#sent;
    }
    set sent(context) {
        this.#sent = context;
    }

    /**
     * Keyboard getter
     */
    get keyboard() {
        return this.#keyboard.clone();
    }

    /**
     * @private
     */
    saveContext(): void {
        pagesStorage.set(this.#id, this);
    }

    /**
     * @private
     */
    #cleanUpKeyboard(keyboardBuilder: KeyboardBuilder) {
        const keyboard = JSON.parse(keyboardBuilder.toString());

        keyboard.buttons = keyboard.buttons.map((row: KeyboardButton[]) => (
            row.filter((button: KeyboardButton | any) => {
                try {
                    const payload = JSON.parse(button.action.payload);
                    const payloadKeys = Object.keys(payload);
                    const isCustomButton = payloadKeys.findIndex((key) => (
                        key !== 'builder_action' &&
                        key !== 'builder_id'
                    )) !== -1;

                    if (isCustomButton) {
                        return true;
                    }

                    const { builder_action } = payload;

                    if (builder_action) {
                        const isFirstPage = this.#currentPage === 1;
                        const isLastPage = this.#currentPage === this.#pages.length;
                        const hasMoreThanTwoPages = this.#pages.length > 2;
                        const hasOnePage = this.#pages.length === 1;

                        return !hasOnePage ?
                            !(
                                (isFirstPage && (
                                    (builder_action === DefaultButtonAction.FIRST || builder_action === DefaultButtonAction.BACK) ||
                                    (!hasMoreThanTwoPages && builder_action === DefaultButtonAction.LAST)
                                )) ||
                                (isLastPage && (
                                    (builder_action === DefaultButtonAction.LAST || builder_action === DefaultButtonAction.NEXT) ||
                                    (!hasMoreThanTwoPages && builder_action === DefaultButtonAction.FIRST)
                                ))
                            )
                            :
                            false;
                    }
                    // eslint-disable-next-line no-empty
                } catch {}

                return true;
            })
        ))
            .filter((row: KeyboardButton[]) => row.length);

        return keyboard;
    }

    /**
     * @private
     */
    #executeAction(action: DefaultButtonAction | DefaultButtonActionUnion): void {
        this.emit('page_action_execute', action);

        const isFirstPage = this.#currentPage === 1;
        const isLastPage = this.#currentPage === this.#pages.length;

        switch (action) {
            case DefaultButtonAction.FIRST:
                if (isFirstPage) {
                    if (this.#infinityLoop) {
                        this.setPage(this.#pages.length);
                    }

                    return;
                }

                this.setPage(1);

                break;
            case DefaultButtonAction.BACK:
                if (isFirstPage) {
                    if (this.#infinityLoop) {
                        this.setPage(this.#pages.length);
                    }

                    return;
                }

                this.setPage(this.#currentPage - 1);

                break;
            case DefaultButtonAction.STOP:
                this.stopListen();
                break;
            case DefaultButtonAction.NEXT:
                if (isLastPage) {
                    if (this.#infinityLoop) {
                        this.setPage(1);
                    }

                    return;
                }

                this.setPage(this.#currentPage + 1);

                break;
            case DefaultButtonAction.LAST:
                if (isLastPage) {
                    if (this.#infinityLoop) {
                        this.setPage(1);
                    }

                    return;
                }

                this.setPage(this.#pages.length);

                break;
        }
    }

    /**
     * Message handle middleware
     *
     * @private
     */
    async messageMiddleware(context: PagesContext<C>): Promise<void> {
        this.#context = context;

        const payload: MessageContext['messagePayload'] | MessageEventContext['eventPayload'] = context?.messagePayload || context?.eventPayload;

        const action: DefaultButtonActionUnion | undefined = payload?.builder_action;
        const builderId: string | undefined = payload?.builder_id;
        const page = Number(payload?.builder_page);
        const trigger: ITrigger['name'] | undefined = payload?.builder_trigger;

        if ((action || page || trigger) && builderId === this.#id) {
            if (this.#listenUsers.length && !this.#listenUsers.includes(context.senderId)) {
                return;
            }

            const isMessageEvent = context.type === 'message_event';

            if (!isMessageEvent) {
                markAsRead(context);
            }

            if (action) {
                this.#executeAction(action);
            } else if (page) {
                if (page >= 1 && page <= this.#pages.length) {
                    if (page === this.#currentPage && !isMessageEvent) {
                        return;
                    }

                    this.setPage(page);
                }
            }

            if (trigger) {
                await this.executeTrigger(trigger);

                this.setPage();
            }
        }
    }
}
