var importer = require('../Core');
var moment = require('moment');
var chrono = require('chrono-node');

var getThreadParticipants = (thread) => {
    var profiles = [], alreadyAt = false;
    var readLinkedInProfileInfo;
    // check for thread url and go there
    return client.then(() => importer.import('scrape LinkedIn profile', {client}))
        .then(r => (readLinkedInProfileInfo = r))
        .getUrl()
        .then(url => {
            return url.indexOf(thread + 'topcard/') === -1
                ? client.url('https://www.linkedin.com' + thread + 'topcard/')
                    .alertText()
                    .then(t => t.indexOf('leave') > -1 ? client.alertAccept() : '')
                    .catch(e => {
                    })
                : Promise.resolve([]);
        })
        .pause(3000)
        .elements('.view-profile')
        .then(els => Promise.all(els.value.map(a => {
            return client.elementIdAttribute(a.ELEMENT, 'href').then(h => h.value);
        })))
        .then(links => {
            return importer.runAllPromises(links.map(link => (resolve => {
                var results = [];
                return client
                    .click('a[href*="' + link.replace('https://www.linkedin.com', '') + '"]')
                    .pause(3000)
                    .then(() => readLinkedInProfileInfo(link))
                    .then(r => results = r)
                    .back()
                    .pause(1000)
                    .then(r => resolve(results))
                    .catch(e => console.log(e))
            })));
        });
};

var scrollLinkedInMessages = (messages) => {
    // TODO: add check for needing to go to LinkedIn
    // TODO: add check for needing to login
    // scroll to bottom of messages
    return client
        .execute(() => {
            document.getElementsByClassName('msg-s-message-list')[0]
                .scrollTop -= 10000;
        })
        .pause(2000)
        .then(() => readLinkedInMessages(messages));
}

var readLinkedInMessages = (messages) => {
    // TODO: check for thread id in url?
    var lastTime;
    return client
        .alertText()
        .then(t => t.indexOf('leave') > -1 ? client.alertAccept() : '')
        .catch(e => {
        })
        .then(() => getAllXPath([
            '//li[contains(@class, "msg-s-message-list__event")]',
            {
                from: './/img/@title',
                time: './/time//text()',
                message: './/*[contains(@class, "msg-s-message-listitem__message-bubble")]//text()'
            }
        ]))
        .then(r => {
            return r.map(m => {
                var newTime = chrono.parseDate(m.time + '');
                if (newTime !== null) {
                    newTime.setHours(newTime.getHours() - (new Date()).getTimezoneOffset() / 60)
                    lastTime = newTime;
                }
                return Object.assign(m, {
                    time: lastTime,
                    from: m.from + '',
                    message: m.message.filter(s => !s.match(/^\s*$/igm)).join('\n')
                })
            })
        })
        .then(r => {
            var newMessages = r
                .filter(e => messages
                    .filter(m => m.message === e.message).length === 0);
            messages = newMessages.concat(messages);
            return newMessages.length > 0
                ? scrollLinkedInMessages(messages)
                : Promise.resolve(messages);
        })
        .catch(e => console.log(e))
};

var readLinkedInThread = (thread, messages) => {
    var participants;
    return client
        .getUrl()
        .then(url => url.indexOf(thread) === -1
            ? client.url('https://www.linkedin.com' + thread)
                .alertText()
                .then(t => t.indexOf('leave') > -1 ? client.alertAccept() : '')
                .catch(e => {
                })
                .pause(1000)
                .isExisting('a[href*="topcard"]').then(is => is
                    ? client.click('a[href*="topcard"]')
                    : Promise.resolve([]))
            : (url.indexOf('topcard') === -1
                ? client.isExisting('a[href*="topcard"]').then(is => is
                    ? client.click('a[href*="topcard"]')
                    : Promise.resolve([]))
                : Promise.resolve([])))
        // get participants from topcard
        .pause(3000)
        .then(() => getThreadParticipants(thread))
        .then(p => participants = p)
        .back()
        // TODO: save to contacts
        .then(() => readLinkedInMessages(messages || []))
        .then(messages => ({
            thread: thread,
            participants: participants,
            messages: messages
        }))
        .catch(e => console.log(e));
};
module.exports = readLinkedInThread;
