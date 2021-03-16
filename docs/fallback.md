# Fallback
<dl>
<dt><a href="#onFallback">onFallback(handler)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для установки обработчика при отсутствии сборщика</p></dd>

<dt><a href="#hasBuilder">hasBuilder(builderId)</a> ⇒ <code>boolean</code>;</dt>
<dd><p>Функция для проверки наличия сборщика</p></dd>
</dl>

<a name="onFallback"></a>

## onFallback(handler) ⇒ <code>this</code>;
Метод для установки обработчика при отсутствии сборщика

**Возвращает**: `this` - Текущий контекст менеджера

| Параметры | Тип         | Описание   |
| --------- | ----------- | ---------- |
| handler   | `function`  | Обработчик |

[**Пример**](examples/fallback-example.js):

```js
const pagesManager = new PagesManager();

pagesManager.onFallback((context, next) => {
    context.send("Время действия этой страницы закончилось, вызовите команду заново.");
});
```

<a name="hasBuilder"></a>

## hasBuilder(builderId) ⇒ <code>boolean</code>;
Функция для проверки наличия сборщика

**Возвращает**: `boolean` - Логическое значение наличия сборщика

| Параметры  | Тип      | Описание    |
| ---------- | -------- | ----------- |
| builderId  | `string` | ID-Сборщика |

**Пример**:

```js
const builder = context.pageBuilder()
            .build();

console.log(PagesManager.hasBuilder(builder.builder_id));
```
