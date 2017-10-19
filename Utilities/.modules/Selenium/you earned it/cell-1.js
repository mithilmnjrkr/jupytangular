var importer = require('../Core');

var runHighFiver = () => {
    return importer.import('selenium cell')
        .then(runSeleniumCell => runSeleniumCell('high five people youearnedit'))
        .then(highFive => highFive())
        .catch(e => console.log(e))
};
module.exports = runHighFiver;

// node -e "require('/Users/brian.cullinan/Documents/jupytangular2/Core').interpretAll('automate youearnedit').then(r=>r.runInNewContext()()).then(e=>{ console.log(e); process.exit(e); }).catch(e=>{console.log(e); process.exit(e) });"
