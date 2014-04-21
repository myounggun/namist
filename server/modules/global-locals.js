module.exports = function(globalLocals) {
    return function middleware(req, res, next) {
        var locals = res.locals;

        for (var key in globalLocals) {
            if (!(key in res.locals)) {
                res.locals[key] = globalLocals[key];
            }
        }

        next();
    };
}