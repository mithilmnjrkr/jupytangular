var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var project = typeof project === 'undefined' ? path.join(PROFILE_PATH, 'Documents/portal') : project;
var importer = require('../Core');

process.chdir(project)
var gulp = require('gulp');
var run = require('gulp-run');
var tap = require('gulp-tap');

gulp.task('git watch', function () {
    return run('git diff -w a229417..498d5a5')
        .pipe(tap(file => console.log(file)))
        .pipe(gulp.dest('output'));
});

var getBranchBoundaries = (p) => {
    project = p;
    return importer.import('gulp task to a Promise', {gulp})
        .then(gulpPromise => gulpPromise(['git watch']))
}
module.exports = getBranchBoundaries;
getBranchBoundaries;

$$.async();
getBranchBoundaries(project)
    .then(r => $$.sendResult(r))
    .catch(e => $$.sendError(e));

