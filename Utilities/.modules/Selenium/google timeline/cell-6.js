var importer = require('../Core');
var _ = require('underscore');
var fs = require('fs');
var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var PROJECT_PATH = PROFILE_PATH + '/Timeline';

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

var straightDistance = (lat1, lon1, lat2, lon2) => {
    var R = 6371e3; // metres
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians(lat2 - lat1);
    var Δλ = toRadians(lon2 - lon1);

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    return d;
}

var averageDestinations = (geoLocations, timelineLocations) => {
    var destinations = [];
    for (const d of timelineLocations) {
        if ((d.name + '') == '' || (d.name + '').indexOf('Driving') > -1) {
            continue;
        }
        const nearest = _.sortBy(
            geoLocations,
            l => Math.abs(new Date(l.time).getTime() - new Date(d.time).getTime()))
            .slice(0, 3);
        // make sure it isn't off by much
        const averageLat = nearest.map(n => n.latitudeE7)
            .reduce((a, b) => a + b, 0) / nearest.length / 10000000;
        const averageLon = nearest.map(n => n.longitudeE7)
            .reduce((a, b) => a + b, 0) / nearest.length / 10000000;
        if (nearest.filter(nearby => straightDistance(
                nearby.latitudeE7 / 10000000,
                nearby.longitudeE7 / 10000000,
                averageLat,
                averageLon
            ) > 500).length > 0) {
            destinations.push(Object.assign(d, {
                averageLat: averageLat,
                averageLon: averageLon,
                locations: nearest.map(nearby => Object.assign(nearby, {
                    averageLat: nearby.latitudeE7 - averageLat,
                    averageLon: nearby.longitudeE7 - averageLon,
                    averageDist: straightDistance(
                        nearby.latitudeE7 / 10000000,
                        nearby.longitudeE7 / 10000000,
                        averageLat,
                        averageLon
                    )
                }))
            }));
        }
        destinations.push(Object.assign(d, {
            averageLat: averageLat,
            averageLon: averageLon
        }));
    }
    return destinations;
}
module.exports = averageDestinations;
averageDestinations;

