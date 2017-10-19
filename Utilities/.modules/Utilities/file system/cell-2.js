var importer = require('../Core');
var path = require('path');

var projectWordCloud = (project) => {
    var words = [];

    var wordCount = function (r) {
        var words = r['packages'].map(p => p.split('.ts/')[1])
            .concat(r['packages'].map(p => path.basename(p.split('.ts/')[0])))
            .concat(r['relatives'].map(r => path.basename(r)))
            .concat(r['relatives'].map(r => path.basename(r.split('.ts/')[0])));
        var wordCount = {};
        words.forEach(w => {
            if (typeof wordCount[w] === 'undefined') {
                wordCount[w] = 15;
            } else {
                wordCount[w]++;
            }
        });
        return Object.keys(wordCount).map((d) => ({text: d, size: wordCount[d]}));
    };

    return importer.import('relative paths and includes')
        .then(relativePaths => relativePaths(project))
        .then(r => {
            words = r;
        })
        .then(() => importer.import('d3.ipynb[d3CloudToSVG]'))
        .then(d3CloudToSVG => d3CloudToSVG(wordCount(words)));
};
module.exports = projectWordCloud;

