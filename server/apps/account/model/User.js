var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    // 사용자 이름
    username: {
        type        : String,
        require     : true,
        trim        : true,
        unique      : true
    },
    // 사용자 사진
    avatar: {
        type        : String,
        default     : null
    },
    // 이메일 인증 여부 플래그
    authentication: {
        type        : Boolean,
        require     : true,
        trim        : true,
        default     : false
    },
    // 로컬 아이디, 비밀번호(이메일을 아이디로 사용함)
    local: {
        email: {
            type    : String,
            require : true,
            trim    : true,
            unique  : true
        },
        password: {
            type    : String,
            trim    : true
        }
    },
    // Facebook
    facebook: {
        id          : String,
        token       : String,
        email       : String,
        name        : String
    }
});

userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = mongoose.model('User', userSchema);