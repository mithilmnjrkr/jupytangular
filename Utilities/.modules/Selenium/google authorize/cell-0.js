var execSync = require('child_process').execSync;
try {
    require.resolve('googleapis');
    require.resolve('google-auth-library');
} catch (e) {
    execSync('npm install googleapis google-auth-library');
}


// Load client secrets from a local file.
var path = require('path');
var fs = require('fs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
var TOKEN_DIR = path.join(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE, '.credentials');
var SECRET_PATH = path.join(TOKEN_DIR, 'client_secret.json');
var credentials = JSON.parse(fs.readFileSync(SECRET_PATH));
