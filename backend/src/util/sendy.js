function sendy(res, val) {
	res.end(JSON.stringify({
		value: val
	}));
}

module.exports = sendy;
