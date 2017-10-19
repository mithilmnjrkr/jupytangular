var importer = require('../Core');

$$.async();
importer.import('selenium cell')
    .then(runSeleniumCell => runSeleniumCell('download passwords from google'))
    .then(downloadGooglePasswords => downloadGooglePasswords())
    .then(r => $$.sendResult(r))
    .catch(e => $$.sendError(e));

