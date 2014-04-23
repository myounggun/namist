module.exports = function (err) {
    if (!err) return null;

    var msg = err.message;

    switch (err.name) {
        case 'MongoError':
            if (msg.indexOf('$email') > -1) {
                msg = 'User already exists with email.';
            } else  if (msg.indexOf('$username') > -1) {
                msg = 'User already exists with username.';
            } else {
                msg = 'Sorry, service not available. Try again later';
            }

            break;
    }

    return msg;
};