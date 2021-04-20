# Начало
### Установка 📦
`npm i vk-io-pages`

### Документация 📖
| 📖 [Методы](methods.md) | 📡 [События](events.md) | 🤖 [Примеры](examples) |
| ----------------------- | ---------------------- | ---------------------- |

### Использование 📦
```js
import { PagesManager } from "vk-io-pages"; // ESM
// или
const { PagesManager } = require("vk-io-pages"); // CommonJS

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
	const builder = context.pageBuilder();
    
    builder.setPages([
        "1 страница",
        "2 страница"
    ])
    .build();
});
pagesManager.onFallback((context) => { // Обработчик, если сборщик не существует
    context.send("Время действия этой страницы закончилось, вызовите команду заново.")
});

vk.updates.start().catch(console.error);
```
