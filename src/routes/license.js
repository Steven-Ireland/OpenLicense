var Product = require('../schema/Product');
var License = require('../schema/License');

/* https://licenseguru.com/license/ */
module.exports = function(express, db) {
	var router = express.Router();


	router.route('/register')
		.post(function(req, res) {
			var secret = req.body.secret;
			if (secret) {
				Product.findOne({'secret_hash': secret}, (err, product) => {
					if (product) {
						var newLicense = new License();
						newLicense.product_secret_hash = product.secret_hash;
						newLicense.generateHash(() => {
							newLicense.save();

							// TODO: actually bill for stuff
							res.end(JSON.stringify({'license':newLicense.license_hash}));
						});
					} else {
						res.end(JSON.stringify({'error':'bad secret'}));
					}
				});
			} else {
				res.end("404");
			}
		});

	router.route('/check')
		.post(function(req, res) {
			var secret_hash = req.body.secret;
			var license_hash = req.body.license;

			License.findOne({'product_secret_hash':secret_hash, 'license_hash':license_hash}, (err, license) => {
				if (license) {
					res.end("OK");
				} else {
					res.end("NO");
				}
			});
		});

	return router;
};
