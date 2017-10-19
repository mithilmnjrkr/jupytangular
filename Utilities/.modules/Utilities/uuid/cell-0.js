var crypto = require('crypto');
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex;
    return bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] + '-' +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]] +
        bth[buf[i++]] + bth[buf[i++]];
}

function sha1(bytes) {
    if (typeof Buffer.from === 'function') {
        // Support modern Buffer API
        if (Array.isArray(bytes)) bytes = Buffer.from(bytes);
        else if (typeof bytes === 'string') bytes = Buffer.from(bytes, 'utf8');
    } else {
        // Support pre-v4 Buffer API
        if (Array.isArray(bytes)) bytes = new Buffer(bytes);
        else if (typeof bytes === 'string') bytes = new Buffer(bytes, 'utf8');
    }

    return crypto.createHash('sha1').update(bytes).digest();
}

function uuidToBytes(uuid) {
    // Note: We assume we're being passed a valid uuid string
    var bytes = [];
    uuid.replace(/[a-fA-F0-9]{2}/g, function (hex) {
        bytes.push(parseInt(hex, 16));
    });

    return bytes;
}

function stringToBytes(str) {
    str = unescape(encodeURIComponent(str)); // UTF8 escape
    var bytes = new Array(str.length);
    for (var i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}

function v35(name, version, hashfunc) {
    var generateUUID = function (value, namespace, buf, offset) {
        var off = buf && offset || 0;

        if (typeof(value) == 'string') value = stringToBytes(value);
        if (typeof(namespace) == 'string') namespace = uuidToBytes(namespace);

        if (!Array.isArray(value)) throw TypeError('value must be an array of bytes');
        if (!Array.isArray(namespace) || namespace.length !== 16) throw TypeError(
            'namespace must be uuid string or an Array of 16 byte values');

        // Per 4.3
        var bytes = hashfunc(namespace.concat(value));
        bytes[6] = (bytes[6] & 0x0f) | version;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        if (buf) {
            for (var idx = 0; idx < 16; ++idx) {
                buf[off + idx] = bytes[idx];
            }
        }

        return buf || bytesToUuid(bytes);
    };

    generateUUID.name = name;

    // Pre-defined namespaces, per Appendix C
    generateUUID.DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    generateUUID.URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

    return generateUUID;
};

module.exports = v35('v5', 0x50, sha1)