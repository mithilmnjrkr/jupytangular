// How many facebook friends are also on linked in?  Do people still post contact information?

$$.async();
getFriendsDiff()
    .then(diff => $$.sendResult(diff))
    .catch(e => $$.sendError(e))


