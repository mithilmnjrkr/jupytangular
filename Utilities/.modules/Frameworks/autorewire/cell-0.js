/*
// TODO: write a parser for this that also works on web tutorials for self-validation
package.json
"dependencies": {
    "underscore": "^1.8.3",
    "underscore.string": "^3.2.2"
}
*/

var execSync = require('child_process').execSync;
try {
    require.resolve('underscore');
    require.resolve('underscore.string');
} catch (e) {
    execSync('npm install underscore underscore.string');
}

