var importer = require('../Core');
var fs = require('fs');

var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var PROJECT_PATH = '/Users/briancullinan/Timeline';


var getEvents = (time) => {
    const start = new Date(time);
    start.setHours(0, 0, 0);
    start.setHours(start.getHours() + 7);
    const end = new Date(time);
    end.setHours(23, 59, 0);
    end.setHours(end.getHours() + 7);
    return listEvents({
        auth: options.auth,
        timeMin: start.toString(),
        timeMax: end.toString()
    })
        .catch(e => console.log(e));
}

var filterEvents = (events, locations) => {
    const unmatched = [], matches = [];
    for (const l of locations) {
        const matching = events.filter(e => {
            return ((l.name + '').indexOf('Gainey') > -1
                && e.event.summary == 'Drive to work')
                || ((l.name + '').indexOf('Swiftpage') > -1
                    && e.event.summary == 'Drive to work')
                || ((l.name + '').indexOf('6934') > -1
                    && e.event.summary == 'Drive home')
                || ((l.name + '').indexOf('6934') > -1
                    && e.event.summary == 'Work from home')
                || (typeof e.event.location !== 'undefined'
                    && ((e.event.location + '').indexOf(l.location + '') > -1
                        || (e.event.location + '').indexOf(l.name + '') > -1))
        });
        if (matching.length == 0) {
            unmatched.push(l);
        } else {
            const result = {};
            Object.assign(result, l);
            Object.assign(result, matching[0]);
            matches.push(result);
        }
    }
    console.log(events.map(e => e.event.summary + ' - ' + e.event.location))
    console.log('Unmatched ' + unmatched.length
        + ' -  out of ' + matches.length
        + ' - ' + unmatched.map(u => u.name + '').join(', '));
    return unmatched;
}

var listEvents, options = {}, nearbyCache;
try {
    nearbyCache = JSON.parse(fs.readFileSync(
        PROJECT_PATH + '/geolocations.json').toString());
} catch (e) {
    nearbyCache = {};
}
var reconcileTimeline = (destinations, date) => {
    var placesNearby, getOauthClient, events, locations = [];
    return importer.import([
        'import google calendar api',
        'places nearby google maps',
        'list events'
    ])
        .then(r => {
            getOauthClient = r[0];
            placesNearby = r[1];
            listEvents = r[2];
            return getOauthClient(options);
        })
        .then(() => getEvents(date))
        .then(r => {
            events = r;
            return importer.runAllPromises(destinations
                .filter(d => !d.traveling)
                .map(d => resolve => {
                    if (typeof nearbyCache[d.name + ', ' + d.location] !== 'undefined') {
                        return resolve(nearbyCache[d.name + ', ' + d.location]);
                    }
                    console.log(d.name + ', ' + d.location);
                    return placesNearby(
                        d.name + ', ' + d.location,
                        {lat: d.averageLat, lng: d.averageLon})
                        .then(result => {
                            if (result.length === 0) {
                                console.warn('No match for ' + JSON.stringify(d))
                                resolve();
                            } else {
                                nearbyCache[d.name + ', ' + d.location] = result[0];
                                resolve(Object.assign(d, result[0]))
                            }
                        })
                        .catch(e => resolve(e))
                }))
        })
        .then(r => {
            fs.writeFileSync(
                PROJECT_PATH + '/geolocations.json',
                JSON.stringify(nearbyCache, null, 4));
            locations = r.filter(l => typeof l !== 'undefined');
            return filterEvents(events, locations);
        })
        .catch(e => console.log(e))
}
module.exports = reconcileTimeline;
