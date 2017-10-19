// TODO: convert the attachments to a virtual filesystem, lay it on top of the current app, run end-to-end tests
if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
}
var result = attachments.map((attachment) => {
    return new Promise((resolve, reject) => fs.writeFile(
        path.join(output, attachment.filename),
        attachment.data,
        'binary',
        function (err) {
            if (err) reject(err);
            else resolve(attachment);
        }));
});
$$.async();
Promise.all(result).then(images => {
    html = '';
    htmlPrint = '';
    images.forEach((i) => {
        var filename = i.filename.split('/').pop();
        var ext = mime.lookup(i.filename);
        html += '<img src="data:' + ext + ';base64,' + (new Buffer(i.data, 'binary')).toString('base64') + '" />';
        htmlPrint += '<li><img src="/assets/' + filename + '" /></li>\n';
    });
    $$.mime({'text/markdown': 'Usage:\n\n```html\n' + htmlPrint + '\n```\nOutput:\n' + html});
}).catch(e => $$.done(e));

