var importer = require('../Core');

$$.async()
importer.import('scrape linkedin threads')
    .then(scrapeLinkedInThreads => scrapeLinkedInThreads())
    .then(r => $$.sendResult(r))
    .catch(e => $$.sendError(e));
