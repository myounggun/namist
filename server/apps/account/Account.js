/**
 * 
 */
var mongoose	= require('mongoose'),
	Schema		= mongoose.Schema,
	passport	= require('passport-local-mongoose');

var Account = new Schema({
	username: {type: String, require: true, trim: true, unique: true},
	authentication: {type: Boolean, require: true, trim: true},
	email: {type: String, require: true, trim: true, unique: true}
});

Account.plugin(passport);

module.exports = mongoose.model('Account', Account);