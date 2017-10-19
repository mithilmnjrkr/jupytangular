$$.async()
var webpack = require('webpack');
var config = require('../webpack.config.js');
var tag = Math.random().toString(36).substring(7);
var fs = require('fs')
var moduleFile = '../src/app.component.ts';

fs.readFile(moduleFile, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var result = data.replace(/\'bc-app(-.*)?\'/ig, '\'bc-app-' + tag + '\'');

    fs.writeFile(moduleFile, result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});

webpack(config, function (err, stats) {
    //console.log(err);
    //console.log(stats);
    $$.html('<iframe src="/files/dev/www/index.html"></iframe>');
});
0