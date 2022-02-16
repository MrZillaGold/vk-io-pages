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
            async () => {
                // Здесь может быть любая логика с загрузкой данных
                //            ↓ Кешированные данные или их загрузка и кеширование
                const photo = context.state.photo ?? await vk.upload.messagePhoto({
                    source: {
                        value: 'https://i.imgur.com/uDolUBo.png'
                    },
                    peer_id: context.peerId
                })
                    .then((photo) => {
                        photo = String(photo);

                        // Сохраняем данные, чтобы не загружать их снова при открытии страницы
                        context.state.photo = photo;

                        return photo;
                    })
                    .catch((error) => {
                        console.log(error);

                        return '';
                    });

                return { // Возвращаем объект страницы
                    message: 'Страница 1',
                    attachment: photo
                };
            },
            '2 страница'
        ])
        .build();
});

vk.updates.start() ;
