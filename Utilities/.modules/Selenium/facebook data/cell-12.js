var importer = require('../Core');

var getAllUntil, getAllXPath;
var unfollowFacebook = () => {
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
        .url('https://www.facebook.com/me/following')
        .pause(3000)
        .elements('//a[contains(@ajaxify, "unfollow_profile")]')
        .then(els => {
            return importer.runAllPromises(els.value.map(el => resolve => {
                return client.elementIdClick(el.ELEMENT)
                    .then(r => resolve())
                    .catch(e => resolve(e));
            }))
        })
};
module.exports = unfollowFacebook;

