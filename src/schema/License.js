var db = require('mongoose');
var generate = require('../util/generate');

var license_length = 128;

var licenseSchema = db.Schema({
	license_hash: {
		type: String,
		unique: true,
		minlength: license_length,
		maxlength: license_length,
	},
	product_id: {
		type: db.Schema.Types.ObjectId,
		ref: 'Product',
	}
});

licenseSchema.methods.generateHash = function generateHash(cb) {
	var my = this;
	generate(license_length, isNewLicense, (license_hash) => {
		my.license_hash = license_hash;
		cb();
	});
};

var License = db.model('License', licenseSchema);

module.exports = License;

function isNewLicense(license_hash, cb) {
	License.findOne({'license_hash' : license_hash}, (err, foundLicense) => {
		if (foundLicense) {
			cb(false);
		} else {
			cb(true);
		}
	});
}
