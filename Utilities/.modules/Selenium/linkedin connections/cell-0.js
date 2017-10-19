var importer = require('../Core');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var project = PROFILE_PATH + '/Conversations';

var updateContact, listAllConnections, scrapeEntireLinkedInProfile,
    runSeleniumCell;
var syncLinkedInContacts = () => {
    var loaded;
    return importer.import([
        'update google contact',
        'selenium cell'
    ])
        .then(r => {
            updateContact = r[0];
            runSeleniumCell = r[1];
            return runSeleniumCell([
                'scrape linkedin contacts',
                'scrape entire linkedin profile'
            ]);
        })
        .then(r => {
            listAllConnections = r[0];
            scrapeEntireLinkedInProfile = r[1];
            loaded = glob.sync('**/linkedin-*.json', {cwd: project})
                .map(l => {
                    try {
                        return JSON.parse(fs.readFileSync(path.join(project, l)))[0].url.replace(
                            'linkedin.com',
                            '') + '/'
                    } catch (e) {
                        console.log(l);
                    }
                });
            return listAllConnections();
        })
        .then((connections) => {
            const filtered = connections.filter(c => loaded.indexOf(c) === -1);
            const percent = Math.round((connections.length - filtered.length) / connections.length * 100);
            console.log((connections.length - filtered.length) + ' / ' + connections.length + ' : '
                + percent
                + '%')
            return importer.runAllPromises(filtered.slice(0, 30).map(c => resolve => {
                var linkedIn;
                return scrapeEntireLinkedInProfile('https://linkedin.com' + c)
                    .then(r => {
                        linkedIn = r;
                        return updateContact({
                            displayName: r.name.split(/\s/).join('.*')
                        });
                    })
                    .then(r => {
                        console.log(linkedIn.name);
                        if (r.length === 0) {
                            r.push({});
                        }
                        Object.assign(r[0], linkedIn);
                        fs.writeFileSync(
                            project + '/linkedin-' + linkedIn.name + '.json',
                            JSON.stringify(r, null, 4));
                        return resolve(r);
                    })
                    .catch(e => {
                        console.log(e);
                        resolve()
                    })
            }))
        })
        .catch(e => console.log(e))
};

module.exports = syncLinkedInContacts;
