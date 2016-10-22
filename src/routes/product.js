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
				console.log(product);
				res.end("Made product "+product.name);
			});
		});


	return router;
};
