# События

Вы можете подписываться на события и выполнять определённые действия при их активации.

```js
const builder = context.pageBuilder();

builder.on("page_update", (page) => {
    console.log(page);
});
```
### Pages

| Событие               | Передаваемые данные                        | Описание                                                                 |
| --------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| `page_set`            | `page` (`number`) - Номер текущей страницы | Изменение текущей страницы на другую                                     |
| `page_action_execute` | `action` (`string`) - Название действия    | Выполнено [быстрое действие](keyboard.md#setDefaultButtons) со страницей |

### Listen

| Событие                | Передаваемые данные | Описание                             |
| ---------------------- | ------------------- | ------------------------------------ |
| `listen_stop`          |                     | Остановка прослушивание              |
| `listen_start`         |                     | Начало прослушивания                 |
| `listen_reset_timeout` |                     | Сброс времени прослушивания страницы |

### Triggers

| Событие            | Передаваемые данные                 | Описание                |
| ------------------ | ----------------------------------- | ----------------------- |
| `trigger_execute`  | `trigger` (`string`) - Имя триггера | Выполнен триггер        |
