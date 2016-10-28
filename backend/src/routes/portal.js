var Product = require('../schema/Product');

/* https://licenseguru.com/portal/ */
module.exports = function(express, db) {
	var router = express.Router();

	router.route('/')
		.get(function(req, res) {
			res.render("pages/index");
		});

	return router;
};
