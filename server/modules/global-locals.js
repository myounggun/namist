var app = require('express')();

module.exports = function(globalLocals) {
    for (var key in globalLocals) {
        app.locals[key] = globalLocals[key];
    }

    return function middleware(req, res, next) {
        var locals = {};
        for (var key in app.locals) if (app.locals.hasOwnProperty(key)) {
            locals[key] = app.locals[key];
        }

        res.locals = locals;
        next();
    };
}