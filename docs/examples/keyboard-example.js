const { VK } = require("vk-io");

const { HearManager } = require("@vk-io/hear");
const { PagesManager } = require("vk-io-pages");

const vk = new VK({
    token: process.env.TOKEN
});

const pagesManager = new PagesManager();
const hearManager = new HearManager();

vk.updates.on("message_event", pagesManager.middleware);
vk.updates.on("message_new", pagesManager.middleware);

vk.updates.on("message_new", hearManager.middleware);

hearManager.hear("/start", (context) => {
    const builder = new context.pageBuilder({
        api: vk.api, // API нужен для отметки сообщений прочитанными, по желанию можете не передавать.
        context // Контекст текущего сообщения
    })
        .setPages([
            "1 страница",
            "2 страница",
            "3 страница"
        ])
        .setDefaultButtons(["back", "next"]);

    const keyboard = builder.keyboard;

    keyboard.textButton({
        label: "Кнопка с номером страницы",
        payload: {
            builder_id: builder.id,
            builder_page: 2
        }
    })
        .row()
        .textButton({
            label: "Кнопка с действием",
            payload: {
                builder_id: builder.id,
                builder_action: "next"
            }
        });

    builder.updateKeyboard(keyboard);

    return builder.build();
});

vk.updates.start().catch(console.error);
