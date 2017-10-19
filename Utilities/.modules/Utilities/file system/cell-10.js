var importer = require('../Core');
var gulp = require('gulp');
var tap = require('gulp-tap');
var XRegExp = require('xregexp');

// How to convert a string to an Array of RegEx matches
var regexToArray = (ex, str, i = 0) => {
    var co = [];
    var m;
    while ((m = re.exec(str)) && co.push(m[i])) ;
    return co;
};

var matchCurlyBraces = (contents) => {
    var newMatches = XRegExp.matchRecursive(contents, '{', '}', 'gi', {
        valueNames: ['literal', null, 'value', null]
    }).filter(m => m.name === 'value');
    //console.log(newMatches);
    return newMatches.reduce(
        (arr, m) => arr.concat(matchCurlyBraces(m.value)),
        newMatches);
};

var findLongFunctions = (project) => {
    var results = [];
    gulp.task('find long functions', function () {
        return gulp.src('**/*.+(ts|js|cs)', {
            ignore: ['**/node_modules/**',
                '**/dist/**',
                '**/typings/**',
                '**/packages/**',
                '**/*.spec*',
                '**/*.Tests/**'
            ], cwd: project
        })
            .pipe(tap(file => {
                const contents = file.contents.toString();
                try {
                    results = results.concat(matchCurlyBraces(contents)
                        .map(m => Object.assign(m, {path: file.path})));
                } catch (e) {
                    results = results.concat([{
                        name: 'value',
                        value: file.contents.toString(),
                        start: 0,
                        end: file.contents.length,
                        error: e,
                        path: file.path
                    }]);
                }
            }));
    });

    return importer.import('task to promise', {gulp})
        .then(tasksToPromise => tasksToPromise('find long functions'))
        .then(() => {
            var code = results.map(r => r.value);
            var topLevel = results
                .filter(r => code
                    .filter(c => c !== r.value && c.indexOf(r.value) > 0).length === 0);
            results = results
                .filter(m => topLevel.filter(c => c.value === m.value).length === 0);
            code = results.map(r => r.value);
            topLevel = topLevel.concat(results.filter(r => code
                .filter(c => c !== r.value && c.indexOf(r.value) > 0).length === 0));
            results = results
                .filter(m => topLevel.filter(c => c.value === m.value).length === 0);
            return results
                .filter(m => m.value.split(/\n/ig).length > 100)
        });
};
module.exports = findLongFunctions;

var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var project = PROFILE_PATH + '/Documents/asm/subscription.identitymanagement';
$$.async();
findLongFunctions(project)
    .then(e => $$.sendResult(e.map(m => m.path)))
    .catch(e => $$.sendError(e));

