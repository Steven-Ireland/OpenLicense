var db = require('mongoose');
var generate = require('../util/generate');

var secret_length = 128;
var productSchema = db.Schema({
	display_name: {
		type: String,
	},
	secret: {
		type: String,
		unique: true,
		minlength: secret_length,
		maxlength: secret_length,
	},
});

productSchema.methods.generateSecret = function generateSecret(cb) {
	var my = this;
	generate(secret_length, isNewSecret, (secret_hash) => {
		my.secret = secret_hash;
		cb();
	});
};

var Product = db.model('Product', productSchema);

module.exports = Product;

function isNewSecret(secret_hash, cb) {
	Product.findOne({'secret' : secret_hash}, (err, foundProduct) => {
		if (foundProduct) {
			cb(false);
		} else {
			cb(true);
		}
	});
}
