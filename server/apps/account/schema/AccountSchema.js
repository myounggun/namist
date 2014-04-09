var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var accountSchema = new Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    authentication: {
        type: Boolean,
        require: true,
        trim: true,
        default: false
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    }
});

module.exports = accountSchema;