var styledConsole = require('./dist/styled-console.min')();

console.log(styledConsole.parse("<c:red>St<b><u>y</u>le</b>d</c:red> Con<u>so</u><b:blue>le</b:blue>."));

console.log(styledConsole.parse(
    "plain\n" + 
    "<strong>strong</strong>\n" + 
    "<underline>underline</underline>\n" + 
    "<c:black>black</c:black>\n" +
    "<c:red>red</c:red>\n" +
    "<c:green>green</c:green>\n" +
    "<c:yellow>yellow</c:yellow>\n" +
    "<c:blue>blue</c:blue>\n" +
    "<c:purple>purple</c:purple>\n" +
    "<c:cyan>cyan</c:cyan>\n" +
    "<c:gray>gray</c:gray>\n" +
    "<c:sblack>sblack</c:sblack>\n" +
    "<c:sred>sred</c:sred>\n" +
    "<c:sgreen>sgreen</c:sgreen>\n" +
    "<c:syellow>syellow</c:syellow>\n" +
    "<c:sblue>sblue</c:sblue>\n" +
    "<c:spurple>spurple</c:spurple>\n" +
    "<c:scyan>scyan</c:scyan>\n" +
    "<c:sgray>sgray</c:sgray>\n" +
    "<c:black>black</c:black>\n" +
    "<b:red>red</b:red>\n" +
    "<b:green>green</b:green>\n" +
    "<b:yellow>yellow</b:yellow>\n" +
    "<b:blue>blue</b:blue>\n" +
    "<b:purple>purple</b:purple>\n" +
    "<b:cyan>cyan</b:cyan>\n" +
    "<b:gray>gray</b:gray>\n" +
    "<b:sblack>sblack</b:sblack>\n" +
    "<b:sred>sred</b:sred>\n" +
    "<b:sgreen>sgreen</b:sgreen>\n" +
    "<b:syellow>syellow</b:syellow>\n" +
    "<b:sblue>sblue</b:sblue>\n" +
    "<b:spurple>spurple</b:spurple>\n" +
    "<b:scyan>scyan</b:scyan>\n" +
    "<b:sgray>sgray</b:sgray>\n"));

