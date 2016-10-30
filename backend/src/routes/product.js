var Product = require('../schema/Product');
var User = require('../schema/User');

/* https://licenseguru.com/product/ */
module.exports = function(express, db) {
	var router = express.Router();

	router.route('/register')
		.post(function(req, res) {
			var product_id = req.body.product_id;
			var display_name = req.body.display_name;
			var owner = req.body.owner;

			if (product_id && display_name && owner) {
				var product = new Product();

				User.findOne({email: owner}, (err, user) => {
					if (err) {
						res.end(JSON.stringify({error: 'error encountered while querying owner'}));
					} else {
						if (user) {
							product.product_id = product_id;
							product.display_name = display_name;
							product.owner = owner;
							product.generateSecret(() => {
								product.save((err) => {
									if (err) {
										res.end(JSON.stringify({error : 'that product_id is already taken'}));
									} else {
										res.end(JSON.stringify({'display_name':product.display_name,'product_id':product.product_id, 'secret':product.secret_hash}));
									}
								});
							});
						} else {
							res.end(JSON.stringify({error: 'owner not found'}));
						}
					}
				});
			} else {
				res.end(JSON.stringify({error : 'invalid params'}));
			}
		});


	return router;
};
