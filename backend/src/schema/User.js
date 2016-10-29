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
	product_ids: [{
		type: String,
	}],
});

userSchema.methods.generatePassword = function(plaintext, cb) {
	var my = this;
	var salt_hash = crypto.randomBytes(128).toString('base64');

	my.salt_hash = salt_hash;
 	crypto.pbkdf2(plaintext, salt_hash, 10000, 512, 'sha512', (err, bytes) => {
		var password_hash = bytes.toString('base64');
		my.password_hash = password_hash;
		cb();
	});
}

var User = db.model('User', userSchema);

module.exports = User;
