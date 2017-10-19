var importer = require('../Core');

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var loadLocations = (file) => {
    var locationCache = {};
    return importer.streamJson(file, [true, {emitPath: true}], (match) => {
        if (match.path[0] === 'locations') {
            var currDate = new Date(parseInt(match.value.timestampMs));
            var newKey = currDate.getDate() + months[currDate.getMonth()]
                + (currDate.getFullYear() + '').substr(2, 2);
            var newRow = Object.assign({
                time: currDate,
                type: 'location',
                location: newKey
            }, match.value);
            var cache = locationCache[newRow.location];
            if (typeof cache === 'undefined') {
                cache = locationCache[newRow.location] = [];
            }
            cache[cache.length] = newRow;
        }
    })
        .then(() => locationCache)
};
module.exports = loadLocations;
loadLocations;

