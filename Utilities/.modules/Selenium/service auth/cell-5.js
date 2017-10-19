var client = typeof client !== undefined ? client : {};
var matchUsername = 'input[name="Email"], input[autocomplete="username"]';
var enterGoogleUsername = (email) => {
    console.log('Google: Sign in required');
    return client
        .waitForVisible(matchUsername, 1000)
        .addValue(matchUsername, email)
        .click('#identifierNext')
        .catch((e) => console.log(e));
}
if (typeof client.enterGoogleUsername == 'undefined') {
    client.addCommand('enterGoogleUsername', enterGoogleUsername);
}

var matchPassword = 'input[name="Passwd"], input[autocomplete="password"], input[name="password"]';
var enterGooglePassword = (pass) => {
    console.log('Google: Require password');
    return client
        .waitForVisible(matchPassword, 5000)
        .addValue(matchPassword, pass)
        .click('#passwordNext');
}
if (typeof client.enterGooglePassword == 'undefined') {
    client.addCommand('enterGooglePassword', enterGooglePassword);
}

var enterCredentials = (is) => {
    var credentials = getCredentials('accounts.google.com');
    if (is) {
        return client
            .isVisible('#passwordNext').then(is => is
                ? client.enterGooglePassword(credentials.Passwd)
                : client.enterGoogleUsername(credentials.Email)
                    .enterGooglePassword(credentials.Passwd))
    } else {
        return client
            .isExisting('h1*=Choose an account')
            .then(is => {
                if (is) {
                    return client.enterGoogleUsername(credentials.Email)
                        .enterGooglePassword(credentials.Passwd);
                } else {
                    return client.isExisting('h1*=Sign in')
                        .then(is => is
                            ? client.enterGoogleUsername(credentials.Email)
                                .enterGooglePassword(credentials.Passwd)
                            : null)
                }
            })
            .catch((e) => console.log(e));
    }
}
if (typeof client.enterCredentials == 'undefined') {
    client.addCommand('enterCredentials', enterCredentials);
}

var loginGoogle = () => {
    return client
        .isExisting('a[href*="ServiceLogin"]')
        .then(is => is ? client.click('a[href*="ServiceLogin"]') : null)
        .pause(1000)
        .isExisting('form[action*="signin"]')
        .then(is => client.enterCredentials(is))
        .catch((e) => {
            console.log(e);
            console.log('Google: Could not log in');
        });
}
if (typeof client.loginGoogle == 'undefined') {
    client.addCommand('loginGoogle', loginGoogle);
}
module.exports = loginGoogle;
loginGoogle;

