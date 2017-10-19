// initialize
var fs = require('fs');
var JSONStream = require('JSONStream');

streamJson = (file, parse, match = ((c) => true)) => {
    var file = fs.createReadStream(file)
        .pipe(JSONStream.parse(parse));
    file.on('data', (m) => match(m));
    // create a promise out of this stream
    return new Promise((resolve, reject) => {
        file.on('error', e => reject(e, file));
        file.on('close', () => resolve(file))
    });
};

// $$.done() for our dumb parser

