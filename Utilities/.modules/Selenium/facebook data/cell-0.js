var enterFacebook = () => {
    console.log('Facebook: Sign in required');
    var credentials = getCredentials('facebook.com');
    return client.click('input[name*="email"]')
        .keys(credentials.username)
        .pause(1000)
        .then(() => console.log('Facebook: Require password'))
        .click('input[name*="pass"]')
        .keys(credentials.password)
        .submitForm('[type="submit"]')
        .pause(2000)
        .isExisting('.cp-challenge-form')
        .then(is => {
            if (is) {
                throw new Error('captcha');
            }
        });
}

var loginFacebook = () => {
    return client
        .getUrl()
        .then(url => {
            var loggedIn = url.indexOf('facebook') > -1 && url.indexOf('login') == -1;
            return loggedIn
                ? client
                    .isVisible('input[name*="email"]')
                    .then(is => is ? enterFacebook() : client)
                : client.url('https://www.facebook.com/')
                    .isVisible('input[name*="email"]')
                    .then(is => is ? enterFacebook() : client)
        })
}
module.exports = loginFacebook;
loginFacebook;

