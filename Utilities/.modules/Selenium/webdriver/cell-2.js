$$.async();
client.windowHandles()
    .then(r => $$.sendResult(r))
    .catch(e => $$.sendError(e));
