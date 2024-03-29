const { VK } = require('vk-io');

const { HearManager } = require('@vk-io/hear');
const { PagesManager } = require('vk-io-pages');

const vk = new VK({
    token: process.env.TOKEN
});

const pagesManager = new PagesManager();
const hearManager = new HearManager();

vk.updates.on('message_event', pagesManager.middleware);
vk.updates.on('message_new', pagesManager.middleware);

vk.updates.on('message_new', hearManager.middleware);

hearManager.hear('/start', (context) => {
    context.pagesBuilder()
        .setPages([
            '1 страница',
            '2 страница'
        ])
        .build();
});

hearManager.onFallback((context, next) => { // Обработчик, если команда не существует
    if (context?.messagePayload?.builder_id) {
        next();

        return;
    }

    // Ваша логика
});

vk.updates.start();
