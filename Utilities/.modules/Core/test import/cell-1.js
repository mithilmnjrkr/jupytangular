$$.async();
setTimeout(() => {
    try {
        throw 'should only fail per cell';
    }
    catch (e) {
        $$.done(e);
    }
}, 10);
