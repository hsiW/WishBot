//? if (false) {
var TagParser = require('./tag-parser');
//? }

var clone = function(arr) {
    var i = 0, ilen = arr.length, carr = [];
    for (; i < ilen; i++) {
        carr[i] = arr[i];
    }
    return carr;
};

var fontColorCodes = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    purple: 35,
    cyan: 36,
    gray: 37,
    sblack: 90,
    sred: 91,
    sgreen: 92,
    syellow: 93,
    sblue: 94,
    spurple: 95,
    scyan: 96,
    sgray: 97
};

var backgroundColorCodes = {
    black: 40,
    red: 41,
    green: 42,
    yellow: 43,
    blue: 44,
    purple: 45,
    cyan: 46,
    gray: 47,
    sblack: 100,
    sred: 101,
    sgreen: 102,
    syellow: 103,
    sblue: 104,
    spurple: 105,
    scyan: 106,
    sgray: 107
};

var pattern = /\<([a-zA-Z0-9_-]+(?:\:[a-zA-Z0-9_-]+)?)\>([^\<]*)\<\/\1\>/;

var getCodeFromTag = function(tag) {
    tag = tag.trim();
    switch (tag) {
        case "strong":
        case "b":
            return 1;
        case "underline":
        case "u":
            return 4;
    }
    if (tag.indexOf('color:') === 0 || tag.indexOf('c:') === 0) {
        return getFontColorCodeFromTag(tag);
    }
    if (tag.indexOf('background:') === 0 || tag.indexOf('b:') === 0) {
        return getBackgroundColorCodeFromTag(tag);
    }
    throw new {
        message: "the tag named '{tag}' does not exist.",
        code: 1
    };
};

var getFontColorCodeFromTag = function(tag)
{
    var color = tag.substr(tag.indexOf(':') + 1);

    if (!fontColorCodes[color]) {
        throw new {
            message: "the font color named '" + color + "' does not exist.'", 
            code: 2
        };
    }
    return fontColorCodes[color];
};

var getBackgroundColorCodeFromTag = function(tag)
{
    var color = tag.substr(tag.indexOf(':') + 1);

    if (!backgroundColorCodes[color]) {
        throw new {
            message: "the background color named '" + color + "' does not exist.'", 
            code: 4
        };
    }
    return backgroundColorCodes[color];
};

var StyledConsole = function(options) {
    if (!(this instanceof StyledConsole)) {
        return new StyledConsole();
    }
    options = options || {};

    this._parser = new TagParser();
};

StyledConsole.prototype = {
    parse: function(contents) {

        var parsedContents = '';
        var closed = true;
        
        this._parser.bind('text', function(text, tags) {
            var styles = [];
            var i, len;
            for (i = 0, len = tags.length; i < len; i++) {
                try {
                    styles.push(getCodeFromTag(tags[i].name));
                } catch(e) {}
            }
            if (!closed) {
                parsedContents += "\x1b[0m";
                closed = true;
            }
            if (styles.length) {
                parsedContents += "\x1b[" + styles.join(';') + "m";
                closed = false;
            }
            parsedContents += text;
        });

        this._parser.parse(contents);

        if (!closed) {
            parsedContents += "\x1b[0m";
        }

        return parsedContents.replace('&lt;', '<').replace('&gt;', '>');
    }
};

//? if (false) {
module.exports = StyledConsole;
//? }
