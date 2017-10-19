var importer = require('../Core');

var scrapeFacebookFriends = () => {
    var friends = [];
    return client
        .then(() => importer.import('log in facebook', {client, getCredentials}))
        .then(loginFacebook => loginFacebook())
        .url('https://www.facebook.com/me/friends')
        .pause(4000)
        .then(() => getAllUntil(
            false,
            '//a[contains(@href, "friends_tab")]/@href',
            friends,
            (a, b) => a === b,
            (i) => i < 30
        ))
        .getHTML('body')
        .catch(e => console.log(e))
}
module.exports = scrapeFacebookFriends;

