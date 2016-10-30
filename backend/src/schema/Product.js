var db = require('mongoose');
var generate = require('../util/generate');

var secret_length = 128;
var productSchema = db.Schema({
	display_name: {
		type: String,
	},
	product_id: {
		type: String,
		unique: true,
		minlength: 3,
	},
	owner: {
		type: String,
	},
});

var Product = db.model('Product', productSchema);

module.exports = Product;
