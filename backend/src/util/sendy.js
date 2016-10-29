function sendy(res, val) {
	res.type('json');
	res.end(JSON.stringify({
		value: val
	}));
}

module.exports = sendy;
