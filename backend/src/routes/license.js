var Product = require('../schema/Product');
var License = require('../schema/License');
var User = require('../schema/User');

/* https://licenseguru.com/license/ */
module.exports = function(express, db) {
	var router = express.Router();

	router.route('/register')
		.post(function(req, res) {
			var api_key = req.body.api_key;
			var product_id = req.body.product_id;
			if (api_key && product_id) {
				User.findOne({'api_key': api_key}, (err, user) => {
					if (user) {
						Product.findOne({'product_id': product_id, 'owner': user.email}, (err, product) => {
							if (product) {
								var newLicense = new License();
								newLicense.product_id = product_id;
								newLicense.generateHash(() => {
									newLicense.save((err) => {
										if (err) {
											res.end(JSON.stringify({error : 'there was an issue creating a license'}));
										} else {
											// if I were a businessman, I would bill here.
											return res.end(JSON.stringify({'license':newLicense.license_hash}));
										}

									});
								});
							} else {
								return res.end(JSON.stringify({'error':'No product found for that product_id'}));
							}
						});
					} else {
						return res.end(JSON.stringify({'error':'No user found with that api key'}));
					}
				});
			} else {
				res.end(JSON.stringify({error : 'Invalid params'}));
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
