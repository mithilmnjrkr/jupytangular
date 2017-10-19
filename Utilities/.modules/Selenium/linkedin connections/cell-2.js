var importer = require('../Core');
var fs = require('fs');

var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var project = PROFILE_PATH + '/Conversations';

var getAllUntil, getAllXPath;
var listAllConnections = () => {
    var friends = [];
    if (fs.existsSync(project + '/connections.json')) {
        return Promise.resolve(JSON.parse(
            fs.readFileSync(project + '/connections.json')));
    }
    return client
        .then(() => importer.import([
            'get all elements until',
            'all xpath elements'
        ], {client}))
        .then(r => {
            getAllUntil = r[0];
            getAllXPath = r[1];
            return client.getUrl();
        })
        .url('https://www.linkedin.com/mynetwork/invite-connect/connections/')
        .pause(3000)
        .then(() => getAllUntil(
            false,
            '//a[contains(@href, "/in/")]/@href',
            friends,
            (a, b) => a === b,
            (i) => i < 100
        ))
        .then(r => r.filter((l, i, arr) => arr.indexOf(l) === i))
        .then(r => {
            fs.writeFileSync(
                project + '/connections.json',
                JSON.stringify(r, null, 4));
            return r;
        })
        .catch(e => console.log(e))
};
module.exports = listAllConnections;
