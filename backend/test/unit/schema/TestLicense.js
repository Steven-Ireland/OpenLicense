var assert = require('assert');
var License = require('../../../../_dist/schema/License');

describe('Mongoose - License', function() {
	describe('#generateHash', function() {
		it('should generate a valid unused hash', function() {
			var license = new License();
			license.generateHash(function() {
				assert(license.license_hash);
			});
		});
		it('should be 128 length', function() {
			var license = new License();
			license.generateHash(function() {
				assert(license.license_hash.length == 128);
			});
		});
	});
});
