// But we also want to automatically load projects?
var listProjects = (root, match = '**/package.json') => {
    listInProject
        .then(matches => matches.forEach(m => {
            var projectPath = path.dirname(path.join(root, m));
            result[path.basename(projectPath)] = projectPath;
        }));
};
module.exports = listProjects;
listProjects;

