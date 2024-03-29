# Pages
<dl>
<dt><a href="#setPages">setPages(pages)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для начальной установки страниц</p></dd>

<dt><a href="#addPages">addPages(pages)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для добавление страниц в конец</p></dd>

<dt><a href="#autoGeneratePages">autoGeneratePages(options)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для автоматической генерации страниц</p></dd>

<dt><a href="#setPage">setPage(pageNumber)</a> ⇒ <code>Promise<MessageContext></code>;</dt>
<dd><p>Метод для открытия определенной страницы</p></dd>

<dt><a href="#autoResetTimeout">autoResetTimeout(status)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для установки автоматического сброса таймера при переключении между страницами</p></dd>

<dt><a href="#setPagesNumberFormat">setPagesNumberFormat(format)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для установки формата нумерования страниц</p></dd>

<dt><a href="#setInfinityLoop">setInfinityLoop(status)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для установки бесконечного переключения между страницами при достижении конца</p></dd>

<dt><a href="#setPagesHeader">setPagesHeader(header)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для установки верхней части страниц</p></dd>

<dt><a href="#setPagesFooter">setPagesFooter(footer)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для установки нижней части страниц</p></dd>

<dt><a href="#setSendMethod">setSendMethod(method)</a> ⇒ <code>PagesBuilder</code>;</dt>
<dd><p>Метод для установки метода отправки страницы</p></dd>
</dl>

<a name="setPages"></a>

## setPages(pages) ⇒ <code>PagesBuilder</code>;
Метод для начальной установки страниц

**Возвращает**: `PagesBuilder`

| Параметры        | Тип                                  | Описание                |
| ---------------- | ------------------------------------ | ----------------------- |
| pages            | `Array` `function` `string` `object` | Страницы для добавления |

**Пример**:

```js
const builder = context.pagesBuilder();

builder.setPages("Текстовая страница");
builder.setPages(async () => {
    const data = await Promise((resolve) => {
        setTimeout(() => resolve("Некоторые данные"), 4000);
    });

    // Необходимо сохранить данные после запроса,
    // чтобы не выполнять запрос после каждого открытия страницы.
    // Подробнее в примерах.

    return {
        message: `Функцианальная страница с запросом при переходе на нее. ${data}`
    }
});
builder.setPages({
    message: "Страница - объект",
    attachment: "photo-1_456239099"
});

builder.setPages([
    "Страница 1",
    () => "Страница 2",
    {
        message: "Страница 3"
    }
]);
```

<a name="addPages"></a>

## addPages(pages) ⇒ <code>PagesBuilder</code>;
Метод для добавления страниц в конец

**Возвращает**: `PagesBuilder`

| Параметры | Тип                                  | Описание                |
| --------- | ------------------------------------ | ----------------------- |
| pages     | `Array` `function` `string` `object` | Страницы для добавления |

<a name="setPage"></a>

## setPage(pageNumber) ⇒ <code>Promise<MessageContext></code>;
Метод для открытия определенной страницы

**Возвращает**: `Promise<MessageContext>` - Результат отправки/редактирования сообщения

| Параметры   | Тип      | Описание       |
| ----------- | -------- | -------------- |
| pageNumber  | `number` | Номер страницы |

**Пример**:

```js
const builder = context.pagesBuilder();

builder.build()
    .setPage(2);
```

<a name="autoGeneratePages"></a>

## autoGeneratePages(options) ⇒ <code>PagesBuilder</code>;
Метод для автоматической генерации страниц

**Возвращает**: `PagesBuilder`

| Параметры            | Тип        | По умолчанию | Описание                         |
| -------------------- | ---------- | ------------ | -------------------------------- |
| options              | `Object`   |              | Объект с параметрами             |
| options.items        | `string[]` |              | Массив со строчками              |
| options.countPerPage | `number`   | `10`         | Количсетво элементов на страницу |

**Пример**:

```js
const builder = context.pagesBuilder();

builder.autoGeneratePages({
    items: [
        "Item 1",
        "Item 2",
        "Item 3"
    ],
    countPerPage: 2
});
```

<a name="autoResetTimeout"></a>

## autoResetTimeout(status) ⇒ <code>PagesBuilder</code>;
Метод для установки автоматического сброса таймера при переключении между страницами

**Возвращает**: `PagesBuilder`

| Параметры | Тип       | По умолчанию | Описание                                |
| --------- | --------- | ------------ | --------------------------------------- |
| status    | `boolean` | `true`       | Значение автоматического сброса таймера |

**Пример**:

```js
const builder = context.pagesBuilder();

builder.autoResetTimeout();
```

<a name="setPagesNumberFormat"></a>

## setPagesNumberFormat(format) ⇒ <code>PagesBuilder</code>;
Метод для установки формата нумерования страниц

**Возвращает**: `PagesBuilder`

| Параметры | Тип      | По умолчанию | Описание                                                            |
| --------- | -------- | ------------ | ------------------------------------------------------------------- |
| format    | `string` | `"%c / %m"`  | Формат нумерования. (`%c` - Текущая страница, `%m` - Всего страниц) |

**Пример**:

```js
const builder = context.pagesBuilder();

builder.setPageNumberFormat("Текущая страница %с / Всего страниц %m");
```

<a name="setInfinityLoop"></a>

## setInfinityLoop(status) ⇒ <code>PagesBuilder</code>;
Метод для установки бесконечного переключения между страницами при достижении конца

**Возвращает**: `PagesBuilder`

| Параметры | Тип       | По умолчанию | Описание                                                |
| --------- | --------- | ------------ | ------------------------------------------------------- |
| status    | `Boolean` | `true`       | Значение для бесконечного переключения между страницами |

💡 При значении `status` = `false`, кнопки быстрых действий будут удаляться в зависимости от того, имеют ли они смысл для текущей страницы.

**Пример**:

```js
const builder = context.pagesBuilder();

builder.setInfinityLoop(false);
```

<a name="setPagesHeader"></a>

## setPagesHeader(header) ⇒ <code>PagesBuilder</code>;
Метод для установки верхней части страниц

**Возвращает**: `PagesBuilder`

| Параметры | Тип       | По умолчанию | Описание                         |
| --------- | --------- | ------------ | -------------------------------- |
| header    | `string`  | `""`         | Строка для верхней части страниц |

**Пример**:

```js
const builder = context.pagesBuilder();

builder.setPagesHeader("Заголовок страницы");
```

<a name="setPagesFooter"></a>

## setPagesFooter(footer) ⇒ <code>PagesBuilder</code>;
Метод для установки нижней части страниц

**Возвращает**: `PagesBuilder`

| Параметры | Тип       | По умолчанию | Описание                        |
| --------- | --------- | ------------ | ------------------------------- |
| footer    | `string`  | `""`         | Строка для нижней части страниц |

**Пример**:

```js
const builder = context.pagesBuilder();

builder.setPagesFooter("Нижняя часть страницы");
```

<a name="setSendMethod"></a>

## setSendMethod(method) ⇒ <code>PagesBuilder</code>;
Метод для установки метода отправки страницы

**Возвращает**: `PagesBuilder`

| Параметры | Тип                   | По умолчанию  | Описание                                              |
| --------- | --------------------- | ------------- | ----------------------------------------------------- |
| method    | `"send_new"` `"edit"` | `"send_new"`  | Метод отправки. (Для бесед по-умолчанию `"send_new"`) |

**Пример**:

```js
const builder = context.pagesBuilder();

builder.setSendMethod("send_new");
```
