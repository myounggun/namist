module.exports = function (err) {
    if (!err) return null;

    var code = err.code,
        msg = (code ? getErrorMessage(code) : err.message);

    if (msg) {
        return msg;
    } else {
        return 'Sorry, service not available. Try again later'
    }
};

function getErrorMessage (code) {
    var msg = null;

    switch (code) {
        case 11000:
        case 11001:
            msg = 'User already exists with email';
            break;
    }

    return msg;
}