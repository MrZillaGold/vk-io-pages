# Listen
<dl>
<dt><a href="#setListenTime">setListenTime(time)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для установки времени прослушивания обновлений для переключения страниц</p></dd>

<dt><a href="#setListenUsers">setListenUsers(users)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для установки прослушивания определенных пользователей</p></dd>

<dt><a href="#addListenUsers">addListenUsers(users)</a> ⇒ <code>this</code>;</dt>
<dd><p>Метод для добавления прослушивания определенных пользователей</p></dd>

<dt><a href="#stopListen">stopListen();</a></dt>
<dd><p>Метод для досрочной остановки прослушивания новых сообщений</p></dd>
</dl>

<a name="setListenTime"></a>

## setListenTime(time) ⇒ <code>this</code>;
Метод для установки времени прослушивания обновлений для переключения страниц

**Возвращает**: `this` - Текущий контекст билдера

| Параметры | Тип      | По умолчанию       | Описание                            |
| --------- | -------- | ------------------ | ----------------------------------- |
| time      | `number` | `300000` (5 минут) | Время прослушивания в миллисекундах |

**Пример**:

```js
builder.setListenTime(40000);
```

<a name="setListenUsers"></a>

## setListenUsers(users) ⇒ <code>this</code>;
Метод для установки прослушивания определенных пользователей

**Возвращает**: `this` - Текущий контекст билдера

| Параметры | Тип              | По умолчанию            | Описание                      |
| --------- | ---------------- | ----------------------- | ----------------------------- |
| users     | `Array` `number` | `[]` Любой пользователь | Пользватели для прослушивания |

**Пример**:

```js
const builder = context.pageBuilder();

builder.setListenUsers(233731786);
builder.setListenUsers([233731786, 344339736]);
```

<a name="addListenUsers"></a>

## addListenUsers(users) ⇒ <code>this</code>;
Метод для добавления прослушивания определенных пользователей

**Возвращает**: `this` - Текущий контекст билдера

| Параметры | Тип              | По умолчанию            | Описание                      |
| --------- | ---------------- | ----------------------- | ----------------------------- |
| users     | `Array` `number` | `[]` Любой пользователь | Пользватели для прослушивания |

**Пример**:

```js
const builder = context.pageBuilder();

builder.setListenUsers(233731786);
builder.setListenUsers([233731786, 344339736]);
```

<a name="stopListen"></a>

## stopListen();
Метод для досрочной остановки прослушивания новых сообщений

**Пример**:

```js
const builder = context.pageBuilder();

builder.build()
    .stopListen();
```
