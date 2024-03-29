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
    const builder = context.pagesBuilder()
        .setListenTime(10 * 1_000);

    builder.setPages([
        '1 страница',
        '2 страница'
    ])
        .build();
});

pagesManager.onFallback((context) => { // Обработчик, если сборщик не существует
    context.send('Время действия этой страницы закончилось, вызовите команду заново.');
});

vk.updates.start();
