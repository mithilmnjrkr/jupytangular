var execSync = require('child_process').execSync;
try {
    require.resolve('glob');
} catch (e) {
    execSync('npm install glob');
}
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var translateRegex = (/[\{"]([^><"]*?)\s*\|\s*translate\s*(:\s*[^><"\}]*?)?["\}]/ig);
var cwd = '/Users/briancullinan/Documents/portal/src/';
//var cwd = 'C:\\Users\\brian.cullinan\\Documents\\portal\\src\\';
var files = glob.sync('**/*component.html', {
    ignore: '**/temp-demo-pages/**',
    cwd: cwd
});
var translations = files.map((f, i) => {
    var html = fs.readFileSync(path.join(cwd, f)).toString();
    let r;
    var translateStrings = [];
    while ((r = translateRegex.exec(html)) !== null) {
        translateStrings[translateStrings.length] = r[1].trim().replace(/[\'{}\s]/ig, '');
    }
    var desiredKey = f
        .replace('app/', '')
        .replace(/\//ig, '.')
        .replace('.component.html', '')
        .replace(/-/ig, '').split('.');
    desiredKey.pop();
    desiredKey = desiredKey.join('.').toUpperCase();
    var result = {};
    result[desiredKey] = translateStrings;
    return result;
});

var translationKeys = translations.reduce((obj, tr) => {
    var key = Object.keys(tr).pop();
    if (typeof obj[key] !== 'undefined') {
        obj[key] = obj[key].concat(tr[key]);
    } else {
        obj[key] = tr[key];
    }
    return obj;
}, {});

function findMisplaced(obj, parentKey) {
    for (var k in obj) {
        if (typeof obj[k] == 'object' && obj[k] !== null) {
            var newParent = typeof parentKey !== 'undefined' ? (parentKey + '.' + k) : k;
            findMisplaced(obj[k], newParent);
        } else if (typeof obj[k] == 'string') {
            if (obj[k].substr(0, parentKey.length) != parentKey) {
                console.log('Misplaced key: ' + obj[k] + ' in ' + parentKey);
            }
        }
    }
}

findMisplaced(translationKeys);

// get a long list of existing keys from en.js
var enJson = JSON.parse(fs.readFileSync(path.join(cwd, 'assets', 'i18n', 'en.json')).toString());


function flattenAllKeys(obj, parentKey) {
    var result = [];
    for (var k in obj) {
        if (typeof obj[k] == 'object' && obj[k] !== null) {
            var newParent = typeof parentKey !== 'undefined' ? (parentKey + '.' + k) : k;
            result = result.concat(flattenAllKeys(obj[k], newParent));
        } else if (typeof obj[k] == 'string'
            && parentKey.indexOf('TEMPDEMOPAGES') === -1) {
            result[result.length] = parentKey + '.' + k;
        }
    }
    return result;
}

var allENKeys = flattenAllKeys(enJson);

// find unused keys
function getUnused() {
    allENKeys.forEach(k => {
        var parentKey = k.split('.');
        parentKey.pop();
        parentKey = parentKey.join('.');
        if (typeof translationKeys[parentKey] === 'undefined' ||
            translationKeys[parentKey].indexOf(k) === -1) {
            console.log('Unused key: ' + k);
        }
    });
}

function getMissing() {
    for (var k in translationKeys) {
        if (typeof translationKeys[k] !== 'undefined') {
            translationKeys[k].forEach(i => {
                if (allENKeys.indexOf(i) === -1) {
                    console.log('Missing key: ' + i);
                }
            });
        }
    }
}

getMissing();
getUnused();


// find strings of text in html files
var htmlWordRegex = (/>[^><]*?(\b[^><]*\b)+[^><]*?</ig)
var attrWordRegex = (/(placeholder|title|alt)\s*=\s*["]([^"]*)["]/ig);
var needTranslations = files.map((f, i) => {
    var html = fs.readFileSync(path.join(cwd, f)).toString();
    let r;
    var needTranslations = [];
    while ((r = htmlWordRegex.exec(html)) !== null) {
        if (r[1].trim() !== '' && r[1].match(/\|\s*translate/ig) === null) {
            needTranslations[needTranslations.length] = r[1].trim();
        }
    }
    while ((r = attrWordRegex.exec(html)) !== null) {
        if (r[2].match(/\|\s*translate/ig) === null) {
            needTranslations[needTranslations.length] = r[2].trim();
        }
    }
    return {file: f, texts: needTranslations};
}).filter(t => t.texts.length > 0);

needTranslations.forEach(t => {
    console.log('Needs translating: ' + t.texts + ' in ' + t.file);
});


