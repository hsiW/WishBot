;(function(global, factory){
    if (typeof exports === "object") {
        module.exports = factory();
    }
    else if ( typeof define === 'function' && define.amd ) {
        define(factory);
    }
    else {
        global.StyledConsole = factory();
    }
})(this, function() {
;
var TagParser = function() {
    if (!(this instanceof TagParser)) {
        return new TagParser(contents);
    }
};

TagParser.prototype = {
    bind: function(type, callback) {
        if (!this._events) {
            this._events = {};
        }
        var events = this._events[type] = this._events[type] || [];
        events.push(callback);
    },
    unbind: function(type, callback) {
        if (!this._events) {
            return;
        }
        if (!type) {
            this._events = void 0;
            return;
        }
        if (!this._events[type]) {
            return;
        }
        if (!callback) {
            delete this._events[type];
            return;
        }
        var events = this._events[type] = this._events[type] || [];
        var i, len = events.length, remaining = [];
        for (i = 0; i < len; i++) {
            if (events[i] !== callback) {
                remaining.push(events[i]);
            }
        }
        if (remaining.length) {
            this._events[type] = remaining;
        } else {
            delete this._events[type];
        }
    },
    trigger: function(type) {
        var args = [].slice.call(arguments, 1);
        if (!this._events || !this._events[type]) {
            return;
        }
        var events = this._events[type];
        var i, len = events.length;
        for (i = 0; i < len; i++) {
            events[i].apply(this, args);
        }
    },
    parse: function(contents) {
        var tagStack = [];
        while (contents !== '') {
            var matches = null;

            // open tag
            if (matches = contents.match(/^<([^>\/]+)>/)) {
                var tagPlainString = matches[1];
                var tagName = tagPlainString;
                var parseMatch = null;
                if (parseMatch = tagPlainString.match(/\s/)) {
                    tagName = tagPlainString.substr(parseMatch.index);
                }
                var tagObj = {
                    name: tagName,
                    plainString: tagPlainString
                };
                tagStack.push(tagObj);

                this.trigger('open', tagObj);
                this.trigger('open:success', tagObj);
                contents = contents.substr(matches[0].length);

            // close tag
            } else if (matches = contents.match(/^<\/([^>]+)>/)) {
                var
                tagName = matches[1],
                currentTag = null, i, failCount = 0

                for (i = tagStack.length; i--;) {
                    currentTag = tagStack[i];
                    if (currentTag.name === tagName) {
                        break;
                    }
                    failCount++;
                }
                if (currentTag && currentTag.name === tagName) {
                    var tagObj = tagStack.pop();
                    for (i = 0; i < failCount; i++) {
                        this.trigger('close:fail', tagObj);
                        tagObj = tagStack.pop();
                    }
                    this.trigger('close', tagObj);
                    this.trigger('close:success', tagObj);
                } else {
                    var tagObj = {
                        name: tagName
                    };
                    this.trigger('close', tagObj);
                    this.trigger('close:fail', tagObj);
                }

                contents = contents.substr(matches[0].length);

            // contents
            } else if (matches = contents.match(/</)) {
                var searched = matches.index;
                this.trigger('text', contents.substr(0, searched), tagStack);
                contents = contents.substr(searched);

            // End of contents
            } else {
                this.trigger('text', contents, tagStack);
                contents = '';
            }
        }
    }
};

;
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

;
    return StyledConsole;
});
