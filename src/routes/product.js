var Product = require('../schema/Product');

/* https://licenseguru.com/product/ */
module.exports = function(express, db) {
	var router = express.Router();

	router.route('/register')
		.post(function(req, res) {
			var product_id = req.body.product_id;
			if (product_id) {
				var product = new Product();
				product.display_name="test product";
				product.product_id = product_id;
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
				res.end(JSON.stringify({error : 'no supplied product_id'}));
			}
		});


	return router;
};
