var execSync = require('child_process').execSync;
try {
    require.resolve('renamer');
} catch (e) {
    execSync('npm install renamer');
}
var renamer = require('renamer');
var renameUsingGit = (gitRoot, match, find, replace) => {
    var files = renamer.expand(path.join(gitRoot, match));
    var results = renamer.replace({
        files: files.filesAndDirs,
        find: find,
        replace: replace
    });
    return renamer.dryRun(results).list.map(r => {
        // rename with git instead
        var output = execSync('git '
            + '--work-tree=' + JSON.stringify(gitRoot)
            + ' --git-dir=' + JSON.stringify(path.join(gitRoot, '.git'))
            + ' mv ' + JSON.stringify(r.before)
            + ' ' + JSON.stringify(r.after));
        return output.toString() || r.after;
    });
};
renameUsingGit;
