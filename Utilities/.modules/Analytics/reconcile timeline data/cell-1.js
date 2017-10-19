var importer = require('../Core');
var placesNearby;
var compareTimeline = (date) => {
    var newDate = new Date(date);
    newDate.setHours(0, 0, 0);
    var endDate = new Date(newDate);
    endDate.setHours(23, 59, 59);
    return importer.import('find a place')
        .then(r => placesNearby = r)
        .then((r) => importer.import('google calendar.ipynb[listEvents]'))
        .then(listEvents => listEvents({
            start: newDate,
            end: endDate
        }))
        .then(r => r.filter(e => typeof e.event.location !== 'undefined'))
        //.then(r => console.log(r))
        .then(r => Promise.all(r.map(e => {
            var cache = getTimelineCache(date);
            cache.locations.forEach(l => {

            });
            // get nearest location event to date
            return placesNearby();
        })))
};
module.exports = compareTimeline;
