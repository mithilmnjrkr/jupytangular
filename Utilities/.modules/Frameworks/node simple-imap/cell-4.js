$$.async();
attachments = []
Promise.all(messages.map(message => {
    return Promise.all(imaps.getParts(message.attributes.struct)
        .filter((part) => part.disposition && part.disposition.type === 'ATTACHMENT')
        // retrieve the attachments only of the messages with attachments 
        .map((part) => connection.getPartData(message, part).then((partData) => ({
            filename: part.disposition.params.filename,
            data: partData
        }))))
        .then(a => attachments = attachments.concat(a));
})).then((o) => $$.done(attachments)).catch(e => $$.done(e));