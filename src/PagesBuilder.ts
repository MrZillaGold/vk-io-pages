import { Keyboard, KeyboardBuilder, MessageContext, IMessageContextSendOptions, MessageEventContext, IKeyboardTextButtonOptions, KeyboardButton } from "vk-io";
import * as Event from "events";

import { ContextUtils } from "./ContextUtils";
import { randomString } from "./functions";

import { IPagesBuilderOptions, ISetDefaultButtonsOptions, IResetListenTimeoutOptions, ITrigger, DefaultButtonLabel, DefaultButtonsMap, TriggersMap, Page, PageSentMethod, DefaultButtonAction, PagesStorage } from "./interfaces";

export const pagesStorage: PagesStorage = new Map();

export class PagesBuilder extends Event.EventEmitter {

    _api: IPagesBuilderOptions["api"];
    _context: IPagesBuilderOptions["context"];

    readonly id: string;

    pages: Page[];
    header: string;
    footer: string;
    currentPage: number;
    infinityLoop: boolean;
    resetTimeout: boolean;
    pagesNumberFormat: string;
    sendMethod: string;

    listenTime: number;
    protected _listenTimeout: NodeJS.Timeout | null;
    listenUsers: number[];

    triggers: TriggersMap;

    sentContext: IPagesBuilderOptions["context"] | null;

    keyboard: KeyboardBuilder;

    constructor({ api = null, context }: IPagesBuilderOptions) {
        super();

        this._api = api;
        this._context = context;

        this.id = randomString(6);

        this.pages = [];
        this.header = "";
        this.footer = "";
        this.currentPage = 1;
        this.infinityLoop = true;
        this.resetTimeout = false;
        this.pagesNumberFormat = "%c / %m";
        this.sendMethod = "send_new";

        this.listenTime = 5 * 60 * 1000; // 5 минут
        this._listenTimeout = null;
        this.listenUsers = [];

        this.triggers = new Map();

        this.sentContext = null;

        this.keyboard = Keyboard.builder()
            .inline();
        this.setDefaultButtons();
    }

    /*
     * Метод для начальной установки страниц
     */
    setPages(pages: Page | Page[]): this {
        this.pages = !Array.isArray(pages) ? [pages] : pages;

        return this;
    }

    /*
     * Метод для добавления страниц в конец
     */
    addPages(pages: Page | Page[]): this {
        this.pages = this.pages.concat(pages);

        return this;
    }

    /*
     * Метод для открытия определенной страницы
     */
    async setPage(pageNumber: number): Promise<MessageContext> {
        this.currentPage = pageNumber;

        if (this.resetTimeout) {
            this.resetListenTimeout();
        }

        this._saveContext();

        const page = await this._getPage(pageNumber);

        this.emit("page_set", pageNumber);

        return new ContextUtils(this)
            ._editMessage(page);
    }

    /*
     * Метод для установки автоматического сброса таймера при переключении между страницами
     */
    autoResetTimeout(status: boolean = true): this {
        this.resetTimeout = status;

        this._saveContext();

        return this;
    }

    /*
     * Метод для установки формата нумерования страниц
     */
    setPagesNumberFormat(format: string = "%c / %m"): this {
        this.pagesNumberFormat = format;

        return this;
    }

    /*
     * Метод для установки бесконечного переключения между страницами при достижении конца
     */
    setInfinityLoop(status: boolean = true): this {
        this.infinityLoop = status;

        return this;
    }

    /*
     * Метод для установки верхней части страниц
     */
    setPagesHeader(header: string = ""): this {
        this.header = header;

        return this;
    }

    /*
     * Метод для установки нижней части страниц
     */
    setPagesFooter(footer: string = ""): this {
        this.footer = footer;

        return this;
    }

    /*
     * Метод для установки метода отправки страницы
     */
    setSendMethod(method: PageSentMethod = "send_new"): this {
        this.sendMethod = method;

        return this;
    }

    private async _getPage(pageNumber: number = this.currentPage): Promise<IMessageContextSendOptions> {
        let page: Page = this.pages[pageNumber - 1];

        if (typeof page === "function") {
            page = await page(this._context);
        }

        if (typeof page === "string") {
            page = {
                message: page
            };
        }

        let keyboard = (page.keyboard ?? this.keyboard) as KeyboardBuilder;

        if (!this.infinityLoop) {
            keyboard = this._cleanUpKeyboard();
        }

        const pagePagination = this.pagesNumberFormat.replace("%c", String(pageNumber))
            .replace("%m", String(this.pages.length));

        return {
            ...page,
            message: `${this.header}${page.message}${this.footer}\n\n${pagePagination}`,
            keyboard: JSON.parse(keyboard.toString()).buttons.length ?
                keyboard
                :
                JSON.stringify({})
        };
    }

    /*
     * Метод для установки времени прослушивания обновлений для переключения страниц
     */
    setListenTime(time: number = 5 * 60 * 1000): this {
        this.listenTime = time;

        return this;
    }

    /*
     * Метод для сброса текущего таймера прослушивания
     */
    resetListenTimeout({ isFirstBuild = false }: IResetListenTimeoutOptions = {}): void {
        if (this._listenTimeout || isFirstBuild) {
            clearTimeout(this._listenTimeout as NodeJS.Timeout);

            this._listenTimeout = setTimeout(this.stopListen.bind(this), this.listenTime);

            this._saveContext();

            this.emit("listen_reset_timeout");
        }
    }

    /*
     * Метод для установки прослушивания определенных пользователей
     */
    setListenUsers(users: number | number[] = []): this {
        if (!Array.isArray(users)) {
            users = [users];
        }

        this.listenUsers = users;

        return this;
    }

    /*
     * Метод для добавления прослушивания определенных пользователей
     */
    addListenUsers(users: number | number[] = []): this {
        this.listenUsers = this.listenUsers.concat(users);

        return this;
    }

    /*
     * Метод для досрочной остановки прослушивания новых сообщений
     */
    async stopListen(): Promise<void> {
        if (this._listenTimeout) {
            clearTimeout(this._listenTimeout);
            pagesStorage.delete(this.id);

            this.emit("listen_stop", this.currentPage);

            const page: IMessageContextSendOptions = await this._getPage(this.currentPage);

            new ContextUtils(this)
                ._editMessage({
                    ...page,
                    keyboard: JSON.stringify({})
                }, "stop");
        }
    }

    /*
     * Метод для установки кнопок по умолчанию
     */
    setDefaultButtons({
                          buttons = ["first", "back", "stop", "next", "last"],
                          type = "text"
    }: ISetDefaultButtonsOptions = {}): this {
        const keyboard = Keyboard.builder()
            .inline(true);

        const defaultButtons: DefaultButtonsMap = new Map([
            ["first", "⏪"],
            ["back", "◀️"],
            ["stop", "⏹"],
            ["next", "▶️"],
            ["last", "⏩"]
        ]);

        buttons.forEach((button) => {
            const label: DefaultButtonLabel | undefined = defaultButtons.get(button);

            if (label) {
                const buttonObject: IKeyboardTextButtonOptions = {
                    label,
                    payload: {
                        builder_action: button,
                        builder_id: this.id
                    }
                };

                switch (type) {
                    case "callback":
                        keyboard.callbackButton(buttonObject);
                        break;
                    default:
                        keyboard.textButton(buttonObject);
                }
            }
        });

        keyboard.row();

        this.keyboard = keyboard;

        return this;
    }

    /*
     * Метод для обновления клавиатуры
     */
    updateKeyboard(keyboard: KeyboardBuilder | null = null): this {
        this.keyboard = keyboard ?? Keyboard.builder()
            .inline(true);

        return this;
    }

    /*
     * Метод для начальной установки триггеров
     */
    setTriggers(triggers: ITrigger | ITrigger[]): this {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        this.triggers = new Map(
            triggers.map(({ name, callback }) => [name, callback])
        );

        return this;
    }

    /*
     * Метод для добавления триггеров
     */
    addTriggers(triggers: ITrigger | ITrigger[]): this {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        triggers.forEach(({ name, callback }) => {
            this.triggers.set(name, callback);
        });

        return this;
    }

    private _executeTrigger(trigger: ITrigger["name"]) {
        const triggerAction: ITrigger["callback"] | undefined = this.triggers.get(trigger);

        if (triggerAction) {
            this.emit("trigger_execute", trigger);

            triggerAction(this._context);
        }
    }

    /*
     * Метод для сборки и отправки страниц
     */
    build(): Promise<this> {
        const { _context: context, pages } = this;

        return new Promise(async (resolve, reject) => {

            if (pages.length === 0) {
                return reject(
                    new Error("Pages not set")
                );
            }

            context.send(await this._getPage(1))
                .then((sentContext: MessageContext) => {
                    this.sentContext = sentContext;

                    this._saveContext();

                    this.emit("listen_start");

                    this.resetListenTimeout({ isFirstBuild: true });

                    resolve(this);
                })
                .catch(reject);
        });
    }

    _saveContext(): void {
        pagesStorage.set(this.id, this);
    }

    private _cleanUpKeyboard() {
        const keyboard = JSON.parse(this.keyboard.toString());

        keyboard.buttons = keyboard.buttons.map((row: KeyboardButton[]) =>
            row.filter((button: KeyboardButton | any) => {
                try {
                    const payload = JSON.parse(button.action.payload);

                    if (
                        Object.keys(payload)
                            .filter((key) => key !== "builder_action" && key !== "builder_id")
                            .length > 0
                    ) {
                        return true;
                    }

                    const { builder_action } = payload;

                    if (builder_action) {
                        return !(
                            (this.currentPage === 1 && (builder_action === "first" || builder_action === "back")) ||
                            (this.currentPage === this.pages.length && (builder_action === "last" || builder_action === "next"))
                        );
                    }
                } catch {}

                return true;
            })
        )
            .filter((row: KeyboardButton[]) => row.length);

        return keyboard;
    }

    private _executeAction(action: DefaultButtonAction): void {
        this.emit("page_action_execute", action);

        switch (action) {
            case "first":
                if (this.currentPage === 1) {
                    if (this.infinityLoop) {
                        this.setPage(this.pages.length);
                    }

                    return;
                }

                this.setPage(1);

                break;
            case "back":
                if (this.currentPage === 1) {
                    if (this.infinityLoop) {
                        this.setPage(this.pages.length);
                    }

                    return;
                }

                this.setPage(this.currentPage - 1);

                break;
            case "stop":
                this.stopListen();
                break;
            case "next":
                if (this.currentPage === this.pages.length) {
                    if (this.infinityLoop) {
                        this.setPage(1);
                    }

                    return;
                }

                this.setPage(this.currentPage + 1);

                break;
            case "last":
                if (this.currentPage === this.pages.length) {
                    if (this.infinityLoop) {
                        this.setPage(1);
                    }

                    return;
                }

                this.setPage(this.pages.length);

                break;
        }
    }

    _messageMiddleware(context: MessageContext | MessageEventContext): void {
        this._context = context;

        const payload: MessageContext["messagePayload"] | MessageEventContext["eventPayload"] = context?.messagePayload || context?.eventPayload;

        const action: DefaultButtonAction | null = payload?.builder_action;
        const builderId: string | null = payload?.builder_id;
        const page: number = Number(payload?.builder_page);
        const trigger: ITrigger["name"] = payload?.builder_trigger;

        if ((action || page || trigger) && builderId === this.id) {
            if (this.listenUsers.length && !this.listenUsers.includes(context.senderId)) {
                return;
            }

            const contextUtils: ContextUtils = new ContextUtils(this);

            if (context.type !== "message_event") {
                contextUtils._markAsRead(context);
            }

            if (action) {
                this._executeAction(action);
            } else if (page) {
                if (page >= 1 && page <= this.pages.length) {
                    if (page === this.currentPage && context.type !== "message_event") {
                        return;
                    }

                    this.setPage(page);
                }
            }

            if (trigger) {
                this._executeTrigger(trigger);
            }
        }
    }
}