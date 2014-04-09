var mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    passwordSchema = require('../schema/PasswordSchema');

passwordSchema.methods.createPasswordToken = function (done) {
    var token = uuid.v4();

    this.set('token', token);
    this.save(function (err) {
        if (err) {
            return done(err);
        }

        return done(null, token);
    });
};

module.exports = mongoose.model('PasswordToken', passwordSchema);