var User = require('../schema/User');

/* https://licenseguru.com/portal/ */
module.exports = function(express, db) {
	var router = express.Router();

	router.route('/signup')
		.post(function(req, res) {
			var user = new User();

			var username = req.body.username;
			var password = req.body.password;

			if (username && password) {
				user.username = username;
				user.generatePassword(password, () => {
					user.save(() => {
						res.end(JSON.stringify({username:username}));
					});
				});
			} else {
				res.end(JSON.stringify({error: "Invalid params"}));
			}
		});

	return router;
};
