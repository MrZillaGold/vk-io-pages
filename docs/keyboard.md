# Keyboard
<dl>
<dt><a href="#setDefaultButtons">setDefaultButtons(buttons, type)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для установки кнопок по умолчанию</p></dd>

<dt><a href="#updateKeyboard">updateKeyboard(keyboard)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для обновления клавиатуры</p></dd>
</dl>

<a name="setDefaultButtons"></a>

## setDefaultButtons(buttons, type) ⇒ <code>PagesBuilder</code>;
Метод для установки кнопок по умолчанию

**Возвращает**: `PagesBuilder`

| Параметры | Тип                                                 | По умолчанию                                        | Описание        |
| --------- | --------------------------------------------------- | --------------------------------------------------- | --------------- |
| buttons   | [`"first"`, `"back"`, `"stop"`, `"next"`, `"last"`] | [`"first"`, `"back"`, `"stop"`, `"next"`, `"last"`] | Названия кнопок |
| type      | `"text"` `"callback"`                               | `"text"`                                            | Тип кнопок      |

💡 При значении [`infinityLoop`](pages.md#setInfinityLoop) = `false`, кнопки быстрых действий будут удаляться в зависимости от того, имеют ли они смысл для текущей страницы.

**Пример**:

```js
const builder = context.pageBuilder();

builder.setDefaultButtons(["stop", "next", "last"], "callback");
```

<a name="updateKeyboard"></a>

## updateKeyboard(keyboard) ⇒ <code>PagesBuilder</code>;
Метод для обновления клавиатуры

**Возвращает**: `PagesBuilder`

| Параметры | Тип                                                                                                                        | По умолчанию | Описание   |
| --------- | -------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| keyboard  | [`KeyboardBuilder`](https://github.com/negezor/vk-io/blob/master/docs/ru/api-reference/buttons/keyboard.md#builder-static) | `null`       | Клавиатура |

Сборщик страниц также реагирует на специальные значения передаваемые в payload:

| Параметры       | Тип                                           | Описание                                                                                        |
| --------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| builder_id      | `string`                                      | ID-Сборщика для реагирования, без него сборщик не сможет определить к кому относится кнопка     |
| builder_action  | `"first"` `"back"` `"stop"` `"next"` `"last"` | Действие для сборщика                                                                           |
| builder_page    | `number`                                      | Номер страницы, которую нужно открыть при нажатии. (Игнорируется, если передано `builder_action`) |
| builder_trigger | `string`                                      | ID-Триггера, который нужно вызвать в сборщике                                                   |

`builder_id` является обязательным параметром в payload при создании собственных кнопок.

**Пример**:

```js
const builder = context.pageBuilder();

const keyboard = builder.keyboard;

keyboard.textButton({
    label: "Название",
    payload: {
        builder_id: builder.id,
        builder_action: "next",
        builder_trigger: "custom_trigger",
        ...
    }
});

builder.updateKeyboard(keyboard);
```
