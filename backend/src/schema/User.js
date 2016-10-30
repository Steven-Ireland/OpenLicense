var db = require('mongoose');
var crypto = require('crypto');
var generate = require('../util/generate');

var api_key_length = 64;
var userSchema = db.Schema({
	email: {
		type: String,
		unique: true,
	},
	password_hash: {
		type: String,
	},
	salt_hash: {
		type: String,
	},
	api_key: {
		type: String,
		unique: true,
	},
});

userSchema.statics.getUser = function(email, plain_password, cb) {
	User.findOne({email:email}, (err, user) => {
		if (user) {
			encryptPassword(plain_password, user.salt_hash, (password_hash) => {
				if (password_hash === user.password_hash) {
					cb(user);
				} else {
					cb(null);
				}
			});
		} else {
			cb(null);
		}
	});
}

userSchema.methods.generatePassword = function(plain_password, cb) {
	var my = this;
	var salt_hash = crypto.randomBytes(128).toString('base64');

	my.salt_hash = salt_hash;
 	encryptPassword(plain_password, salt_hash, (password_hash) => {
		my.password_hash = password_hash;
		cb();
	});
}

function encryptPassword(plain_password, salt_hash, cb) {
	crypto.pbkdf2(plain_password, salt_hash, 10000, 512, 'sha512', (err, bytes) => {
		var password_hash = bytes.toString('base64');
		cb(password_hash);
	});
}

userSchema.methods.generateApiKey = function generateApiKey(cb) {
	var my = this;
	generate(api_key_length, isUniqueKey, (api_key) => {
		my.api_key = api_key;
		cb();
	});
};

function isUniqueKey(api_key, cb) {
	User.findOne({'api_key' : api_key}, (err, foundKey) => {
		if (foundKey) {
			cb(false);
		} else {
			cb(true);
		}
	});
}


var User = db.model('User', userSchema);

module.exports = User;
