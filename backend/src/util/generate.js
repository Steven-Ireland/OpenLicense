var validHashChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';


// TODO: crypto basically already does this, should use that or rework this.
function generate(length, constraint, cb) {
	var hash = '';
	for (var i = 0; i < length; i++) {
		var randomChar = validHashChars.charAt(Math.floor(Math.random() * validHashChars.length));
		var hash = hash + randomChar;
	}

	constraint(hash, (isValid) => {
		if (isValid) {
			return cb(hash)
		} else {
			generate(constraint, cb);
		}
	});

}

module.exports = generate;
