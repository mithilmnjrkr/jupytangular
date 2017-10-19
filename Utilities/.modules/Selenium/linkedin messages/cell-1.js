var visitMyProfile = () => {
    // TODO: add check for needing to go to LinkedIn
    // TODO: add check for needing to login
    return client.click('#nav-settings__dropdown-trigger')
        .pause(500)
        .click('.nav-settings__view-profile-link')
        .pause(2000);
}

var readLinkedInProfileInfo = () => {
    var name, title, url, phone, email;
    return client
        .getUrl().then(url => url.indexOf('/in/') == -1
            ? visitMyProfile()
            : Promise.resolve([]))
        .isExisting('.contact-see-more-less')
        .then(is => is ? client.click('.contact-see-more-less') : client)
        .pause(500)
        .then(() => Promise.all([
            client.getText('.pv-top-card-section__name'),
            client.getText('.pv-top-card-section__headline'),
            client.getText('.ci-vanity-url .pv-contact-info__contact-item').catch(e => client.getUrl()),
            // is existing?
            client.getText('.ci-phone .pv-contact-info__contact-item').catch(e => null),
            client.getText('.ci-email .pv-contact-info__contact-item').catch(e => null)
        ]))
        .then(r => ({
            name: r[0],
            title: r[1],
            url: r[2],
            phone: r[3],
            email: r[4]
        }));
};
module.exports = readLinkedInProfileInfo;
readLinkedInProfileInfo;
