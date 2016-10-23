var assert = require('assert');
var Product = require('../../../dist/schema/Product');

describe('Mongoose - Product', function() {
	describe('#generateSecret', function() {
		it('should generate a valid unused secret', function() {
			var product = new Product();
			product.generateSecret(function() {
				assert(product.secret);
			});
		});
		it('should be 128 length', function() {
			var product = new Product();
			product.generateSecret(function() {
				assert(product.secret.length == 128);
			});
		});
	});
});
