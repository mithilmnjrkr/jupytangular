$$.async();var client = createWebdriverClient('localhost', 4444)    .then(r => $$.sendResult(r))    .catch(e => $$.sendError(e));