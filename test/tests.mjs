import assert from 'assert';
import { VK, getRandomId, Keyboard } from 'vk-io';

import { PagesBuilder, PagesManager } from '../esm/index.mjs';

const token = process.env.TOKEN;

const vk = new VK({
    token
});

const createContext = (params) => ({
    senderId: 512950458,
    send: (params) => vk.api.messages.send({
        peer_id: 512950458,
        random_id: getRandomId(),
        ...params
    }),
    ...params
});

const builder = new PagesBuilder({
    api: vk.api,
    context: createContext()
});

describe('Pages', () => {
    const page = 'Test';

    const pages = [
        page,
        {
            message: page
        },
        () => page,
        () => new Promise((resolve) =>
            setTimeout(() => resolve({
                message: page
            }), 1000)
        )
    ];

    it('Установка и получение установленых страниц', async () => {
        builder.setPages(pages);

        for (let i = 1; i <= builder.pages.length; i++) {
            const builderPage = await builder.getPage(i);

            assert.deepStrictEqual(builderPage, {
                message: `${page}\n\n${i} / 4`,
                keyboard: builder.keyboard.toString()
            });
        }
    });

    if (token) {
        it('Сборка и отправка одной страницы', async () => {
            builder.setPages('Test');

            builder.sentContext = createContext();

            await builder.build();
        });

        it('Сборка и отправка страниц разного типа', async () => {
            builder.setPages(pages);
            builder.addPages('Test');
            builder.addPages(pages);

            builder.sentContext = createContext();

            await builder.build();

            builder.sentContext = createContext();

            for (let i = 2; i <= builder.pages.length; i++) {
                await builder.setPage(i);

                builder.sentContext = createContext();
            }
        });
    }

    it('Изменение метода отправки страниц и проверка изменений', () => {
        const sendMethod = 'editMessage';

        builder.setSendMethod(sendMethod);

        assert.ok(builder.sendMethod === sendMethod);
    });
});

describe('Keyboard', () => {
    it('Обновление клавиатуры и проверка изменений', () => {
        const keyboard = Keyboard.builder()
            .textButton({
                label: 'test'
            });

        builder.updateKeyboard(keyboard);

        assert.deepStrictEqual(builder.keyboard, keyboard);
    });
});

describe('Listen', () => {
    it('Установка пользователей для прослушивания и проверка изменений', () => {
        builder.setListenUsers(1);
        builder.addListenUsers([2]);

        assert.deepStrictEqual(builder.listenUsers, [1, 2]);
    });

    it('Установка времени прослушивания и проверка изменений', () => {
        const listenTime = 10000;

        builder.setListenTime(listenTime);

        assert.deepStrictEqual(builder.listenTime, listenTime);
    });

    if (token) {
        it('Остановка прослушивания', () => {
            builder.stopListen();

            assert.ok(PagesManager.hasBuilder(builder.id) === false);
        });
    }
});

describe('Triggers', () => {
    it('Установка триггеров и проверка работы одного из них', async () => {
        let number = 1;

        builder.setTriggers({
            name: 'test',
            callback() {
                number = 2;
            }
        });

        builder.addTriggers([
            {
                name: 'test2',
                callback() {}
            }
        ]);

        await builder.executeTrigger('test');

        assert.ok(number === 2);
    });
});
