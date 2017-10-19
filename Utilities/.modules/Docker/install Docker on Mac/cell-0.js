$$.async();
var exec = require('child_process').exec;
var installed = false;
var docker = exec('docker ps', (err, stdout, stderr) => {
    if (stdout.indexOf('not found') > -1) {
        $$.done('Docker not found, installing');
    } else {
        installed = true;
        $$.done('Docker is already installed');
    }
});
