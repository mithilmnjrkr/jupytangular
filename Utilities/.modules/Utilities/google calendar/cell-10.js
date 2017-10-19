var importer = require('../Core');
var parseBookmarks = () => {
    var getAllXPath;
    return importer.import('all xpath elements', {client, XPathResult, document})
        .then(getAllXPath => getAllXPath([
            '//dt[./h3]',
            {
                title: './h3/text()',
                links: [
                    './dl/dt/a',
                    {
                        url: './@href',
                        time: './@add_date',
                        title: './@text()'
                    }
                ],
                children: ['./dl/dt/h3/text()']
            }
        ]))
        .then(events => [].concat(...events.map(e => e.links.map(l => Object.assign(l, {folder: e.title})))))
        .then(events => {
            return events.map(e => Object.assign(e, {
                url: e.url + '',
                title: e.title + '',
                time_usec: parseFloat(e.time + '') * 1000
            }))
                .reduce((links, event) => {
                    // group by nearest half-hour and max out at 10 links
                    var timeGroup = Math.round(event.time_usec / 60 / 30 / 1000) * 60 * 30 * 1000;
                    if (typeof links[timeGroup] == 'undefined') {
                        links[timeGroup] = [];
                    }
                    links[timeGroup].push(event)
                    return links;
                }, {})
        });
};
module.exports = parseBookmarks;
parseBookmarks;

