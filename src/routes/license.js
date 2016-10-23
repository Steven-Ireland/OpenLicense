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
						newLicense.product_id = product.product_id;
						newLicense.generateHash(() => {
							newLicense.save((err) => {
								if (err) {
									res.end(JSON.stringify({error : 'there was an issue creating a license'}));
								} else {
									// TODO: actually bill for stuff
									return res.end(JSON.stringify({'license':newLicense.license_hash}));
								}

							});
						});
					} else {
						return res.end(JSON.stringify({'error':'bad secret'}));
					}
				});
			} else {
				res.end(JSON.stringify({error : 'no supplied secret'}));
			}
		});

	router.route('/check')
		.post(function(req, res) {
			var product_id = req.body.product_id;
			var license_hash = req.body.license;

			License.findOne({'product_id':product_id, 'license_hash':license_hash}, (err, license) => {
				if (license) {
					res.end("OK");
				} else {
					res.end("NO");
				}
			});
		});

	return router;
};
