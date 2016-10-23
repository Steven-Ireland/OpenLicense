var assert = require('assert');
var superagent = require('superagent');

describe('License Flow', function() {
	var product_id;
	var product_secret;
	var license_hash;
	step('allows creation of a product', function() {
		superagent.post("http://localhost:8080/product/register").end(function(err, res) {
			assert.ifError(err);
			var result = JSON.parse(res.text);
			assert(res.product_id);
			assert(res.secret);

			product_id = res.product_id;
			product_secret = res.product_secret;
		});
	});
	step('allows registration of a license with the secret', function() {
		superagent.post("http://localhost:8080/license/register")
			.send(JSON.stringify({'secret':product_secret}))
			.end(function(err, res) {
				assert.ifError(err);
				var result = JSON.parse(res.text);
				assert(res.license);

				license_hash = res.license;
			});
	});
	step('allows a license with a valid product id and secret', function() {
		superagent.post("http://localhost:8080/license/register")
			.send(JSON.stringify({'product_id':product_id, 'license':license_hash}))
			.end(function(err, res) {
				assert.ifError(err);
				assert('OK' === res.text);
			});
	});
});

describe('License Flow - Negative', function() {
	var bad_secret = 'foo';
	var bad_license = 'bar';
	var bad_product_id = 'no mans sky'

	it('disallows registration of a license with an incorrect secret', function() {
		superagent.post("http://localhost:8080/license/register")
			.send(JSON.stringify({'secret':bad_secret}))
			.end(function(err, res) {
				assert.ifError(err);
				var result = JSON.parse(res.text);
				assert(res.error);

				assert(res.error === 'bad secret');
			});
	});
	it('disallows a license with an invalid product id or secret', function() {
		superagent.post("http://localhost:8080/license/register")
			.send(JSON.stringify({'product_id':bad_product_id, 'license':bad_license}))
			.end(function(err, res) {
				assert.ifError(err);
				assert('OK' === res.text);
			});
	});
});
