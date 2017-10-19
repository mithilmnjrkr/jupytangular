var importer = require('../Core');

var runSeleniumCell = (search) => {
    var client, getCredentials, getAllXPath, getAllUntil;
    return importer.import([
        'webdriver client',
        'decrypt password'
    ])
        .then(r => {
            getCredentials = r[1];
            client = r[0]();
            return importer.import([
                'all xpath elements',
                'get all elements until'
            ]);
        })
        .then(r => {
            getAllXPath = r[0];
            getAllUntil = r[1];
            return importer.import(search, {
                browser: client,
                client,
                getCredentials,
                getAllXPath,
                getAllUntil
            });
        })
        .catch(e => console.log(e))
};
module.exports = runSeleniumCell;
