var Product = require('../schema/Product');
var User = require('../schema/User');

/* https://licenseguru.com/product/ */
module.exports = function(express, db) {
	var router = express.Router();

	router.route('/register')
		.post(function(req, res) {
			var product_id = req.body.product_id;
			var display_name = req.body.display_name;
			var api_key = req.body.api_key;

			if (product_id && display_name && api_key) {
				var product = new Product();

				User.findOne({'api_key': api_key}, (err, user) => {
					if (err) {
						res.end(JSON.stringify({'error': 'error encountered while querying api key'}));
					} else {
						if (user) {
							product.product_id = product_id;
							product.display_name = display_name;
							product.owner = user.email;
							product.save((err) => {
								if (err) {
									res.end(JSON.stringify({'error' : 'that product_id is already taken'}));
								} else {
									res.end(JSON.stringify({'display_name':product.display_name,'product_id':product.product_id}));
								}
							});
						} else {
							res.end(JSON.stringify({'error': 'api key not found'}));
						}
					}
				});
			} else {
				res.end(JSON.stringify({'error' : 'invalid params'}));
			}
		});


	return router;
};
