var TagParser = require("../../src/tag-parser");

describe("the tag parser", function() {

    var parser;

    beforeEach(function() {
        parser = new TagParser();
    });

    it("tests the events' binding, unbinding", function() {
        expect(parser._events).toBeUndefined();
        var foo = function() {/* Foo */};
        var bar = function() {/* Bar */};
        parser.bind("foo", foo);
        expect(parser._events).toEqual({
            'foo' : [foo]
        });

        parser.bind("foo", bar);
        expect(parser._events).toEqual({
            'foo' : [foo, bar]
        });

        parser.unbind("foo", foo);
        expect(parser._events).toEqual({
            'foo' : [bar]
        });

        parser.unbind("foo");
        expect(parser._events).toEqual({});

        parser.unbind();
        expect(parser._events).toBeUndefined();
    });

    it("tests the events' trigger", function() {
        var foo = jasmine.createSpy('foo');

        parser.bind("foo", foo);

        parser.trigger("foo", '?');
        parser.trigger("foo", 1, 2, 3);

        expect(foo.calls.count()).toEqual(2);

        expect(foo).toHaveBeenCalledWith('?');
        expect(foo).toHaveBeenCalledWith(1, 2, 3);
    });

    it("tests open, close binding function with close warning", function() {
        var open = jasmine.createSpy("open");
        var closeSuccess = jasmine.createSpy("close:success");
        var closeFail = jasmine.createSpy("close:fail")
        parser.bind("open", open);
        parser.bind("close:success", closeSuccess);
        parser.bind("close:fail", closeFail);

        parser.parse("<a>abc</b></a>");

        expect(open.calls.count()).toEqual(1);
        expect(open).toHaveBeenCalledWith({
            name: 'a',
            plainString: 'a'
        });

        expect(closeFail.calls.count()).toEqual(1);
        expect(closeFail).toHaveBeenCalledWith({
            name: 'b'
        });

        expect(closeSuccess.calls.count()).toEqual(1);
        expect(closeSuccess).toHaveBeenCalledWith({
            name: 'a',
            plainString: 'a'
        });
    });

    it("tests open, close binding function with open warning", function() {
        var open = jasmine.createSpy("open");
        var closeSuccess = jasmine.createSpy("close:success");
        var closeFail = jasmine.createSpy("close:fail")
        parser.bind("open", open);
        parser.bind("close:success", closeSuccess);
        parser.bind("close:fail", closeFail);

        parser.parse("<a>a<b></a>");

        expect(open.calls.count()).toEqual(2);
        expect(open).toHaveBeenCalledWith({
            name: 'a',
            plainString: 'a'
        });
        expect(open).toHaveBeenCalledWith({
            name: 'b',
            plainString: 'b'
        });

        expect(closeFail.calls.count()).toEqual(1);
        expect(closeFail).toHaveBeenCalledWith({
            name: 'b',
            plainString: 'b'
        });

        expect(closeSuccess.calls.count()).toEqual(1);
        expect(closeSuccess).toHaveBeenCalledWith({
            name: 'a',
            plainString: 'a'
        });
    });

    it("tests text binding function", function() {
        var text = jasmine.createSpy("text");

        parser.bind("text", text);

        parser.parse("... <a>hello <b>wor</b>ld</a> kkk");

        expect(text.calls.count()).toEqual(5);

        expect(text).toHaveBeenCalledWith('... ', jasmine.any(Array));
        expect(text).toHaveBeenCalledWith('hello ', jasmine.any(Array));
        expect(text).toHaveBeenCalledWith('wor', jasmine.any(Array));
        expect(text).toHaveBeenCalledWith('ld', jasmine.any(Array));
        expect(text).toHaveBeenCalledWith(' kkk', jasmine.any(Array));
    });
});