var {JSDOM} = require('jsdom');
var path = require('path');
var fs = require('fs');

var PROJECT_PATH = PROFILE_PATH + '/Downloads';
var files = glob.sync('Takeout*/Chrome/Bookmarks.html', {cwd: PROJECT_PATH})
    .map(f => path.join(PROJECT_PATH, f));
files.sort((a, b) => fs.statSync(a).ctime - fs.statSync(b).ctime);
var BOOKMARKS_PATH = files.pop();

    var dom = new JSDOM(BOOKMARKS_PATH);
    return importer.import([
        .then(r => {
        .then(() => importer.import('all xpath elements', {
            client: {
                execute: (func, ...args) => Promise.resolve({
                    value: func.apply(dom.window.document, args)
                }),
                addCommand: () => {
                }
            },
            document: dom.window.document,
            XPathResult: {ORDERED_NODE_ITERATOR_TYPE: 5}
        }))
        .then(getAllXPath => importer.import('parse bookmarks file', {getAllXPath}))