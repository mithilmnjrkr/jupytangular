var importer = require('../Core');

var listTakeouts = () => {
    return client
        .url('https://takeout.google.com/settings/takeout')
        .loginGoogle()
        .waitUntil(() => client.getUrl()
            .then(url => url.indexOf('privacy') > -1 || url.indexOf('takeout') > -1), 20000, '')
        .url('https://takeout.google.com/settings/takeout')
        .getAllXPath([
            '//*[@data-id]',
            {
                id: './@data-id',
                label: './/td[3]//text()'
            }
        ])
};

var takeoutProducts = (product) => {
    return client
        .url('https://takeout.google.com/settings/takeout/custom/' + product.id)
        .pause(1000)
        .click('//*[contains(@role, "button")][contains(., "Next")]')
        .pause(1000)
        .execute(() => {
            var el = document.evaluate(
                '//*[contains(., "Archive size")]/parent::*//*[contains(@role,"option")][contains(.,"2")]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;
            var event = document.createEvent('MouseEvents');
            event.initEvent('mousedown', true, true);
            el.dispatchEvent(event, true);
        })
        .pause(1000)
        // TODO: shorten this in to a utility command
        // doesn't work because of some weird css BS
        // .click('//*[contains(@role, "option")][contains(., "50")]')
        .click(
            '//*[contains(., "Archive size")]/parent::*//*[contains(@role,"listbox")]/div[3]//*[contains(@role,"option")][contains(.,"50")]')
        .click('//*[contains(@role, "button")][contains(., "Create archive")]')
        .waitUntil(
            () => client.isExisting('//tr[1]/td[last()]//*[contains(@data-download-uri, "takeout/download")]'),
            120000,
            '')
        .click('//tr[1]/td[last()]//*[contains(@data-download-uri, "takeout/download")]')
        .pause(2000)
        .loginGoogle()
}

var downloadGoogleTakeout = (products) => {
    var regex = new RegExp(products, 'ig');
    return listTakeouts()
        .then(ids => {
            return ids
                .map(k => ({
                    id: k.id + '',
                    label: k.label + ''
                }))
                .filter(k => k.id != '_gd' && (products.indexOf('all') > -1
                    || k.id.match(regex) != null || k.label.match(regex) != null))
        })
        .then(selectedProducts => {
            console.log(selectedProducts);
            return importer.runAllPromises(selectedProducts
                .map(p => (resolve) => {
                    return takeoutProducts(p)
                        .then(r => resolve(r))
                        .catch(e => resolve(e))
                }))
        })
};
if (typeof client.downloadGoogleTakeout == 'undefined') {
    client.addCommand('downloadGoogleTakeout', downloadGoogleTakeout);
}
module.exports = downloadGoogleTakeout;
downloadGoogleTakeout;

