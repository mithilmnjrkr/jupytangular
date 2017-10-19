var fs = require('fs');
var importer = require('../Core');

var convertUnicode = (x) => {
    var r = /\\u([\d\w]{4})/gi;
    x = x.replace(r, function (match, grp) {
        return String.fromCharCode(parseInt(grp, 16));
    });
    return unescape(x);
}

var history = JSON.parse(fs.readFileSync('/Users/briancullinan/Downloads/Takeout 6/Chrome/BrowserHistory.json'));
var total = history['Browser History'].length;

console.log(new Date(Math.round(history['Browser History'][0].time_usec / 1000)));
console.log(new Date(Math.round(history['Browser History'][total - 1].time_usec / 1000)));

var groupCounts = [];
var addSite = (label, value = 1) => {
    var site = groupCounts.filter(g => g.label === label)[0];
    if (typeof site === 'undefined') {
        groupCounts[groupCounts.length] = {
            label: label,
            value: value
        }
    } else {
        site.value += value;
    }
};

for (var i = 0; i < total; i++) {
    var uri = convertUnicode(history['Browser History'][i].url);
    if (uri.match('google.*?search')) {
        addSite('google search');
    }
    else if (uri.match('calendar.*?google')) {
        addSite('google calendar');
    }
    else if (uri.match('stackoverflow')) {
        addSite('stackoverflow');
    }
    else if (uri.match('localhost:9090')) {
        addSite('local dev');
    }
    else if (uri.match('linkedin')) {
        addSite('linkedin');
    }
    else if (uri.match('google')) {
        addSite('other google');
    }
    else if (uri.match('amazon')) {
        addSite('amazon');
    }
    else if (uri.match('github')) {
        addSite('github');
    }
    else if (uri.match('facebook')) {
        addSite('facebook');
    }
    else if (uri.match('wikipedia')) {
        addSite('wikipedia');
    }
    else if (uri.match('youtube')) {
        addSite('youtube');
    }
    else if (uri.match('ftp:')) {
        addSite('ftp');
    }
    else if (uri.match('chrome:|about:|native:|source:|file:|data:|extension:|intent:|content:|market:')) {
        addSite('settings');
    }
    else {
        var domain = (/https?:\/\/(.*?)(\/|$)/ig).exec(uri);
        if (domain === null) {
            console.log(uri);
        }
        addSite(domain[1]);
    }
}

var oldGroups = groupCounts;
groupCounts = [];
for (var i = 0; i < oldGroups.length; i++) {
    if (oldGroups[i].value < 300) {
        addSite('other', oldGroups[i].value);
    } else {
        addSite(oldGroups[i].label, oldGroups[i].value);
    }
}

$$.async();
importer.import('d3 pie chart')
    .then(d3PieChart => d3PieChart(groupCounts))
    .then(r => $$.svg(r))
    .catch(e => $$.sendError(e));

// TODO: show month by month, week by week?

// TODO: use this chart instead? https://bl.ocks.org/mbostock/8d2112a115ad95f4a6848001389182fb
