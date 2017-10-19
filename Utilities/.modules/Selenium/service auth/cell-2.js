// add all passwords from passwords.html?
var importer = require('../Core');
var fs = require('fs');

var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var project = PROFILE_PATH + '/Documents/passwords.htm';

// How to convert a string to an Array of RegEx matches
var regexToArray = (ex, str, i = 0) => {
    var co = [];
    var m;
    while ((m = ex.exec(str)) && co.push(m[i])) ;
    return co;
};

var readPasswordsHtm = () => {
    return importer.import('add encrypted passwords.json')
        .then(saveCredentials => {
            var credentials;
            var passwords = fs.readFileSync(project).toString('utf16le');
            regexToArray(/TBODY[^>]*>[\s\S]*?\/TBODY/ig, passwords).forEach(b => {
                var creds = {};
                creds['host'] = (((/subcaption[^>]*>(.*?)<\/td>/ig)
                    .exec(b) || [])[1] || '').replace(/<wbr>/ig, '').toLowerCase();
                if (creds.host.trim() === '') {
                    return;
                }
                regexToArray(/<tr>[\s\S]*?<\/tr>/ig, b).forEach(f => {
                    var key = (((/field[^>]*>(.*?)<\/td>/ig)
                        .exec(f) || [])[1] || '').replace(/<wbr>/ig, '');
                    var value = (((/wordbreakfield[^>]*>(.*?)<\/td>/ig)
                        .exec(f) || [])[1] || '').replace(/<wbr>/ig, '');
                    if (key.trim() !== '') {
                        creds[key] = value;
                    }
                });
                credentials = saveCredentials(creds);
            });
            return credentials;
        })
};
module.exports = readPasswordsHtm;

// display login form and add to passwords.json?

