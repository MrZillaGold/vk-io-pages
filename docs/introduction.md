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


const pagesManager = new PagesManager({
    api: vk.api // API нужен для отметки сообщений прочитанными, по желанию можете не передавать.
});
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

vk.updates.start().catch(console.error);
```
