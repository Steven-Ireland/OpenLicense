var Product = require('../schema/Product');
var License = require('../schema/License');
var sendy = require('../util/sendy');

/* https://licenseguru.com/portal/ */
module.exports = function(express, db) {
	var router = express.Router();

	router.route('/license/count/today')
		.get(function(req, res) {
			var today = new Date();
			var yesterday = new Date();
			yesterday.setDate(today.getDate() - 1);
			License.count({created_date: {$gte: yesterday}}, (err, num) => {
				sendy(res, num);
			});
		});

	router.route('/product/list')
		.get(function(req, res) {
			var user = req.session.user;
			Product.find({owner: user.email}, 'display_name product_id', (err, products) => {
				sendy(res, products);
			});
		});

	return router;
};
