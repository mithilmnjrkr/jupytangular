$$.async();
scrapeFacebookEvents()
    .then(diff => $$.sendResult(diff))
    .catch(e => $$.sendError(e))


