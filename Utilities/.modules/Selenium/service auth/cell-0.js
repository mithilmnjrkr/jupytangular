var path = require('path');
var rfs = require('fs').readFileSync;
var crypto = require('crypto');
var path = require('path');

var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var PASS_FILE = path.join(PROFILE_PATH, '.credentials', 'password.txt');
var PASSWORDS_FILE = path.join(PROFILE_PATH, '.credentials', 'passwords.json');
var pass = process.env.SELENIUM_PASS || rfs(PASS_FILE);

var decrypt = (text) => {
    var decipher = crypto.createDecipher('aes-256-ctr', pass);
    var dec = decipher.update(text, 'hex', 'latin1');
    dec += decipher.final('latin1');
    return dec;
}

var getCredentials = (name) => {
    var resultSet = {};
    var passwords = JSON.parse(rfs(PASSWORDS_FILE));
    var set = passwords.filter(el => el.host == name)[0] || {};
    for (var i in set) {
        if (set.hasOwnProperty(i)) {
            if (i == 'added' || i == 'host') {
                resultSet[i] = set[i];
                continue;
            }
            resultSet[i] = decrypt(set[i]);
        }
    }
    return resultSet;
};
module.exports = getCredentials;
getCredentials;

