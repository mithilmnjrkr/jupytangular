var PROFILE_PATH = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var project = PROFILE_PATH + '/Documents/universal';
if (!fs.existsSync(project)) {
    fs.mkdirSync(project);
}

$$.async()
applyUniversal(project)
    .then(r => $$.sendResult(r))
    .catch(e => $$.sendError(e));

