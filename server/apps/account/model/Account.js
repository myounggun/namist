var mongoose = require('mongoose'),
    passport = require('passport-local-mongoose'),
    accountSchema = require('../schema/AccountSchema');

accountSchema.plugin(passport);

module.exports = mongoose.model('Account', accountSchema);