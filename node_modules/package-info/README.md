# package-info  v2.2.3

[![Join the chat at https://gitter.im/AlessandroMinoccheri/package-info](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/AlessandroMinoccheri/package-info?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://api.travis-ci.org/AlessandroMinoccheri/package-info.png)](https://travis-ci.org/AlessandroMinoccheri/package-info)

> Get the information of a npm package and return an object

Fetches the information directly from the registry 

https://www.npmjs.org/package/package-info

To create this repository I have forked this project and make some edit:

https://github.com/sindresorhus/npm-name

Thanks to the author https://github.com/sindresorhus

The information that you can retrieve are:
- <b>package name</b>
- <b>package version</b>
- <b>package description</b>
- <b>package license</b>
- <b>package homepage</b>
- <b>package author name</b> (from the 2.1.0 version 'author name' can be the list of maintainers who have contributed to the package, if this parameter is specified in the package.json of the package.)

## Install

```sh
$ npm install --save package-info
```


## Usage

```js
var info = require('package-info');

info('package-info', function (err, informations) {
	console.log(informations);
});
```

## CLI

```sh
$ npm install --global package-info
```

```sh
$ package-info --help

Usage
  $ package-info <package-name>

Example
  $ package-info package-info
```

It will prints:
```
name: package-info 
version: 2.2.3
description: Get the information of a npm package 
license: MIT
homepage: https://github.com/AlessandroMinoccheri/package-info
author: Alessandro Minoccheri
```

## License

The MIT License (MIT)

Copyright (c) 2014 Alessandro Minoccheri

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

