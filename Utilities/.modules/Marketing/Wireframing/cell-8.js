var exec = require('child_process').exec;
child = exec(
    'cd ./sosmethod && webpack ./config/webpack.prod.js --progress --profile --bail',
    function (err, stdout, stderr) {
        // TODO: show output on command line
    });
child.stderr.pipe(process.stderr);
child.stdout.pipe(process.stdout);
0
