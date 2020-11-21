# Keyboard
<dl>
<dt><a href="#setTriggers">setTriggers(triggers)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для начальной установки триггеров</p></dd>

<dt><a href="#addTriggers">addTriggers(triggers)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для добавления триггеров</p></dd>
</dl>

<a name="setTriggers"></a>

## setTriggers(triggers) ⇒ <code>this</code>;
Метод для начальной установки триггеров

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры  | Тип               | Описание        |
| ---------- | ----------------- | --------------- |
| triggers   | `Array` `object`  | Триггеры        |

**Пример**:

```js
const builder = context.pageBuilder();

builder.setTriggers({
    name: "test_trigger", // ID-Триггера
    callback() { // Функция которая выполняется при вызове триггера
        context.send("Активирован test_trigger");
    }
});

builder.setTriggers([
    {
        name: "test_trigger",
        callback() {
            context.send("Активирован test_trigger");
        }
    },
    {
        name: "custom_trigger",
        callback() {
            context.send("Активирован custom_trigger");
        }
    }
]);
```

<a name="addTriggers"></a>

## addTriggers(triggers) ⇒ <code>this</code>;
Метод для добавления триггеров

**Возвращает**: `this` - Текущий контекст сборщика

| Параметры  | Тип               | Описание        |
| ---------- | ----------------- | --------------- |
| triggers   | `Array` `object`  | Триггеры        |
