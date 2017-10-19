// npm install diff --save
var JsDiff = require('diff');
var Prism = require('prismjs');
//require('prismjs/plugins/keep-markup/prism-keep-markup');

var htmlEntities = (str) => str.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#' + i.charCodeAt(0) + ';');

var diffTwoTexts = (left, right) => {
    var diff = JsDiff.diffWords(left, right);
    var code = '';
    for (var i = 0; i < diff.length; i++) {
        if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
            var swap = diff[i];
            diff[i] = diff[i + 1];
            diff[i + 1] = swap;
        }

        if (diff[i].removed) {
            code += '<span class="del">' + htmlEntities(diff[i].value) + '</span>';
        } else if (diff[i].added) {
            code += '<span class="ins">' + htmlEntities(diff[i].value) + '</span>';
        } else {
            code += '<span>' + htmlEntities(diff[i].value) + '</span>';
        }
    }
    //code = Prism.highlight(code, Prism.languages.javascript)
    return `
<style>

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
    color: slategray;
}

.token.punctuation {
    color: #999;
}

.namespace {
    opacity: .7;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
    color: #905;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
    color: #690;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
    color: #a67f59;
    background: hsla(0, 0%, 100%, .5);
}

.token.atrule,
.token.attr-value,
.token.keyword {
    color: #07a;
}

.token.function {
    color: #DD4A68;
}

.token.regex,
.token.important,
.token.variable {
    color: #e90;
}

.token.important,
.token.bold {
    font-weight: bold;
}

.token.italic {
    font-style: italic;
}

.token.entity {
    cursor: help;
}
.del {
    text-decoration: none;
    background: #fadad7;
}
.ins {
    background: #eaf2c2;
    text-decoration: none;
}
</style>
<pre>` + code + `</pre>`;
}
module.exports = diffTwoTexts;
diffTwoTexts;

