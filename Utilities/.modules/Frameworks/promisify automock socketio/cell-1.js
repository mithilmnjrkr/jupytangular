var Promise = require('bluebird');

var promisifyMock = (req, dep) => {
    let ctx;
    ctx = automock.mockValue(req, {
        stubCreator: (name) => {
            var orig = Promise.promisify(req[name.split('.')[1]], {
                multiArgs: true,
                context: req
            });
            //console.log('create stub ' + name);
            return function () {
                console.log(name + ' (' + arguments[0] + ') in ' + JSON.stringify(dep));
                return orig.apply(null, arguments);
            };
        }
    });
    return ctx;
};
promisifyMock;
