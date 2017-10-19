var importer = require('../Core');
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var renderer;
var displAngular = (project, url) => {
    var innerHtml = '';
    var scripts = '';
    process.chdir(path.join(project));
    module.paths.unshift(path.join(project, 'node_modules'));
    require('module').Module._initPaths();
    process.argv = [(process.argv0 = path.join(project, '.server', 'render-service.js'))];
    return new Promise((resolve, reject) => {
        try {
            var rendererCode = fs.readFileSync(path.join(project, '.server', 'render-service.js')).toString();
            importer.runInNewContext(
                rendererCode + '\n\n;(global.module.exports=global.renderer);',
                {
                    __filename: path.join(project, '.server', 'render-service.js')
                },
                {
                    displayErrors: true
                }
            );
        } catch (e) {
            return reject(e);
        }

        renderer(url, (err, html) => {
            if (err) {
                return reject(err);
            }
            var content = fs.readFileSync(path.join(project, 'public', 'index.html')).toString();
            scripts = getScriptsAndStyles(content);
            innerHtml = html;
            return resolve(innerHtml);
        });
    })
        .then(() => importer.import('list files in project'))
        .then(listInProject => listInProject(project, '**/public/assets/0.*.js'))
        .then(paths => paths.map(p => '<script defer>' + fs.readFileSync(p) + '</script>')[0])
        // TODO convert to using the same type of template system as angular-cli now that typescript is becoming more relevant here.
        .then(chunks => ({
            html: `
<div id="container" style="display:block; width:100%;position:relative;">
<iframe id="cell1" style="position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;border:0;"></iframe>
</div>
<script defer>
var ifrm = document.getElementById('cell1');
var doc = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
doc.document.open();
doc.INITIAL_PATH=` + JSON.stringify('' + url) + `;
doc.SOCKIFY_SERVER='http://local:8000';
doc.document.write(decodeURI(` + JSON.stringify(encodeURI(innerHtml)) + `));
var contHeight;
contHeight = setInterval(function () {
    if(document.getElementById("container") == null) {
        console.log('Resizing canceled');
        clearInterval(contHeight);
    } else {
        doc.document.getElementsByTagName('app-root')[0].style.display = 'block';
        document.getElementById("container").style.height = (doc.document.getElementsByTagName('app-root')[0].offsetHeight + 40) + 'px';
    }
}, 500);
</script>`, scripts: scripts, chunks: chunks
        }));
};
module.exports = displAngular;
displAngular;
