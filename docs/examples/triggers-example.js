const { VK, Keyboard } = require("vk-io");

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
            "2 страница"
        ])
        .setTriggers([
            {
                name: "test_trigger",
                callback() {
                    builder.setPage(2);

                    context.send("Использован test_trigger");
                }
            }
        ]);

    builder.addTriggers({
        name: "custom_trigger",
        callback() {
            context.send("Использован custom_trigger");
        }
    });

    builder.updateKeyboard(
        Keyboard.builder()
            .textButton({
                label: "test_trigger",
                payload: {
                    builder_id: builder.id,
                    builder_trigger: "test_trigger"
                }
            })
            .textButton({
                label: "custom_trigger",
                payload: {
                    builder_id: builder.id,
                    builder_trigger: "custom_trigger",
                    builder_page: 1
                }
            })
            .inline(true)
    );

    return builder.build();
});

vk.updates.start().catch(console.error);
