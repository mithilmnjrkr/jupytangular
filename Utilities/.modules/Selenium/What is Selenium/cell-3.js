var importer = require('../Core');var path = require('path');var fs = require('fs');var DOWNLOAD_DIR = path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, 'Downloads');var PROFILE_DIR = path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, '.defaultProfile');var execCmd;var getSeleniumServer = (name = 'act-selenium') => {    try {        fs.mkdirSync(DOWNLOAD_DIR);    } catch (err) {        if (err.code != 'EEXIST') {            throw err;        }    }    try {        fs.mkdirSync(PROFILE_DIR);    } catch (err) {        if (err.code != 'EEXIST') {            throw err;        }    }    try {        fs.unlinkSync(path.join(PROFILE_DIR, 'SingletonLock'));    } catch (err) {        if (err.code != 'ENOENT') {            throw err;        }    }    var DOCKERFILE = path.resolve(path.join(__dirname, 'Dockerfile'));    return seleniumDocker(DOCKERFILE)        .then(() => importer.import('spawn child process'))        .then(execCmd => execCmd('docker ps -a'))        .then(r => {            if (r[0].indexOf(name) > -1) {                return execCmd('docker stop ' + name)                    .then(r => new Promise(resolve =>                        setTimeout(() => resolve(r), 1000)))                    .then(() => execCmd('docker rm ' + name));            }        })        .then(() => new Promise(resolve =>            setTimeout(() => resolve(), 1000)))        .then(() => {            var build = 'docker build -t ' + name + ' "'                + path.dirname(DOCKERFILE) + '"\n'                + 'docker run --shm-size=3g -d '                + '--name ' + name + ' '                + '-p 8888:8888 '                + '-p 6080:6080 '                + '-p 5900:5900 '                + '-p 4444:4444 '                + '-p 4200:4200 '                + '-p 3000:3000 '                // TODO: add profile dir back in when permissions works on windows                + '-v "' + DOWNLOAD_DIR + '":/data/downloads '                + name + '\n';            return execCmd(build)        })        .then(r => new Promise(resolve => setTimeout(() => resolve(r), 6000)))        .catch(e => console.log(e))};module.exports = getSeleniumServer;getSeleniumServer;