var Product = require('../schema/Product');

/* https://licenseguru.com/product/ */
module.exports = function(express, db) {
	var router = express.Router();

	router.route('/register')
		.post(function(req, res) {
			var product = new Product();
			product.name="test product";
			product.generateSecret(() => {
				product.save();
				res.end(JSON.stringify({'product_id':product.product_id, 'secret':product.secret}));
			});
		});


	return router;
};
