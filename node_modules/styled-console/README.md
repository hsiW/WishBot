Styled Console
===

![Example](example.png)

## Install

### npm

```bash
$ npm install styled-console
```

## How To Use

> version 1.0.0 changed.

```js
var StyledConsole = require('styled-console');
var styledConsole = new StyledConsole; // or StyledConsole();
console.log(
    styledConsole.parse("<c:red>St<b><u>y</u>le</b>d</c:red> Con<u>so</u><b:blue>le</b:blue>.")
);
```

## Tags

### color codes list

- black
- red
- green
- yellow
- blue
- purple
- cyan
- gray
- sblack (soft black)
- sred (soft red)
- sgreen
- syellow
- sblue
- spurple
- scyan
- sgray

### `<c:{colorCode}>` or `<color:{colorCode}>`

Change font color.

### `<b:{colorCode}>` or `<background:{colorCode}>`

Change background color.

### `<b>` or `<strong>`

Apply bold text.

### `<u>` or `<underline>`

Apply underlined text.


