
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

//? if (false) {
module.exports = TagParser;
//? }
