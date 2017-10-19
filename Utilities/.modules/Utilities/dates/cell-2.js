// sum up events
var sumEvents = (events) => {
    var total = 0;
    events.forEach(e => {
        if (typeof e.event.end === 'undefined') {
            console.log(e.event);
        }
        total += new Date(e.event.end.dateTime).getTime()
            - new Date(e.event.start.dateTime).getTime();
    });
    return total / 1000 / 60 / 60;
};
module.exports = sumEvents;
sumEvents;

