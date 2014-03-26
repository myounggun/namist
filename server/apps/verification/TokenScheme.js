var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    tokenScheme = new Schema({
        _userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Account'
        },
        token: {
            type: String,
            required: true
        },
        verified: {
            type: Boolean,
            require: true,
            default: false
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            // expires: '4h'
            expires: 120
        }
    });

module.exports = tokenScheme;