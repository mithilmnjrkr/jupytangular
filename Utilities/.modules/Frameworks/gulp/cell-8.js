var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var project = typeof project === 'undefined' ? path.join(PROFILE_PATH, 'Documents/universal') : project;
var importer = require('../Core');

$$.async();
importer.import('fix project paths')
    .then(projectRelatives => projectRelatives(project))
    //.then(r => console.log(r))
    .then(r => $$.sendResult(r))
    .catch(e => $$.sendError(e));

