var importer = require('../Core');
var chrono = require('chrono-node');
var glob = require('glob');

var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var project = PROFILE_PATH + '/Conversations';

var readFacebookProfileInfo;
var switchToParticipantThread = (i) => {
    return client
        .pause(1000)
        .click('//*[contains(@class, "scrollable")]//h4[contains(., "People")]/parent::*//li[' + i + ']')
        .pause(1000)
        .then(() => readFacebookProfileInfo())
        .catch(e => console.log(e))
};

var getThreadParticipants = (thread) => {
    return client.then(() => importer.import('scrape facebook profile', {client}))
        .then(r => readFacebookProfileInfo = r)
        .execute(() => {
            return document.evaluate(
                'count(//*[contains(@class, "scrollable")]//h4[contains(., "People")]/parent::*//li)',
                document, null,
                XPathResult.NUMBER_TYPE, null).numberValue;
        })
        .then(r => {
            var result = [];
            for (var i = 1; i < Math.min(3, r.value); i++) {
                result[result.length] = (i =>
                    resolve => {
                        var profile = {};
                        switchToParticipantThread(i)
                            .then(r => profile = r)
                            .url(thread)
                            .pause(3000)
                            .catch(e => console.log(e))
                            .then(() => resolve(profile))
                    })(i);
            }
            if (r.value === 0) {
                result[result.length] = (resolve => {
                    var profile = {};
                    readFacebookProfileInfo()
                        .then(r => profile = r)
                        .url(thread)
                        .pause(3000)
                        .then(() => resolve(profile))
                        .catch(e => console.log(e))
                })
            }
            return importer.runAllPromises(result).catch(e => console.log(e));
        })
        .catch(e => console.log(e))
};

var readFacebookMessages = (messages, i = 0) => {
    // TODO: add check for needing to go to LinkedIn
    // TODO: add check for needing to login
    return client
        .execute(() => {
            var result = [];
            var groups = document.getElementsByClassName('scrollable')[2];
            var times = groups.getElementsByTagName('h4');
            for (var t = 0; t < times.length; t++) {
                var bubble = times[t];
                while ((bubble = bubble.nextSibling) && bubble.nodeName === 'DIV') {
                    var from = bubble.getElementsByTagName('h5')[0];
                    result[result.length] = {
                        from: typeof from !== 'undefined' ? from.textContent : '',
                        time: times[t].innerText,
                        message: bubble.innerText
                    };
                }
            }
            return result;
        })
        .then(r => {
            var newMessages = r.value
                .filter(e => messages
                    .filter(m => m.message === e.message).length === 0);
            messages = newMessages.concat(messages);
            return newMessages.length > 0
                ? scrollClient('//*[contains(@role, "main")]//*[contains(@class, "scrollable")][1]', true, i)
                    .pause(2000)
                    .then(() => i > 3
                        ? messages
                        : readFacebookMessages(messages, i + 1))
                : Promise.resolve(messages);
        })
        .catch(e => console.log(e))
};

var readFacebookThread = (thread, messages) => {
    var threadId = thread.replace(/^\/|\/$/ig, '').split('/').pop()
        .replace(/[^a-z0-9]/ig, '_');
    var file = glob.sync('**/' + threadId + '-*.json', {cwd: project})[0];
    try {
        messages = JSON.parse(fs.readFileSync(file))
    }
    catch (e) {
        messages = []
    }
    var participants;
    return client.getUrl().then(url => url.indexOf(thread) === -1
        ? client.url(thread)
        : client)
    // get participants from topcard
        .pause(1000)
        .then(() => getThreadParticipants(thread))
        .then(p => (participants = p))

        // TODO: save to contacts
        .then(() => readFacebookMessages(messages || []))
        .then(messages => ({
            thread: thread,
            participants: participants || [],
            messages: messages.map(m => {
                var newTime = chrono.parseDate(m.time);
                newTime.setHours(newTime.getHours() - (new Date()).getTimezoneOffset() / 60)
                return Object.assign(m, {time: newTime})
            })
        }))
        .then(t => {
            var filename = project + '/'
                + threadId
                + '-' + t.participants
                    .map(p => p.name).join('')
                    .replace(/[^a-z0-9]/ig, '_') + '.json';
            fs.writeFileSync(filename, JSON.stringify(t, null, 4));
            return t;
        })
        .catch(e => console.log(e))
};
module.exports = readFacebookThread;
