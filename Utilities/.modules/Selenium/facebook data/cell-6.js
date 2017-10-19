var importer = require('../Core');
var getAllXPath, getAllUntil;

var scrapeFacebookEvent = (event) => {
    var description;
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
        .then(url => url.indexOf(event) === -1
            ? client.url(event)
            : client)
        .pause(3000)
        .isExisting('//a[contains(., "About")]')
        .then(is => is ? client.click('//a[contains(., "About")]') : [])
        .pause(1000)
        .then(() => getAllXPath([
            '//body[not(.//*[contains(@class, "fbPhotoSnowliftPopup")])]|//body[.//*[contains(@class, "fbPhotoSnowliftPopup")]]//*[contains(@class, "fbPhotoSnowliftPopup")]',
            {
                description: [
                    './/*[contains(@id, "reaction_units")]/div/div|.//*[contains(@id, "event_summary")]//li',
                    {
                        value: ['.//span//text()']
                    }
                ]
            }
        ]))
        .then(desc => {
            description = desc;
        })
        .isExisting('//a[contains(., "Discussion")]')
        .then(is => is ? client.click('//a[contains(., "Discussion")]') : client)
        .pause(1000)
        .then(() => {
            return getAllXPath([
                '//body[not(.//*[contains(@class, "fbPhotoSnowliftPopup")])]|//body[.//*[contains(@class, "fbPhotoSnowliftPopup")]]//*[contains(@class, "fbPhotoSnowliftPopup")]',
                {
                    posts: [
                        './/*[contains(@class, "fbPhotoSnowliftAuthorInfo")]|.//*[contains(@class, "fbUserPost")]',
                        {
                            description:
                                './/following-sibling::div//*[contains(@class, "fbPhotosPhotoCaption")]//text()|.//*[contains(@class, "userContent")]//text()|.//h5//text()|.//a[contains(@class, "profileLink")]//text()',
                            participants: [
                                './/a[contains(@class, "profileLink")]/@href|.//a[contains(@href, "facebook") and .//img]/@href',
                                './following-sibling::div//a/@href',
                                './/*[contains(@class, "commentable_item")]//a[contains(@class, "UFICommentActorName")]/@href'
                            ],
                            comments: [
                                './/h6[contains(., "Comments")]//following-sibling::div/div/div[contains(@class, "UFIComment")]',
                                {
                                    time:
                                        './/*[contains(@class, "uiLinkSubtle")]//text()',
                                    content:
                                        './/*[contains(@class, "UFICommentBody")]//text()',
                                    from:
                                        './/a[contains(@class, "UFICommentActorName")]/text()|.//a[contains(@class, "UFICommentActorName")]/@href'
                                }
                            ]
                        }
                    ]
                }
            ])
        })
        .then(results => results.map((r, i) => Object.assign(r, {
            description: description[i].description.map(d => d.value.join(' ')),
            posts: r.posts.map(p => {
                return Object.assign(p, {
                    event: event,
                    description: p.description.join(' '),
                    participants: p.participants.filter(i => i
                            .indexOf('photo') === -1
                        && i !== '#'
                        && i.indexOf('ufi/reaction') === -1),
                    photos: p.participants.filter(i => i
                            .indexOf('photo') !== -1
                        && i !== '#'
                        && i.indexOf('ajax/sharer') === -1),
                    comments: p.comments.map(c => Object.assign(c, {
                        time: c.time.join(' '),
                        content: c.content.join(' '),
                        from: c.from.join(' ')
                    }))
                });
            })
        })))
        .catch(e => console.log('hit3' + e))
};
module.exports = scrapeFacebookEvent;

