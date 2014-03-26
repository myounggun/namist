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
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            expires: '1m'
        }
    });

module.exports = tokenScheme;