# Pages
<dl>
<dt><a href="#setPages">setPages(pages)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для начальной установки страниц</p></dd>

<dt><a href="#addPages">addPages(pages)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для добавление страниц в конец</p></dd>

<dt><a href="#setPage">setPage(pageNumber)</a> ⇒ <code>Promise</code>;</dt>
<dd><p>Метод для открытия определенной страницы</p></dd>

<dt><a href="#autoResetTimeout">autoResetTimeout(status)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для установки автоматического сброса таймера при переключении между страницами</p></dd>

<dt><a href="#setPagesNumberFormat">setPagesNumberFormat(format)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для установки формата нумерования страниц</p></dd>

<dt><a href="#setInfinityLoop">setInfinityLoop(status)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для установки бесконечного переключения между страницами при достижении конца</p></dd>

<dt><a href="#setPagesHeader">setPagesHeader(header)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для установки верхней части страниц</p></dd>

<dt><a href="#setPagesFooter">setPagesFooter(footer)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для установки нижней части страниц</p></dd>

<dt><a href="#setSendMethod">setSendMethod(method)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для установки метода отправки страницы</p></dd>
</dl>

<a name="setPages"></a>

## setPages(pages) ⇒ <code>this</code>;
Метод для начальной установки страниц

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры        | Тип                                  | Описание                |
| ---------------- | ------------------------------------ | ----------------------- |
| pages            | `Array` `function` `string` `object` | Страницы для добавления |

**Пример**:

```js
const builder = context.pageBuilder();

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

## addPages(pages) ⇒ <code>this</code>;
Метод для добавления страниц в конец

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры        | Тип                                  | Описание                |
| ---------------- | ------------------------------------ | ----------------------- |
| pages            | `Array` `function` `string` `object` | Страницы для добавления |

<a name="setPage"></a>

## setPage(pageNumber) ⇒ <code>Promise</code>;
Метод для открытия определенной страницы

**Возвращает**: `Promise` - Результат отправки/редактирования сообщения

| Параметры   | Тип      | Описание       |
| ----------- | -------- | -------------- |
| pageNumber  | `number` | Номер страницы |

**Пример**:

```js
const builder = context.pageBuilder();

builder.build()
    .setPage(2);
```

<a name="autoResetTimeout"></a>

## autoResetTimeout(status) ⇒ <code>this</code>;
Метод для установки автоматического сброса таймера при переключении между страницами

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры | Тип       | По умолчанию | Описание                                |
| --------- | --------- | ------------ | --------------------------------------- |
| status    | `boolean` | `true`       | Значение автоматического сброса таймера |

**Пример**:

```js
const builder = context.pageBuilder();

builder.autoResetTimeout();
```

<a name="setPagesNumberFormat"></a>

## setPagesNumberFormat(format) ⇒ <code>this</code>;
Метод для установки формата нумерования страниц

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры | Тип      | По умолчанию | Описание                                                            |
| --------- | -------- | ------------ | ------------------------------------------------------------------- |
| format    | `string` | `"%c / %m"`  | Формат нумерования. (`%c` - Текущая страница, `%m` - Всего страниц) |

**Пример**:

```js
const builder = context.pageBuilder();

builder.setPageNumberFormat("Текущая страница %с / Всего страниц %m");
```

<a name="setInfinityLoop"></a>

## setInfinityLoop(status) ⇒ <code>this</code>;
Метод для установки бесконечного переключения между страницами при достижении конца

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры | Тип       | По умолчанию | Описание                                                |
| --------- | --------- | ------------ | ------------------------------------------------------- |
| status    | `Boolean` | `true`       | Значение для бесконечного переключения между страницами |

💡 При значении `status` = `false`, кнопки быстрых действий будут удаляться в зависимости от того, имеют ли они смысл для текущей страницы.

**Пример**:

```js
const builder = context.pageBuilder();

builder.setInfinityLoop(false);
```

<a name="setPagesHeader"></a>

## setPagesHeader(header) ⇒ <code>this</code>;
Метод для установки верхней части страниц

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры | Тип       | По умолчанию | Описание                         |
| --------- | --------- | ------------ | -------------------------------- |
| header    | `string`  | `""`         | Строка для верхней части страниц |

**Пример**:

```js
const builder = context.pageBuilder();

builder.setPagesHeader("Заголовок страницы");
```

<a name="setPagesFooter"></a>

## setPagesFooter(footer) ⇒ <code>this</code>;
Метод для установки нижней части страниц

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры | Тип       | По умолчанию | Описание                        |
| --------- | --------- | ------------ | ------------------------------- |
| footer    | `string`  | `""`         | Строка для нижней части страниц |

**Пример**:

```js
const builder = context.pageBuilder();

builder.setPagesFooter("Нижняя часть страницы");
```

<a name="setSendMethod"></a>

## setSendMethod(method) ⇒ <code>this</code>;
Метод для установки метода отправки страницы

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры | Тип                   | По умолчанию  | Описание                                              |                                                  |
| --------- | --------------------- | ------------- | ----------------------------------------------------- |
| method    | `"send_new"` `"edit"` | `"send_new"`  | Метод отправки. (Для бесед по-умолчанию `"send_new"`) |

**Пример**:

```js
const builder = context.pageBuilder();

builder.setSendMethod("send_new");
```
