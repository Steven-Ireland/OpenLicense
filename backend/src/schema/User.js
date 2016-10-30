var db = require('mongoose');
var crypto = require('crypto');

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
});

userSchema.methods.generatePassword = function(plain_password, cb) {
	var my = this;
	var salt_hash = crypto.randomBytes(128).toString('base64');

	my.salt_hash = salt_hash;
 	encryptPassword(plain_password, salt_hash, (password_hash) => {
		my.password_hash = password_hash;
		cb();
	});
}

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

function encryptPassword(plain_password, salt_hash, cb) {
	crypto.pbkdf2(plain_password, salt_hash, 10000, 512, 'sha512', (err, bytes) => {
		var password_hash = bytes.toString('base64');
		cb(password_hash);
	});
}

var User = db.model('User', userSchema);

module.exports = User;
