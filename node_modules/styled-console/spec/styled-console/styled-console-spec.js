describe("", function() {
    var StyledConsole = require("../../src/styled-console");

    var styledParser;

    beforeEach(function() {
        styledParser = new StyledConsole();
    });

    it("tests the method named 'parse'", function() {

        expect(styledParser.parse("<c:red>Hello</c:red>"))
            .toEqual("\033[31mHello\033[0m");

        expect(styledParser.parse("<c:red>Hello"))
            .toEqual("\033[31mHello\033[0m");

        expect(styledParser.parse("<c:red><strong>Hello</strong> World</c:red>"))
            .toEqual("\033[31;1mHello\033[0m\033[31m World\033[0m");

        expect(styledParser.parse("<c:red>Hello <u>World</u></c:red>"))
            .toEqual("\033[31mHello \033[0m\033[31;4mWorld\033[0m");

        expect(styledParser.parse("<c:red>&lt;<u>World</u>&gt;</c:red>"))
            .toEqual("\033[31m<\033[0m\033[31;4mWorld\033[0m\033[31m>\033[0m");

    });
});