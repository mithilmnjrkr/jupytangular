/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token, tokenPath) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFileSync(tokenPath, JSON.stringify(token));
    console.log('Token stored to ' + tokenPath);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
var runSeleniumCell;
var authorize = (scopes = SCOPES) => {
    const tokenPath = path.join(TOKEN_DIR, scopes.join('')
        .replace(/[^a-z]*/ig, '_') + '.json');
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    try {
        // Check if we have previously stored a token.
        var token = fs.readFileSync(tokenPath);
        oauth2Client.credentials = JSON.parse(token);
        return Promise.resolve(oauth2Client);
    } catch (e) {
        if (e.code !== 'ENOENT') {
            throw e;
        } else {
            var authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: scopes
            });
            return importer.import(['selenium cell'])
                .then(runSeleniumCell => runSeleniumCell('authorize google access'))
                .then(authorizeSelenium => authorizeSelenium(authUrl))
                .then(code => new Promise((resolve, reject) => {
                    oauth2Client.getToken(code, (err, token) => {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(token);
                        }
                    });
                }))
                .then(token => {
                    oauth2Client.credentials = token;
                    storeToken(token, tokenPath);
                    return oauth2Client;
                })
        }
    }
};
module.exports = authorize;
authorize;


