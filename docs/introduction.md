# Начало
### Установка 📦
`npm i vk-io-pages`

### Документация 📖
| 📖 [Методы](methods.md) | 📡 [События](events.md) | 🤖 [Примеры](examples) |
| ----------------------- | ---------------------- | ---------------------- |

### Использование 📦
```js
import { PagesManager } from "vk-io-pages"; // ES6
// или
const { PagesManager } = require("vk-io-pages"); // ES5

const { VK } = require("vk-io");
const { HearManager } = require("@vk-io/hear");

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
                        });
    
    builder.setPages([
        "1 страница",
        "2 страница"
    ])
    .build();
});

vk.updates.start().catch(console.error);
```
