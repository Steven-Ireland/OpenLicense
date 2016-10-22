var Product = require('../schema/Product');
var License = require('../schema/License');

/* https://licenseguru.com/license/ */
module.exports = function(express, db) {
	var router = express.Router();


	router.route('/register')
		.post(function(req, res) {
			var secret = req.body.secret;
			if (secret) {
				Product.findOne({'secret': secret}, (err, product) => {
					if (product) {
						var newLicense = new License();
						newLicense.generateHash(() => {
							newLicense.save();
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

	router.route('/status')
		.post(function(req, res) {
			res.end("VALID");
		});

	return router;
};
