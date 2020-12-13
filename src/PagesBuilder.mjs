import VKIO from "vk-io";
import EventEmitter from "events";

import { ContextUtils } from "./ContextUtils.mjs";

import { cleanUpKeyboard, randomString } from "./functions.mjs";

const { Keyboard, KeyboardBuilder, API, MessageContext, IMessageContextSendOptions } = VKIO;

export const pagesStorage = new Map();

export class PagesBuilder extends EventEmitter {

    /**
     * @description Сборщик страниц
     * @param {object} options
     * @param {API} options.api - Класс API
     * @param {MessageContext} options.context - Контекст сообщения
     */
    constructor({ api = null, context }) {
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

        this.triggers = null;

        this.sentContext = null;

        this.keyboard = null;
        this.setDefaultButtons();
    }

    /**
     * @description Метод для начальной установки страниц
     * @param {[function|string|IMessageContextSendOptions]|function|string|IMessageContextSendOptions} pages - Страницы для добавления
     * @return this
     */
    setPages(pages) {
        if (!Array.isArray(pages)) {
            pages = [pages];
        }

        this.pages = pages;

        return this;
    }

    /**
     * @description Метод для добавления страниц в конец
     * @param {[function|string|IMessageContextSendOptions]|function|string|IMessageContextSendOptions} pages - Страницы для добавления
     * @return this
     */
    addPages(pages) {
        this.pages = this.pages.concat(pages);

        return this;
    }

    /**
     * @description Метод для открытия определенной страницы
     * @param {number} pageNumber - Номер страницы
     * @return {Promise} - Результат отправки/редактирования сообщения
     */
    async setPage(pageNumber) {
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

    /**
     * @description Метод для установки автоматического сброса таймера при переключении между страницами
     * @param {boolean} status=true - Значение автоматического сброса таймера
     * @return this
     */
    autoResetTimeout(status = true) {
        this.resetTimeout = status;

        this._saveContext();

        return this;
    }

    /**
     * @description Метод для установки формата нумерования страниц
     * @param {string} format="%c / %m" - Формат нумерования
     * @return this
     */
    setPagesNumberFormat(format = "%c / %m") {
        this.pagesNumberFormat = format;

        return this;
    }

    /**
     * @description Метод для установки бесконечного переключения между страницами при достижении конца
     * @param {Boolean} status=true - Значение для бесконечного переключения между страницами
     * @return this
     */
    setInfinityLoop(status = true) {
        this.infinityLoop = status;

        return this;
    }

    /**
     * @description Метод для установки верхней части страниц
     * @param {string} header - Строка для верхней части страниц
     * @return {this}
     */
    setPagesHeader(header = "") {
        this.header = header;

        return this;
    }

    /**
     * @description Метод для установки нижней части страниц
     * @param {string} footer - Строка для нижней части страниц
     * @return {this}
     */
    setPagesFooter(footer = "") {
        this.footer = footer;

        return this;
    }

    /**
     * @description Метод для установки метода отправки страницы
     * @param {"send_new"|"edit"} method - Метод отправки
     * @return this
     */
    setSendMethod(method = "send_new") {
        this.sendMethod = method;

        return this;
    }

    /**
     * @private
     */
    async _getPage(pageNumber = this.currentPage) {
        let page = this.pages[pageNumber - 1];

        if (typeof page === "function") {
            page = await page(this._context);
        }

        if (typeof page === "string") {
            page = {
                message: page
            };
        }

        let keyboard = page.keyboard ?? this.keyboard;

        if (!this.infinityLoop) {
            keyboard = cleanUpKeyboard(keyboard, pageNumber);
        }

        const pageNumbers = this.pagesNumberFormat.replace("%c", pageNumber)
            .replace("%m", String(this.pages.length));

        return {
            ...page,
            message: `${this.header}${page.message}${this.footer}\n\n${pageNumbers}`,
            keyboard: keyboard.rows.length || keyboard.currentRow.length ?
                keyboard
                :
                JSON.stringify({})
        };
    }

    /**
     * @description Метод для установки времени прослушивания обновлений для переключения страниц
     * @param {number} time=300000 - Время прослушивания в миллисекундах. По умолчанию 5 минут
     * @return this
     */
    setListenTime(time = 5 * 60 * 1000) {
        this.listenTime = time;

        return this;
    }

    /**
     * @description Метод для сброса текущего таймера прослушивания
     */
    resetListenTimeout() {
        clearTimeout(this._listenTimeout);

        this._listenTimeout = setTimeout(this.stopListen.bind(this), this.listenTime);

        this._saveContext();

        this.emit("listen_reset_timeout");
    }

    /**
     * @description Метод для установки прослушивания определенных пользователей
     * @param {[number]|number} users=[] - Пользователи для прослушивания
     * @return this
     */
    setListenUsers(users = []) {
        if (!Array.isArray(users)) {
            users = [users];
        }

        this.listenUsers = users;

        return this;
    }

    /**
     * @description Метод для добавления прослушивания определенных пользователей
     * @param {[number]|number} users=[] - Пользователи для прослушивания
     * @return this
     */
    addListenUsers(users = []) {
        this.listenUsers = this.listenUsers.concat(users);

        return this;
    }

    /**
     * @description Метод для досрочной остановки прослушивания новых сообщений
     */
    async stopListen() {
        clearTimeout(this._listenTimeout);
        pagesStorage.delete(this.id);

        this.emit("listen_stop", this.currentPage);

        const page = await this._getPage(this.currentPage);

        new ContextUtils(this)
            ._editMessage({
                ...page,
                keyboard: JSON.stringify({})
            }, "stop");
    }

    /**
     * @description Метод для установки кнопок по умолчанию
     * @param {["first", "back", "stop", "next", "last"]} [buttons] - Названия кнопок
     * @param {"text"|"callback"} [type="text"] - Тип кнопок
     * @return this
     */
    setDefaultButtons(buttons = ["first", "back", "stop", "next", "last"], type = "text") {
        const keyboard = Keyboard.builder()
            .inline(true);

        const defaultButtons = new Map([
            ["first", "⏪"],
            ["back", "◀️"],
            ["stop", "⏹"],
            ["next", "▶️"],
            ["last", "⏩"]
        ]);

        buttons.forEach((button) => {
            const label = defaultButtons.get(button);

            const buttonObject = {
                label,
                payload: {
                    builder_action: button,
                    builder_id: this.id
                }
            };

            if (label) {
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

    /**
     * @description Метод для обновления клавиатуры
     * @param {KeyboardBuilder} keyboard - Клавиатура
     * @return this
     */
    updateKeyboard(keyboard = null) {
        this.keyboard = keyboard;

        return this;
    }

    /**
     * @description Метод для начальной установки триггеров
     * @param {{name: string, callback: function}[]|{name: string, callback: function}} triggers - Триггеры
     * @return this
     */
    setTriggers(triggers) {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        triggers = triggers.map(({ name, callback }) => [name, callback]);

        this.triggers = new Map(triggers);

        return this;
    }

    /**
     * @description Метод для добавления триггеров
     * @param {{name: string, callback: function}[]|{name: string, callback: function}} triggers - Триггеры
     * @return this
     */
    addTriggers(triggers) {
        if (!Array.isArray(triggers)) {
            triggers = [triggers];
        }

        if (!this.triggers) {
            this.triggers = new Map();
        }

        triggers.forEach(({ name, callback }) => {
            this.triggers.set(name, callback);
        });

        return this;
    }

    /**
     * @private
     */
    _executeTrigger(trigger) {
        trigger = this.triggers.get(trigger);

        if (trigger) {
            this.emit("trigger_execute", trigger);

            trigger(this._context);
        }
    }

    /**
     * @description Функция для сборки и отправки страниц
     * @return {Promise} - Текущий контекст сборщика
     */
    build() {
        const { _context: context, pages } = this;

        return new Promise(async (resolve, reject) => {

            if (pages.length === 0) {
                return reject(
                    new Error("Pages not set")
                );
            }

            context.send(await this._getPage(1))
                .then((sentContext) => {
                    this.sentContext = sentContext;

                    this._saveContext();

                    this.emit("listen_start");

                    this.resetListenTimeout();

                    resolve(this);
                })
                .catch(reject);
        });
    }

    /**
     * @private
     */
    _saveContext() {
        pagesStorage.set(this.id, this);
    }

    /**
     * @private
     */
    _executeAction(action) {
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

    /**
     * @private
     */
    _messageMiddleware(context) {
        this._context = context;

        const payload = context?.messagePayload || context?.eventPayload;

        const action = payload?.builder_action;
        const builderId = payload?.builder_id;
        const page = Number(payload?.builder_page);
        const trigger = payload?.builder_trigger;

        if ((action || page || trigger) && builderId === this.id) {

            if (this.listenUsers.length && !this.listenUsers.includes(context.senderId)) {
                return;
            }

            const contextUtils = new ContextUtils(this);

            contextUtils._markAsRead(context);
            contextUtils._deleteMessage(context);

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
