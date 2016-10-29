var User = require('../schema/User');

/* https://licenseguru.com/portal/ */
module.exports = function(express, db) {
	var router = express.Router();

	router.route('/signup')
		.post(function(req, res) {
			var user = new User();

			var email = req.body.email;
			var password = req.body.password;

			if (email && password) {
				user.email = email;
				console.log(user);

				user.generatePassword(password, () => {
					console.log(user);
					user.save((err) => {
						if (err) {
							res.end(JSON.stringify({error: "There was an error creating this user"}));
						} else {
							res.end(JSON.stringify({email:email}));
						}
					});
				});
			} else {
				res.end(JSON.stringify({error: "Invalid params"}));
			}
		});

	router.route('/login')
		.post(function(req, res) {
			if (!req.session.user) {
				var email = req.body.email;
				var password = req.body.password;

				if (email && password) {
					User.getUser(email, password, (user) => {
						if (user) {
							req.session.user = user;
							res.end(JSON.stringify({user: email}));
						} else {
							res.end(JSON.stringify({error: 'No user for those credentials found'}));
						}
					});
				} else {
					res.end(JSON.stringify({error: "Invalid params"}));
				}
			}
		});

	return router;
};
