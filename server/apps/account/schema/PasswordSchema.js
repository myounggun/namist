var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var passwordSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 60*60*24 // 24h
    }
});

module.exports = passwordSchema;