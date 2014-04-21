var mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    Schema = mongoose.Schema;

var passwordSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
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
        expires: 60 * 60 * 24 // 24h
    }
});

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